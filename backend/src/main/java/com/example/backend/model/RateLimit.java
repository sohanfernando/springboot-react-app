package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/** One counter per throttled thing (an account, a client address), valid until it expires. */
@Entity
@Table(name = "rate_limits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RateLimit {
    /** SHA-256 of the real key, so emails and addresses are not stored in the clear. */
    @Id
    @Column(name = "limit_key", length = 64)
    private String id;

    @Column(name = "hits", nullable = false)
    private int hits;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;
}
