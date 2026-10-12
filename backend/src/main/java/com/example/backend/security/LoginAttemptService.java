package com.example.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Throttles password guessing. Failures are counted per account and per client
 * address; either one reaching its limit blocks further attempts for the window.
 */
@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    static final int MAX_PER_ACCOUNT = 10;
    static final int MAX_PER_ADDRESS = 20;
    static final Duration WINDOW = Duration.ofMinutes(15);

    private final RateLimiter rateLimiter;

    public boolean isBlocked(String email, String address) {
        return rateLimiter.isBlocked(accountKey(email), MAX_PER_ACCOUNT)
                || rateLimiter.isBlocked(addressKey(address), MAX_PER_ADDRESS);
    }

    public void recordFailure(String email, String address) {
        rateLimiter.hit(accountKey(email), WINDOW);
        rateLimiter.hit(addressKey(address), WINDOW);
    }

    /** A correct password clears the account counter; the address counter stays. */
    public void recordSuccess(String email) {
        rateLimiter.reset(accountKey(email));
    }

    private static String accountKey(String email) {
        return "login-account:" + email;
    }

    private static String addressKey(String address) {
        return "login-address:" + address;
    }
}
