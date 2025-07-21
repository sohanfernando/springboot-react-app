package com.example.challengeapp.controller;

import com.example.challengeapp.model.Payment;
import com.example.challengeapp.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {
    private final PaymentRepository paymentRepository;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        payment.setPaymentDate(new Date());
        payment.setPaymentStatus("Success");
        payment.setTransactionId(UUID.randomUUID().toString());
        Payment saved = paymentRepository.save(payment);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/order")
    public ResponseEntity<Payment> updatePaymentOrderId(@PathVariable Long id, @RequestBody Long orderId) {
        Payment payment = paymentRepository.findById(id).orElseThrow();
        payment.setOrderId(orderId);
        Payment saved = paymentRepository.save(payment);
        return ResponseEntity.ok(saved);
    }
} 