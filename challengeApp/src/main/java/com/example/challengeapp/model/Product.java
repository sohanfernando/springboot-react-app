package com.example.challengeapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Double price;
    private String category; // Men, Women, Accessories
    private String subcategory; // e.g. T-Shirts, Dresses, Bags

    @ElementCollection
    private List<String> images; // URLs or file paths, min 1, max 5

    @ElementCollection
    private List<String> colors;

    @ElementCollection
    private List<String> sizes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
