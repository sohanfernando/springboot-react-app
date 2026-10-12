package com.example.backend.repository;

import com.example.backend.model.Payment;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    void deleteByOrderId(Long orderId);

    boolean existsByStripePaymentIntentId(String stripePaymentIntentId);

    /** Row-locked read, so two orders racing for the same payment cannot both claim it. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Payment> findWithLockById(Long id);
}
