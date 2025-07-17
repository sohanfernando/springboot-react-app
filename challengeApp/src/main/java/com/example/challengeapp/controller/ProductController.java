package com.example.challengeapp.controller;

import com.example.challengeapp.model.Product;
import com.example.challengeapp.service.ProductService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/products")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class ProductController {
    private final ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestPart("product") Product product,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            return ResponseEntity.ok(productService.createProduct(product, images));
        } catch (Exception e) {
            logger.error("Error creating product", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") Product product,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return ResponseEntity.ok(productService.updateProduct(id, product, images));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/category/{category}/subcategory/{subcategory}")
    public ResponseEntity<List<Product>> getProductsByCategoryAndSubcategory(
            @PathVariable String category,
            @PathVariable String subcategory) {
        return ResponseEntity.ok(productService.getProductsByCategoryAndSubcategory(category, subcategory));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<Product> addImages(
            @PathVariable Long id,
            @RequestPart("images") List<MultipartFile> images) {
        return ResponseEntity.ok(productService.addImages(id, images));
    }

    @DeleteMapping("/{id}/images/{imageIndex}")
    public ResponseEntity<Product> removeImage(
            @PathVariable Long id,
            @PathVariable int imageIndex) {
        return ResponseEntity.ok(productService.removeImage(id, imageIndex));
    }
} 