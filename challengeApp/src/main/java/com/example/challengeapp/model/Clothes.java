package com.example.challengeapp.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "clothes")
@Data
public class Clothes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;
    private String image;

}
