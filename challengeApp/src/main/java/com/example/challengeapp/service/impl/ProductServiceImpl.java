package com.example.challengeapp.service.impl;

import com.example.challengeapp.model.Product;
import com.example.challengeapp.repository.ProductRepository;
import com.example.challengeapp.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final String uploadDir = "uploads/products/";

    @Override
    public Product createProduct(Product product, List<MultipartFile> images) {
        if (images == null || images.size() < 1 || images.size() > 5) {
            throw new RuntimeException("Product must have between 1 and 5 images.");
        }
        if (product.getDescription() != null) {
            int wordCount = product.getDescription().trim().split("\\s+").length;
            if (wordCount > 200) {
                throw new RuntimeException("Description cannot exceed 200 words.");
            }
        }
        List<String> imageUrls = saveImages(images);
        product.setImages(imageUrls);
        product.setColors(product.getColors());
        product.setSizes(product.getSizes());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product updated, List<MultipartFile> images) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(updated.getName());
        product.setDescription(updated.getDescription());
        product.setPrice(updated.getPrice());
        product.setCategory(updated.getCategory());
        product.setSubcategory(updated.getSubcategory());
        product.setColors(updated.getColors());
        product.setSizes(updated.getSizes());
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = saveImages(images);
            product.getImages().addAll(imageUrls);
            if (product.getImages().size() > 5) {
                throw new RuntimeException("Product can have at most 5 images.");
            }
        }
        if (updated.getDescription() != null) {
            int wordCount = updated.getDescription().trim().split("\\s+").length;
            if (wordCount > 200) {
                throw new RuntimeException("Description cannot exceed 200 words.");
            }
        }
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Override
    public List<Product> getProductsByCategoryAndSubcategory(String category, String subcategory) {
        return productRepository.findByCategoryAndSubcategory(category, subcategory);
    }

    @Override
    public Product addImages(Long id, List<MultipartFile> images) {
        Product product = getProductById(id);
        if (product.getImages().size() + images.size() > 5) {
            throw new RuntimeException("Product can have at most 5 images.");
        }
        List<String> imageUrls = saveImages(images);
        product.getImages().addAll(imageUrls);
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    public Product removeImage(Long id, int imageIndex) {
        Product product = getProductById(id);
        if (imageIndex < 0 || imageIndex >= product.getImages().size()) {
            throw new RuntimeException("Invalid image index.");
        }
        product.getImages().remove(imageIndex);
        if (product.getImages().isEmpty()) {
            throw new RuntimeException("Product must have at least 1 image.");
        }
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    private List<String> saveImages(List<MultipartFile> images) {
        List<String> urls = new ArrayList<>();
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        for (MultipartFile file : images) {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir + filename);
            try {
                Files.write(path, file.getBytes());
                urls.add("/" + uploadDir + filename);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image: " + filename);
            }
        }
        return urls;
    }
} 