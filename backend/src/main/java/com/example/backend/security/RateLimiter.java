package com.example.backend.security;

import com.example.backend.model.RateLimit;
import com.example.backend.repository.RateLimitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;

/**
 * Counts events per key over a time window. The counters are rows in the
 * database, so they survive a restart and are shared by every server instance
 * behind a load balancer.
 */
@Service
@RequiredArgsConstructor
public class RateLimiter {

    private final RateLimitRepository repository;

    /** True once the key has been hit {@code limit} times within its current window. */
    public boolean isBlocked(String key, int limit) {
        return repository.findById(hash(key))
                .filter(counter -> counter.getExpiresAt().isAfter(Instant.now()))
                .map(counter -> counter.getHits() >= limit)
                .orElse(false);
    }

    /** Counts one event. The first event in a window starts the clock. */
    public void hit(String key, Duration window) {
        String id = hash(key);
        Instant now = Instant.now();
        if (repository.increment(id, now) > 0) return;

        try {
            repository.remove(id); // an expired counter, if any
            repository.saveAndFlush(new RateLimit(id, 1, now.plus(window)));
        } catch (DataIntegrityViolationException e) {
            // Another request created the counter in the same instant; count on it.
            repository.increment(id, now);
        }
    }

    public void reset(String key) {
        repository.remove(hash(key));
    }

    @Scheduled(fixedDelay = 60 * 60 * 1000, initialDelay = 60 * 1000)
    public void purgeExpired() {
        repository.removeExpired(Instant.now());
    }

    private static String hash(String key) {
        try {
            return HexFormat.of().formatHex(
                    MessageDigest.getInstance("SHA-256").digest(key.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is always available", e);
        }
    }
}
