package com.example.backend.repository;

import com.example.backend.model.RateLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

public interface RateLimitRepository extends JpaRepository<RateLimit, String> {

    /** Adds one to a live counter. Returns 0 if there is none (missing or expired). */
    @Modifying
    @Transactional
    @Query("update RateLimit r set r.hits = r.hits + 1 where r.id = :key and r.expiresAt > :now")
    int increment(@Param("key") String key, @Param("now") Instant now);

    @Modifying
    @Transactional
    @Query("delete from RateLimit r where r.id = :key")
    int remove(@Param("key") String key);

    @Modifying
    @Transactional
    @Query("delete from RateLimit r where r.expiresAt <= :now")
    int removeExpired(@Param("now") Instant now);
}
