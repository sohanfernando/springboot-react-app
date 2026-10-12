package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private List<String> images; // URLs or file paths, min 1, max 6

    /**
     * Which colour each image belongs to, keyed by the image URL.
     *
     * Keyed rather than held as a list parallel to {@code images} so the two
     * can never drift out of step, and so products saved before this existed
     * simply have no entries — an image with no entry belongs to every colour.
     */
    @ElementCollection
    @CollectionTable(
            name = "product_image_colors",
            joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "image_url", length = 255)
    @Column(name = "color_name")
    private Map<String, String> imageColors = new HashMap<>();

    /**
     * Colour for each newly uploaded file, in the same order as the multipart
     * "images" parts. Not persisted — it only carries the assignment from the
     * client through to save time, once the URLs are known.
     */
    @Transient
    private List<String> newImageColors;

    @ElementCollection
    private List<String> colors;

    @ElementCollection
    private List<String> sizes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
