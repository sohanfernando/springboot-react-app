package com.example.challengeapp.service;

import com.example.challengeapp.model.Product;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ProductService {
    Product createProduct(Product product, List<MultipartFile> images);
    Product updateProduct(Long id, Product product, List<MultipartFile> images);
    void deleteProduct(Long id);
    List<Product> getAllProducts();
    Product getProductById(Long id);
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByCategoryAndSubcategory(String category, String subcategory);
    Product addImages(Long id, List<MultipartFile> images);
    Product removeImage(Long id, int imageIndex);
} 