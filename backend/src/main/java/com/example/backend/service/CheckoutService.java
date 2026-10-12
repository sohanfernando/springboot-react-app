package com.example.backend.service;

import com.example.backend.model.Order;
import com.example.backend.model.Payment;
import com.example.backend.model.Product;
import com.example.backend.model.StoreSettings;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.security.AuthUser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * The only place money is calculated. The browser sends which products and how
 * many; every price, the shipping fee and the total come from here, so nothing
 * a customer edits in their browser can change what they are charged.
 */
@Service
@RequiredArgsConstructor
public class CheckoutService {

    public static final String METHOD_STRIPE = "Stripe";
    public static final String METHOD_COD = "Cash on Delivery";
    public static final String STATUS_SUCCESS = "Success";

    private static final int MAX_LINES = 100;
    private static final int MAX_QUANTITY = 99;

    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final StoreSettingsService settingsService;
    private final ObjectMapper objectMapper;

    /**
     * A priced bag, carrying the store settings it was priced under so every
     * decision about it uses the same figures. {@code itemsJson} is the bag
     * with each price replaced by the catalogue price.
     */
    public record Quote(BigDecimal subtotal, BigDecimal shipping, BigDecimal total, String itemsJson,
                        StoreSettings settings, Map<Long, Integer> trackedQuantities) {

        public boolean codAllowed() {
            return total.compareTo(settings.getCodLimit()) <= 0;
        }

        public String codRefusedMessage() {
            return settings.getCodLimit().signum() == 0
                    ? "Cash on delivery is not available. Please pay by card."
                    : "Orders above Rs " + new DecimalFormat("#,##0.##").format(settings.getCodLimit())
                            + " must be paid by card.";
        }

        /** How much more the bag needs for free delivery; zero once it qualifies or delivery is free anyway. */
        public BigDecimal remainingForFreeShipping() {
            if (shipping.signum() == 0) return BigDecimal.ZERO;
            return settings.getFreeShippingThreshold().subtract(subtotal).max(BigDecimal.ZERO);
        }

        /** Card payments are taken in whole rupees. */
        public long cardAmountInRupees() {
            return total.setScale(0, java.math.RoundingMode.HALF_UP).longValueExact();
        }

        public Map<String, Object> toResponse() {
            return Map.of("subtotal", subtotal, "shipping", shipping, "total", total,
                    "cardTotal", cardAmountInRupees(), "codAllowed", codAllowed(),
                    "codLimit", settings.getCodLimit(),
                    "freeShippingThreshold", settings.getFreeShippingThreshold(),
                    "remainingForFreeShipping", remainingForFreeShipping());
        }
    }

    /** Accepts the bag either as a JSON array or as a string containing one. */
    public Quote quote(Object items) {
        return quote(toArray(items));
    }

    private Quote quote(ArrayNode items) {
        if (items.isEmpty()) throw badRequest("Your bag is empty.");
        if (items.size() > MAX_LINES) throw badRequest("Your bag has too many items.");

        List<Long> ids = new ArrayList<>();
        for (JsonNode item : items) ids.add(productId(item));
        Map<Long, Product> products = productRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        BigDecimal subtotal = BigDecimal.ZERO;
        ArrayNode priced = objectMapper.createArrayNode();
        // Per product, not per line: the same product can appear on two lines.
        Map<Long, Integer> trackedQuantities = new LinkedHashMap<>();
        for (JsonNode item : items) {
            Product product = products.get(productId(item));
            if (product == null || product.getPrice() == null || product.getPrice() <= 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Something in your bag is no longer available. Please review your bag.");
            }
            int quantity = quantity(item);
            BigDecimal price = BigDecimal.valueOf(product.getPrice());
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(quantity)));

            if (product.getStock() != null) {
                int wanted = trackedQuantities.merge(product.getId(), quantity, Integer::sum);
                if (wanted > product.getStock()) throw notEnoughStock(product);
            }

