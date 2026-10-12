package com.example.backend.security;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Throttles password guessing. Failures are counted per account and per client
 * address; either one reaching its limit blocks further attempts for the window.
 * In-memory, so it covers a single server instance.
 */
@Service
public class LoginAttemptService {

    static final int MAX_PER_ACCOUNT = 10;
    static final int MAX_PER_ADDRESS = 20;
    static final Duration WINDOW = Duration.ofMinutes(15);
    private static final int MAX_TRACKED = 100_000;

    private record Attempts(int count, Instant windowStart) {}

    private final Map<String, Attempts> attempts = new ConcurrentHashMap<>();

    public boolean isBlocked(String email, String address) {
        return count("account:" + email) >= MAX_PER_ACCOUNT
                || count("address:" + address) >= MAX_PER_ADDRESS;
    }

    public void recordFailure(String email, String address) {
        if (attempts.size() > MAX_TRACKED) {
            Instant cutoff = Instant.now().minus(WINDOW);
            attempts.values().removeIf(a -> a.windowStart().isBefore(cutoff));
        }
        increment("account:" + email);
        increment("address:" + address);
    }

    /** A correct password clears the account counter; the address counter stays. */
    public void recordSuccess(String email) {
        attempts.remove("account:" + email);
    }

    private int count(String key) {
        Attempts current = attempts.get(key);
        if (current == null) return 0;
        if (current.windowStart().plus(WINDOW).isBefore(Instant.now())) {
            attempts.remove(key, current);
            return 0;
        }
        return current.count();
    }

    private void increment(String key) {
        Instant now = Instant.now();
        attempts.merge(key, new Attempts(1, now), (old, fresh) ->
                old.windowStart().plus(WINDOW).isBefore(now) ? fresh : new Attempts(old.count() + 1, old.windowStart()));
    }
}
