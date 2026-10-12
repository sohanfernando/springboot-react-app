package com.example.backend;

import com.example.backend.model.Order;
import com.example.backend.model.User;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.UUID;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Runs requests through the real security filter chain against an in-memory database. */
@SpringBootTest(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.sql.init.mode=never",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
class SecurityIntegrationTest {
    private static final String PASSWORD = "correct-horse-battery";

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    private static String uniqueEmail() {
        return "u" + UUID.randomUUID().toString().replace("-", "") + "@example.com";
    }

    private static String json(String name, String email, String password) {
        return "{\"name\":\"" + name + "\",\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
    }

    private static MockHttpServletRequestBuilder withToken(MockHttpServletRequestBuilder request, String token) {
        return request.header(HttpHeaders.AUTHORIZATION, "Bearer " + token);
    }

    /** Signs up through the public endpoint and returns the response body. */
    private JsonNode signUp(String email) throws Exception {
        String body = mockMvc.perform(post("/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("Test", email, PASSWORD)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body);
    }

    private String userToken() throws Exception {
        return signUp(uniqueEmail()).get("token").asText();
    }

    /** Admins cannot come from signup, so one is stored directly and then logs in normally. */
    private String adminToken() throws Exception {
        String email = uniqueEmail();
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(PASSWORD));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        String body = mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body).get("token").asText();
    }

    @Test
    void signupCannotGrantTheAdminRole() throws Exception {
        String email = uniqueEmail();
        mockMvc.perform(post("/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Mallory\",\"email\":\"" + email + "\",\"password\":\"" + PASSWORD
                                + "\",\"role\":\"ADMIN\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("USER"));

        assertEquals("USER", userRepository.findByEmail(email).orElseThrow().getRole());
    }

    @Test
    void authResponsesNeverContainThePasswordHash() throws Exception {
        mockMvc.perform(post("/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("Test", uniqueEmail(), PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(content().string(not(containsString("$2a$"))));
    }

    @Test
    void protectedEndpointsRejectAnonymousCallers() throws Exception {
        mockMvc.perform(get("/users")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/orders")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/orders/mine")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/orders/1")).andExpect(status().isUnauthorized());
        mockMvc.perform(delete("/api/orders/1")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/payments")).andExpect(status().isUnauthorized());
        mockMvc.perform(delete("/api/payments/1")).andExpect(status().isUnauthorized());
        mockMvc.perform(delete("/admin/products/1")).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/payments/create-payment-intent")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":100}"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(patch("/users/1").contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"x\"}"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/users/admins").contentType(MediaType.APPLICATION_JSON)
                        .content(json("Mallory", uniqueEmail(), PASSWORD)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void theCatalogueStaysPublic() throws Exception {
        mockMvc.perform(get("/admin/products")).andExpect(status().isOk());
        mockMvc.perform(get("/admin/products/category/Men")).andExpect(status().isOk());
    }

    @Test
    void aCustomerTokenCannotReachAdminEndpoints() throws Exception {
        String token = userToken();

        mockMvc.perform(withToken(get("/users"), token)).andExpect(status().isForbidden());
        mockMvc.perform(withToken(get("/api/orders"), token)).andExpect(status().isForbidden());
        mockMvc.perform(withToken(delete("/api/orders/1"), token)).andExpect(status().isForbidden());
        mockMvc.perform(withToken(patch("/api/orders/1/status"), token)
                        .contentType(MediaType.APPLICATION_JSON).content("\"delivered\""))
                .andExpect(status().isForbidden());
        mockMvc.perform(withToken(get("/api/payments"), token)).andExpect(status().isForbidden());
        mockMvc.perform(withToken(delete("/api/payments/1"), token)).andExpect(status().isForbidden());
        mockMvc.perform(withToken(delete("/admin/products/1"), token)).andExpect(status().isForbidden());
        mockMvc.perform(withToken(post("/users/admins"), token).contentType(MediaType.APPLICATION_JSON)
                        .content(json("Mallory", uniqueEmail(), PASSWORD)))
                .andExpect(status().isForbidden());
    }

    @Test
    void anAdminTokenReachesAdminEndpointsAndCanCreateAnotherAdmin() throws Exception {
        String token = adminToken();
        String newAdminEmail = uniqueEmail();

        mockMvc.perform(withToken(get("/users"), token)).andExpect(status().isOk());
        mockMvc.perform(withToken(get("/api/orders"), token)).andExpect(status().isOk());
        mockMvc.perform(withToken(post("/users/admins"), token).contentType(MediaType.APPLICATION_JSON)
                        .content(json("Second Admin", newAdminEmail, PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void forgedAndTamperedTokensAreRejected() throws Exception {
        long adminId = userRepository.save(adminUser()).getId();
        String forged = new JwtService("an-attacker-chosen-signing-key-0123456789", 60).issue(adminId);
        String real = userToken();
        String tampered = real.substring(0, real.length() - 2) + (real.endsWith("AA") ? "BB" : "AA");

        mockMvc.perform(withToken(get("/users"), forged)).andExpect(status().isUnauthorized());
        mockMvc.perform(withToken(get("/api/orders/mine"), tampered)).andExpect(status().isUnauthorized());
        mockMvc.perform(withToken(get("/api/orders/mine"), "not-a-token")).andExpect(status().isUnauthorized());
    }

    @Test
    void aDeletedUsersTokenStopsWorking() throws Exception {
        JsonNode account = signUp(uniqueEmail());
        String token = account.get("token").asText();
        mockMvc.perform(withToken(get("/api/orders/mine"), token)).andExpect(status().isOk());

        userRepository.deleteById(account.get("id").asLong());

        mockMvc.perform(withToken(get("/api/orders/mine"), token)).andExpect(status().isUnauthorized());
    }

    @Test
    void usersCanOnlyEditTheirOwnProfile() throws Exception {
        JsonNode alice = signUp(uniqueEmail());
        JsonNode bob = signUp(uniqueEmail());

        mockMvc.perform(withToken(patch("/users/" + alice.get("id").asLong()), bob.get("token").asText())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Hijacked\"}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(withToken(patch("/users/" + alice.get("id").asLong()), alice.get("token").asText())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"city\":\"Colombo\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Colombo"))
                .andExpect(jsonPath("$.password").doesNotExist());

        assertEquals("Test", userRepository.findById(alice.get("id").asLong()).orElseThrow().getName());
    }

    @Test
    void usersOnlySeeTheirOwnOrders() throws Exception {
        JsonNode alice = signUp(uniqueEmail());
        JsonNode bob = signUp(uniqueEmail());

        Order bobsOrder = new Order();
        bobsOrder.setUserId(bob.get("id").asLong());
        bobsOrder.setTotal(10.0);
        long orderId = orderRepository.save(bobsOrder).getId();

        mockMvc.perform(withToken(get("/api/orders/" + orderId), alice.get("token").asText()))
                .andExpect(status().isForbidden());
        mockMvc.perform(withToken(get("/api/orders/mine"), alice.get("token").asText()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
        mockMvc.perform(withToken(get("/api/orders/mine"), bob.get("token").asText()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void wrongPasswordAndUnknownEmailLookIdentical() throws Exception {
        String email = uniqueEmail();
        signUp(email);

        String wrongPassword = mockMvc.perform(post("/users/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"wrong-password\"}"))
                .andExpect(status().isUnauthorized())
                .andReturn().getResponse().getContentAsString();
        String unknownEmail = mockMvc.perform(post("/users/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + uniqueEmail() + "\",\"password\":\"wrong-password\"}"))
                .andExpect(status().isUnauthorized())
                .andReturn().getResponse().getContentAsString();

        assertEquals(wrongPassword, unknownEmail);
    }

    @Test
    void crossOriginRequestsAreOnlyAllowedFromTheConfiguredFrontend() throws Exception {
        mockMvc.perform(options("/users/login")
                        .header(HttpHeaders.ORIGIN, "https://evil.example")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));

        mockMvc.perform(options("/users/login")
                        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }

    private User adminUser() {
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail(uniqueEmail());
        admin.setPassword(passwordEncoder.encode(PASSWORD));
        admin.setRole("ADMIN");
        return admin;
    }
}
