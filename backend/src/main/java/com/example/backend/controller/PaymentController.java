package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.Payment;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.security.AuthUser;
import com.example.backend.service.CheckoutService;
import com.example.backend.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private static final String CURRENCY = "lkr";
    private static final String INTENT_SUCCEEDED = "succeeded";

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final StripeService stripeService;
    private final CheckoutService checkoutService;

    /** The amount is priced here from the bag; the request carries no amount. */
    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> request,
                                                 @AuthenticationPrincipal AuthUser caller) {
        CheckoutService.Quote quote = checkoutService.quote(request.get("items"));
        try {
            PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                    quote.cardAmountInRupees(), CURRENCY, "Order payment", caller.email(), caller.id());
            Map<String, Object> response = new HashMap<>(stripeService.createPaymentResponse(paymentIntent));
            response.put("amount", quote.cardAmountInRupees());
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return stripeError(e);
        }
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, Object> request,
                                            @AuthenticationPrincipal AuthUser caller) {
        try {
            String paymentIntentId = String.valueOf(request.get("paymentIntentId"));
            requireOwner(stripeService.retrievePaymentIntent(paymentIntentId), caller);
            PaymentIntent paymentIntent = stripeService.confirmPaymentIntent(paymentIntentId);

            Map<String, Object> response = new HashMap<>();
            response.put("status", paymentIntent.getStatus());
            response.put("paymentIntentId", paymentIntent.getId());
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return stripeError(e);
        }
    }

    @GetMapping("/payment-intent/{paymentIntentId}")
    public ResponseEntity<?> getPaymentIntent(@PathVariable String paymentIntentId,
                                              @AuthenticationPrincipal AuthUser caller) {
        try {
            PaymentIntent paymentIntent = stripeService.retrievePaymentIntent(paymentIntentId);
            requireOwner(paymentIntent, caller);
            Map<String, Object> response = new HashMap<>();
            response.put("status", paymentIntent.getStatus());
            response.put("amount", paymentIntent.getAmount());
            response.put("currency", paymentIntent.getCurrency());
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return stripeError(e);
        }
    }

    /** Cash on delivery. Priced from the bag, and refused above the cash limit. */
    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Map<String, Object> request,
                                                 @AuthenticationPrincipal AuthUser caller) {
        CheckoutService.Quote quote = checkoutService.quote(request.get("items"));
        if (!quote.codAllowed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, quote.codRefusedMessage());
        }

        Payment payment = new Payment();
        payment.setUserId(caller.id());
        payment.setRecipientName(text(request.get("recipientName")));
        payment.setPaymentMethod(CheckoutService.METHOD_COD);
        payment.setAmount(quote.total().doubleValue());
        payment.setPaymentDate(new Date());
        payment.setPaymentStatus("Pending");
        payment.setTransactionId(UUID.randomUUID().toString());
        return ResponseEntity.ok(paymentRepository.save(payment));
    }

    /**
     * Records a card payment. Everything that matters is read back from Stripe:
     * that it succeeded, who it was created for, and how much was charged.
     */
    @PostMapping("/stripe-payment")
    public ResponseEntity<?> createStripePayment(@RequestBody Map<String, Object> request,
                                                 @AuthenticationPrincipal AuthUser caller) {
        try {
            String paymentIntentId = String.valueOf(request.get("paymentIntentId"));
            PaymentIntent paymentIntent = stripeService.retrievePaymentIntent(paymentIntentId);
            requireOwner(paymentIntent, caller);

            if (!INTENT_SUCCEEDED.equals(paymentIntent.getStatus())) {
                throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "The payment has not completed.");
            }
            // One Stripe charge buys one order, not several.
            if (paymentRepository.existsByStripePaymentIntentId(paymentIntent.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "This payment has already been used.");
            }

            Payment payment = new Payment();
            payment.setUserId(caller.id());
            payment.setRecipientName(text(request.get("recipientName")));
            payment.setPaymentMethod(CheckoutService.METHOD_STRIPE);
            payment.setAmount(paymentIntent.getAmount() / 100.0);
            payment.setPaymentDate(new Date());
            payment.setStripePaymentIntentId(paymentIntent.getId());
            payment.setTransactionId(paymentIntent.getId());
            payment.setPaymentStatus(CheckoutService.STATUS_SUCCESS);
            return ResponseEntity.ok(paymentRepository.save(payment));
        } catch (StripeException e) {
            return stripeError(e);
        }
    }

    /** Placing an order already links its payment; this remains for admin corrections. */
    @PatchMapping("/{id}/order")
    public ResponseEntity<Payment> updatePaymentOrderId(@PathVariable Long id, @RequestBody Long orderId,
                                                        @AuthenticationPrincipal AuthUser caller) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found."));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found."));

        if (!caller.isAdmin()) {
            boolean ownsOrder = caller.id().equals(order.getUserId());
            boolean orderNamesPayment = id.equals(order.getPaymentId());
            boolean alreadyLinkedElsewhere = payment.getOrderId() != null && !payment.getOrderId().equals(orderId);
            if (!ownsOrder || !orderNamesPayment || alreadyLinkedElsewhere) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot change this payment.");
            }
        }

        payment.setOrderId(orderId);
        return ResponseEntity.ok(paymentRepository.save(payment));
    }

    /** Admin only (enforced in SecurityConfig). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    /** Admin only (enforced in SecurityConfig). */
    @GetMapping
    public ResponseEntity<?> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    private static void requireOwner(PaymentIntent paymentIntent, AuthUser caller) {
        Map<String, String> metadata = paymentIntent.getMetadata();
        String owner = metadata == null ? null : metadata.get(StripeService.METADATA_USER_ID);
        if (!caller.isAdmin() && !String.valueOf(caller.id()).equals(owner)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "That payment does not belong to you.");
        }
    }

    private static String text(Object value) {
        String text = value == null ? "" : value.toString().trim();
        return text.length() > 255 ? text.substring(0, 255) : text;
    }

    private static ResponseEntity<Map<String, String>> stripeError(StripeException e) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", e.getMessage()));
    }
}
