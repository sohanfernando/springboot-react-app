package com.example.challengeapp.repository;

import com.example.challengeapp.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByCategoryAndSubcategory(String category, String subcategory);
} 