            ObjectNode line = item.isObject() ? ((ObjectNode) item).deepCopy() : objectMapper.createObjectNode();
            line.put("id", product.getId());
            line.put("name", product.getName());
            line.put("price", product.getPrice());
            line.put("quantity", quantity);
            priced.add(line);
        }

        StoreSettings settings = settingsService.get();
        BigDecimal shipping = subtotal.compareTo(settings.getFreeShippingThreshold()) > 0
                ? BigDecimal.ZERO : settings.getShippingFee();
        return new Quote(subtotal, shipping, subtotal.add(shipping), priced.toString(), settings,
                trackedQuantities);
    }

    private static ResponseStatusException notEnoughStock(Product product) {
        String message = product.getStock() <= 0
                ? product.getName() + " is sold out. Please remove it from your bag."
                : "Only " + product.getStock() + " left of " + product.getName() + ". Please reduce the quantity.";
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }

    /**
     * Stores the order with a server-calculated total, but only against a
     * payment that belongs to the caller, has not been used for another order,
     * and is for exactly this amount.
     */
    @Transactional
    public Order placeOrder(Order request, AuthUser caller) {
        Quote quote = quote(request.getItems());

        if (request.getPaymentId() == null) throw badRequest("This order has no payment.");
        Payment payment = paymentRepository.findWithLockById(request.getPaymentId())
                .orElseThrow(() -> badRequest("This order has no payment."));

        if (!caller.id().equals(payment.getUserId()) || payment.getOrderId() != null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "That payment cannot be used for this order.");
        }

        boolean card = METHOD_STRIPE.equals(payment.getPaymentMethod());
        if (card && !STATUS_SUCCESS.equals(payment.getPaymentStatus())) {
            throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "The payment has not completed.");
        }
        if (!card && !quote.codAllowed()) {
            throw badRequest(quote.codRefusedMessage());
        }
        BigDecimal expected = card ? BigDecimal.valueOf(quote.cardAmountInRupees()) : quote.total();
        if (payment.getAmount() == null || BigDecimal.valueOf(payment.getAmount()).compareTo(expected) != 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Your bag changed after payment started. Please start checkout again.");
        }

        // The quote saw enough stock a moment ago; this is the check that
        // counts, because it tests and takes the stock in one statement. If
        // someone else got there first, the whole order rolls back.
        for (Map.Entry<Long, Integer> line : quote.trackedQuantities().entrySet()) {
            if (productRepository.takeStock(line.getKey(), line.getValue()) == 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Something in your bag just sold out. Please review your bag.");
            }
        }

        Order order = new Order();
        order.setUserId(caller.id());
        order.setItems(quote.itemsJson());
        order.setTotal(expected.doubleValue());
        order.setRecipientName(request.getRecipientName());
        order.setAddress(request.getAddress());
        order.setCity(request.getCity());
        order.setPostalCode(request.getPostalCode());
        order.setStatus("processing");
        order.setPaymentId(payment.getId());
        Order saved = orderRepository.save(order);

        payment.setOrderId(saved.getId());
        paymentRepository.save(payment);
        return saved;
    }

    private ArrayNode toArray(Object items) {
        try {
            JsonNode node = items instanceof String text ? objectMapper.readTree(text) : objectMapper.valueToTree(items);
            if (node instanceof ArrayNode array) return array;
        } catch (JsonProcessingException | IllegalArgumentException e) {
            // falls through to the same error as a non-array
        }
        throw badRequest("Your bag could not be read. Please start checkout again.");
    }

    private static long productId(JsonNode item) {
        JsonNode id = item.get("id");
        if (id != null && id.isIntegralNumber()) return id.asLong();
        if (id != null && id.isTextual() && id.asText().matches("\\d{1,18}")) return Long.parseLong(id.asText());
        throw badRequest("Your bag could not be read. Please start checkout again.");
    }

    private static int quantity(JsonNode item) {
        JsonNode quantity = item.get("quantity");
        if (quantity == null || !quantity.isIntegralNumber()
                || quantity.asLong() < 1 || quantity.asLong() > MAX_QUANTITY) {
            throw badRequest("Quantities must be between 1 and " + MAX_QUANTITY + ".");
        }
        return quantity.asInt();
    }

    private static ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
