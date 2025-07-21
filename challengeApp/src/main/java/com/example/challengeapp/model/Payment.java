package com.example.challengeapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payments")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientName;

    private String paymentMethod;

    private Double amount;

    private String paymentStatus;

    private String transactionId;

    private Long orderId;

    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date paymentDate;
}
