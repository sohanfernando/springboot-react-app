package com.example.backend.service;

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

    private static final String PLACEHOLDER = "YOUR_STRIPE_SECRET_KEY";

    @Value("${app.stripe.secret-key}")
    private String stripeSecretKey;

    /**
     * A missing or wrong-account key gives no signal until a payment fails, so
     * say so loudly at startup and name the account, which is what the
     * storefront's VITE_STRIPE_PUBLISHABLE_KEY has to match.
     */
    @PostConstruct
    public void init() {
        if (stripeSecretKey == null || stripeSecretKey.isBlank() || PLACEHOLDER.equals(stripeSecretKey)) {
            log.error("""
                    STRIPE IS NOT CONFIGURED — card payments will fail.
                    app.stripe.secret-key resolved to a placeholder. Set STRIPE_SECRET_KEY in
                    src/main/resources/.env or as an environment variable.""");
            return;
        }

        Stripe.apiKey = stripeSecretKey;
        log.info("Stripe initialised in {} mode for account '{}'. The storefront's "
                        + "VITE_STRIPE_PUBLISHABLE_KEY must be a pk_ key from this same account.",
                stripeSecretKey.startsWith("sk_live_") ? "LIVE" : "TEST",
                accountSegment(stripeSecretKey));
    }

    /**
     * The account identifier Stripe embeds in every key — sk_test_51Pp5EuK...
     * yields "51Pp5EuK". It also appears in the matching publishable key, so it
     * is the quickest way to confirm the two halves belong together, and it is
     * not itself a secret.
     */
    private String accountSegment(String key) {
        String[] parts = key.split("_", 3);
        if (parts.length < 3) return "unrecognised";
        return parts[2].substring(0, Math.min(8, parts[2].length()));
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

