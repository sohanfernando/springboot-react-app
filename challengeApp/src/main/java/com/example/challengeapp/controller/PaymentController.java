package com.example.challengeapp.controller;

import com.example.challengeapp.model.Payment;
import com.example.challengeapp.repository.PaymentRepository;
import com.example.challengeapp.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {
    private final PaymentRepository paymentRepository;
    private final StripeService stripeService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> request) {
        try {
            Long amount = Long.valueOf(request.get("amount").toString());
            String description = request.getOrDefault("description", "Order Payment").toString();
            String currency = request.getOrDefault("currency", "usd").toString();

            PaymentIntent paymentIntent = stripeService.createPaymentIntent(amount, currency, description);
            Map<String, String> response = stripeService.createPaymentResponse(paymentIntent);
            
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create payment intent: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, Object> request) {
        try {
            String paymentIntentId = request.get("paymentIntentId").toString();
            PaymentIntent paymentIntent = stripeService.confirmPaymentIntent(paymentIntentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", paymentIntent.getStatus());
            response.put("paymentIntentId", paymentIntent.getId());
            
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/payment-intent/{paymentIntentId}")
    public ResponseEntity<?> getPaymentIntent(@PathVariable String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = stripeService.retrievePaymentIntent(paymentIntentId);
            Map<String, Object> response = new HashMap<>();
            response.put("status", paymentIntent.getStatus());
            response.put("amount", paymentIntent.getAmount());
            response.put("currency", paymentIntent.getCurrency());
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        payment.setPaymentDate(new Date());
        payment.setPaymentStatus("Pending");
        payment.setTransactionId(UUID.randomUUID().toString());
        Payment saved = paymentRepository.save(payment);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/stripe-payment")
    public ResponseEntity<?> createStripePayment(@RequestBody Map<String, Object> request) {
        try {
            String paymentIntentId = request.get("paymentIntentId").toString();
            String recipientName = request.get("recipientName").toString();
            Double amount = Double.valueOf(request.get("amount").toString());
            String address = request.getOrDefault("address", "").toString();
            String city = request.getOrDefault("city", "").toString();
            String postalCode = request.getOrDefault("postalCode", "").toString();

            // Verify payment intent status
            PaymentIntent paymentIntent = stripeService.retrievePaymentIntent(paymentIntentId);
            
            Payment payment = new Payment();
            payment.setRecipientName(recipientName);
            payment.setPaymentMethod("Stripe");
            payment.setAmount(amount);
            payment.setPaymentDate(new Date());
            payment.setStripePaymentIntentId(paymentIntentId);
            payment.setTransactionId(paymentIntentId);
            
            if ("succeeded".equals(paymentIntent.getStatus())) {
                payment.setPaymentStatus("Success");
            } else {
                payment.setPaymentStatus(paymentIntent.getStatus());
            }

            Payment saved = paymentRepository.save(payment);
            return ResponseEntity.ok(saved);
        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create payment: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PatchMapping("/{id}/order")
    public ResponseEntity<Payment> updatePaymentOrderId(@PathVariable Long id, @RequestBody Long orderId) {
        Payment payment = paymentRepository.findById(id).orElseThrow();
        payment.setOrderId(orderId);
        Payment saved = paymentRepository.save(payment);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<?> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }
} 