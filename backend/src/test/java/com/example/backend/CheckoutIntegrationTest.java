package com.example.backend;

import com.example.backend.model.Order;
import com.example.backend.model.Payment;
import com.example.backend.model.Product;
import com.example.backend.model.User;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.StoreSettingsRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import com.example.backend.service.StripeService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.model.PaymentIntent;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Checkout through the real security chain and database, with Stripe itself stubbed. */
@SpringBootTest(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.sql.init.mode=never",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
class CheckoutIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private ProductRepository productRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private StoreSettingsRepository settingsRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private JwtService jwtService;
    @MockitoBean private StripeService stripeService;

    private long cheapId;   // Rs 1,000
    private long dearId;    // Rs 4,000

    private record Account(long id, String token) {}

    @BeforeEach
    void setUp() {
        cheapId = product("Belt", 1000.0);
        dearId = product("Coat", 4000.0);
    }

    /** Settings are shared state, so each test starts again from the defaults (500 / 5,000 / 3,000). */
    @AfterEach
    void resetSettings() {
        settingsRepository.deleteAll();
    }

    private Account admin() {
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("a" + UUID.randomUUID().toString().replace("-", "") + "@example.com");
        admin.setPassword("not-used");
        admin.setRole("ADMIN");
        long id = userRepository.save(admin).getId();
        return new Account(id, jwtService.issue(id));
    }

    private ResultActions saveSettings(Account account, String json) throws Exception {
        return mockMvc.perform(put("/api/settings")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + account.token())
                .contentType(MediaType.APPLICATION_JSON).content(json));
    }

    private long product(String name, double price) {
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        return productRepository.save(product).getId();
    }

    private Account account() throws Exception {
        String email = "u" + UUID.randomUUID().toString().replace("-", "") + "@example.com";
        String body = mockMvc.perform(post("/users/signup").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test\",\"email\":\"" + email + "\",\"password\":\"correct-horse\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        JsonNode json = objectMapper.readTree(body);
        return new Account(json.get("id").asLong(), json.get("token").asText());
    }

    private ResultActions send(Account account, String path, String json) throws Exception {
        return mockMvc.perform(post(path)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + account.token())
                .contentType(MediaType.APPLICATION_JSON).content(json));
    }

    private static String items(long productId, int quantity) {
        return "[{\"id\":" + productId + ",\"quantity\":" + quantity + "}]";
    }

    private long idOf(ResultActions result) throws Exception {
        return objectMapper.readTree(result.andReturn().getResponse().getContentAsString()).get("id").asLong();
    }

    private long cashPayment(Account account, String items) throws Exception {
        return idOf(send(account, "/api/payments", "{\"recipientName\":\"Test\",\"items\":" + items + "}")
                .andExpect(status().isOk()));
    }

    /** Makes Stripe report a succeeded intent of the given amount, created for the given user. */
    private void stripeHasSucceededIntent(String intentId, long rupees, long ownerId) throws Exception {
        PaymentIntent intent = new PaymentIntent();
        intent.setId(intentId);
        intent.setStatus("succeeded");
        intent.setAmount(rupees * 100);
        intent.setMetadata(Map.of(StripeService.METADATA_USER_ID, String.valueOf(ownerId)));
        Mockito.when(stripeService.retrievePaymentIntent(intentId)).thenReturn(intent);
    }

    private long cardPayment(Account account, String intentId) throws Exception {
        return idOf(send(account, "/api/payments/stripe-payment",
                "{\"paymentIntentId\":\"" + intentId + "\",\"recipientName\":\"Test\"}")
                .andExpect(status().isOk()));
    }

    private static String orderJson(String itemsAsJsonString, long paymentId, String extraFields) {
        return "{\"items\":" + itemsAsJsonString + ",\"paymentId\":" + paymentId
                + ",\"recipientName\":\"Test\",\"address\":\"1 Road\",\"city\":\"Colombo\",\"postalCode\":\"01500\""
                + extraFields + "}";
    }

    /** The frontend sends the bag as a JSON string inside the order. */
    private String asJsonString(String json) throws Exception {
        return objectMapper.writeValueAsString(json);
    }

    @Test
    void quoteUsesCataloguePricesAndAddsShipping() throws Exception {
        Account customer = account();

        // A forged price in the bag is ignored.
        send(customer, "/api/orders/quote", "{\"items\":[{\"id\":" + cheapId + ",\"quantity\":2,\"price\":1}]}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subtotal").value(2000.0))
                .andExpect(jsonPath("$.shipping").value(500))
                .andExpect(jsonPath("$.total").value(2500.0))
                .andExpect(jsonPath("$.codAllowed").value(true));

        send(customer, "/api/orders/quote", "{\"items\":" + items(dearId, 2) + "}")
                .andExpect(jsonPath("$.shipping").value(0))
                .andExpect(jsonPath("$.total").value(8000.0))
                .andExpect(jsonPath("$.codAllowed").value(false));
    }

    @Test
    void anOrderIsStoredWithTheServerTotalWhateverTheBrowserSends() throws Exception {
        Account customer = account();
        long paymentId = cashPayment(customer, items(cheapId, 2));
        String forgedBag = "[{\"id\":" + cheapId + ",\"quantity\":2,\"price\":1,\"selectedSize\":\"M\"}]";

        long orderId = idOf(send(customer, "/api/orders",
                orderJson(asJsonString(forgedBag), paymentId, ",\"total\":1,\"userId\":999,\"status\":\"delivered\",\"id\":1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(2500.0))
                .andExpect(jsonPath("$.status").value("processing"))
                .andExpect(jsonPath("$.userId").value(customer.id())));

        Order stored = orderRepository.findById(orderId).orElseThrow();
        assertEquals(2500.0, stored.getTotal());
        JsonNode line = objectMapper.readTree(stored.getItems()).get(0);
        assertEquals(1000.0, line.get("price").asDouble());
        assertEquals("M", line.get("selectedSize").asText());
        assertEquals(orderId, paymentRepository.findById(paymentId).orElseThrow().getOrderId());
    }

    @Test
    void cashOnDeliveryIsRefusedAboveTheLimit() throws Exception {
        send(account(), "/api/payments", "{\"recipientName\":\"Test\",\"items\":" + items(dearId, 1) + "}")
                .andExpect(status().isBadRequest());
    }

    @Test
    void aCashPaymentForASmallBagCannotBuyABiggerOne() throws Exception {
        Account customer = account();
        long paymentId = cashPayment(customer, items(cheapId, 1));

        send(customer, "/api/orders", orderJson(asJsonString(items(cheapId, 2)), paymentId, ""))
                .andExpect(status().isConflict());
    }

    @Test
    void theCardAmountIsPricedByTheServerForTheSignedInUser() throws Exception {
        Account customer = account();
        PaymentIntent intent = new PaymentIntent();
        intent.setId("pi_created");
        Mockito.when(stripeService.createPaymentIntent(any(), anyString(), anyString(), anyString(), any()))
                .thenReturn(intent);

        // Coat 4,000 + shipping 500; the "amount" field is a forgery attempt.
        send(customer, "/api/payments/create-payment-intent", "{\"amount\":1,\"items\":" + items(dearId, 1) + "}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(4500));

        Mockito.verify(stripeService).createPaymentIntent(eq(4500L), eq("lkr"), anyString(), anyString(), eq(customer.id()));
    }

    @Test
    void aCardPaymentIsRecordedFromWhatStripeReportsNotWhatTheBrowserClaims() throws Exception {
        Account customer = account();
        stripeHasSucceededIntent("pi_paid", 4500, customer.id());

        send(customer, "/api/payments/stripe-payment",
                "{\"paymentIntentId\":\"pi_paid\",\"recipientName\":\"Test\",\"amount\":999999}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(4500.0))
                .andExpect(jsonPath("$.paymentStatus").value("Success"));

        // The same Stripe charge cannot be recorded twice.
        send(customer, "/api/payments/stripe-payment", "{\"paymentIntentId\":\"pi_paid\",\"recipientName\":\"Test\"}")
                .andExpect(status().isConflict());
    }

    @Test
    void anUnfinishedOrSomeoneElsesCardPaymentIsRefused() throws Exception {
        Account customer = account();
        Account other = account();

        PaymentIntent unpaid = new PaymentIntent();
        unpaid.setId("pi_unpaid");
        unpaid.setStatus("requires_payment_method");
        unpaid.setAmount(450000L);
        unpaid.setMetadata(Map.of(StripeService.METADATA_USER_ID, String.valueOf(customer.id())));
        Mockito.when(stripeService.retrievePaymentIntent("pi_unpaid")).thenReturn(unpaid);
        send(customer, "/api/payments/stripe-payment", "{\"paymentIntentId\":\"pi_unpaid\",\"recipientName\":\"Test\"}")
                .andExpect(status().isPaymentRequired());

        stripeHasSucceededIntent("pi_theirs", 4500, other.id());
        send(customer, "/api/payments/stripe-payment", "{\"paymentIntentId\":\"pi_theirs\",\"recipientName\":\"Test\"}")
                .andExpect(status().isForbidden());
    }

    @Test
    void aCardPaymentBuysExactlyTheBagItPaidForOnce() throws Exception {
        Account customer = account();
        stripeHasSucceededIntent("pi_once", 1500, customer.id()); // Belt 1,000 + shipping 500
        long paymentId = cardPayment(customer, "pi_once");

        // Paid for the belt, tries to take the coat.
        send(customer, "/api/orders", orderJson(asJsonString(items(dearId, 1)), paymentId, ""))
                .andExpect(status().isConflict());

        send(customer, "/api/orders", orderJson(asJsonString(items(cheapId, 1)), paymentId, ""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1500.0));

        // The payment is spent.
        send(customer, "/api/orders", orderJson(asJsonString(items(cheapId, 1)), paymentId, ""))
                .andExpect(status().isForbidden());
    }

    @Test
    void anotherUsersPaymentCannotBeUsed() throws Exception {
        Account victim = account();
        Account thief = account();
        long victimsPayment = cashPayment(victim, items(cheapId, 1));

        send(thief, "/api/orders", orderJson(asJsonString(items(cheapId, 1)), victimsPayment, ""))
                .andExpect(status().isForbidden());

        Payment untouched = paymentRepository.findById(victimsPayment).orElseThrow();
        assertEquals(null, untouched.getOrderId());
    }

    @Test
    void badBagsAreRejected() throws Exception {
        Account customer = account();

        send(customer, "/api/orders/quote", "{\"items\":[]}").andExpect(status().isBadRequest());
        send(customer, "/api/orders/quote", "{}").andExpect(status().isBadRequest());
        send(customer, "/api/orders/quote", "{\"items\":" + items(cheapId, 0) + "}").andExpect(status().isBadRequest());
        send(customer, "/api/orders/quote", "{\"items\":" + items(cheapId, -5) + "}").andExpect(status().isBadRequest());
        send(customer, "/api/orders/quote", "{\"items\":[{\"id\":" + cheapId + ",\"quantity\":1.5}]}")
                .andExpect(status().isBadRequest());
        send(customer, "/api/orders/quote", "{\"items\":" + items(987654321L, 1) + "}").andExpect(status().isConflict());
        send(customer, "/api/orders", "{\"items\":" + asJsonString(items(cheapId, 1)) + "}")
                .andExpect(status().isBadRequest());
    }

    @Test
    void anyoneCanReadSettingsAndPriceABagWithoutSigningIn() throws Exception {
        mockMvc.perform(get("/api/settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shippingFee").value(500))
                .andExpect(jsonPath("$.freeShippingThreshold").value(5000))
                .andExpect(jsonPath("$.codLimit").value(3000));

        mockMvc.perform(post("/api/orders/quote").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"items\":" + items(cheapId, 1) + "}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1500.0))
                .andExpect(jsonPath("$.remainingForFreeShipping").value(4000.0));
    }

    @Test
    void onlyAnAdminCanChangeSettings() throws Exception {
        String body = "{\"shippingFee\":0,\"freeShippingThreshold\":0,\"codLimit\":999999}";

        mockMvc.perform(put("/api/settings").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnauthorized());
        saveSettings(account(), body).andExpect(status().isForbidden());

        mockMvc.perform(get("/api/settings")).andExpect(jsonPath("$.shippingFee").value(500));
    }

    @Test
    void settingsAnAdminSavesChangeWhatCheckoutCharges() throws Exception {
        Account customer = account();
        saveSettings(admin(), "{\"shippingFee\":250,\"freeShippingThreshold\":1500,\"codLimit\":10000}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shippingFee").value(250));

        // Belt 1,000 is under the new threshold: the new fee applies.
        send(customer, "/api/orders/quote", "{\"items\":" + items(cheapId, 1) + "}")
                .andExpect(jsonPath("$.shipping").value(250))
                .andExpect(jsonPath("$.total").value(1250.0));

        // Coat 4,000 is now above the threshold and inside the cash limit.
        send(customer, "/api/orders/quote", "{\"items\":" + items(dearId, 1) + "}")
                .andExpect(jsonPath("$.shipping").value(0))
                .andExpect(jsonPath("$.total").value(4000.0))
                .andExpect(jsonPath("$.codAllowed").value(true));

        long paymentId = cashPayment(customer, items(dearId, 1));
        send(customer, "/api/orders", orderJson(asJsonString(items(dearId, 1)), paymentId, ""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(4000.0));
    }

    @Test
    void aZeroCashLimitTurnsCashOnDeliveryOff() throws Exception {
        saveSettings(admin(), "{\"shippingFee\":500,\"freeShippingThreshold\":5000,\"codLimit\":0}")
                .andExpect(status().isOk());

        send(account(), "/api/payments", "{\"recipientName\":\"Test\",\"items\":" + items(cheapId, 1) + "}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cash on delivery is not available. Please pay by card."));
    }

    @Test
    void invalidSettingsAreRejected() throws Exception {
        Account admin = admin();

        saveSettings(admin, "{\"shippingFee\":-1,\"freeShippingThreshold\":5000,\"codLimit\":3000}")
                .andExpect(status().isBadRequest());
        saveSettings(admin, "{\"shippingFee\":500,\"codLimit\":3000}")
                .andExpect(status().isBadRequest());
        saveSettings(admin, "{\"shippingFee\":500,\"freeShippingThreshold\":5000,\"codLimit\":1e12}")
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/settings")).andExpect(jsonPath("$.shippingFee").value(500));
    }
}
