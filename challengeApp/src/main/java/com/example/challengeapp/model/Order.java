package com.example.challengeapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Lob;

@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    @Lob
    private String items; // Store cart items as JSON string
    private Double total;

    private String recipientName;
    private String address;
    private String city;
    private String postalCode;

    private String status = "processing";
}
