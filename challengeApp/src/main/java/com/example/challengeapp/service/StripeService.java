package com.example.challengeapp.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class StripeService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentIntent createPaymentIntent(Long amount, String currency, String description, String receiptEmail) throws StripeException {
        // Convert amount to cents (Stripe uses smallest currency unit)
        long amountInCents = amount * 100;

        PaymentIntentCreateParams.Builder builder = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(currency)
                .setDescription(description)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                );

        if (receiptEmail != null && !receiptEmail.trim().isEmpty()) {
            builder.setReceiptEmail(receiptEmail);
        }

        return PaymentIntent.create(builder.build());
    }

    public PaymentIntent confirmPaymentIntent(String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent.confirm();
    }

    public PaymentIntent retrievePaymentIntent(String paymentIntentId) throws StripeException {
        return PaymentIntent.retrieve(paymentIntentId);
    }

    public Map<String, String> createPaymentResponse(PaymentIntent paymentIntent) {
        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());
        response.put("paymentIntentId", paymentIntent.getId());
        response.put("status", paymentIntent.getStatus());
        return response;
    }
}

