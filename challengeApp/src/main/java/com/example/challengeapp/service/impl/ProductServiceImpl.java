package com.example.challengeapp.service.impl;

import com.example.challengeapp.model.Product;
import com.example.challengeapp.repository.ProductRepository;
import com.example.challengeapp.service.ProductService;
import com.example.challengeapp.util.FileValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final FileValidationUtil fileValidationUtil;
    
    @Value("${app.upload.dir:uploads/products/}")
    private String uploadDir;

    @Override
    @Transactional
    public Product createProduct(Product product, List<MultipartFile> images) {
        validateProduct(product, images);
        
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = saveImages(images);
            product.setImages(imageUrls);
        }
        
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product updatedProduct, List<MultipartFile> images) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update basic fields
        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setCategory(updatedProduct.getCategory());
        product.setSubcategory(updatedProduct.getSubcategory());
        product.setColors(updatedProduct.getColors());
        product.setSizes(updatedProduct.getSizes());

        // Validate the updated product
        validateProductUpdate(product, images);

        // Handle image updates
        if (images != null && !images.isEmpty()) {
            List<String> existingImages = product.getImages() != null ? new ArrayList<>(product.getImages()) : new ArrayList<>();
            List<String> newImageUrls = saveImages(images);
            
            existingImages.addAll(newImageUrls);
            
            if (existingImages.size() > 5) {
                throw new RuntimeException("Product can have at most 5 images.");
            }
            
            product.setImages(existingImages);
        }

        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Delete associated image files
        if (product.getImages() != null) {
            for (String imageUrl : product.getImages()) {
                deleteImageFile(imageUrl);
            }
        }
        
        productRepository.delete(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getProductsByCategoryAndSubcategory(String category, String subcategory) {
        return productRepository.findByCategoryAndSubcategory(category, subcategory);
    }

    @Override
    @Transactional
    public Product addImages(Long id, List<MultipartFile> images) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<String> existingImages = product.getImages() != null ? new ArrayList<>(product.getImages()) : new ArrayList<>();
        
        if (images != null && !images.isEmpty()) {
            if (existingImages.size() + images.size() > 5) {
                throw new RuntimeException("Product can have at most 5 images.");
            }
            
            List<String> newImageUrls = saveImages(images);
            existingImages.addAll(newImageUrls);
            product.setImages(existingImages);
        }

        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product removeImage(Long id, int imageIndex) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<String> images = product.getImages();
        if (images == null || imageIndex < 0 || imageIndex >= images.size()) {
            throw new RuntimeException("Invalid image index.");
        }

        if (images.size() <= 1) {
            throw new RuntimeException("Product must have at least 1 image.");
        }

        String removedImageUrl = images.remove(imageIndex);
        deleteImageFile(removedImageUrl);
        
        product.setImages(images);
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    private void validateProduct(Product product, List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            throw new RuntimeException("Product must have at least 1 image.");
        }
        
        if (images.size() > 5) {
            throw new RuntimeException("Product can have at most 5 images.");
        }
        
        // Validate each image file
        for (MultipartFile image : images) {
            if (!fileValidationUtil.isValidImageFile(image)) {
                throw new RuntimeException("Invalid image file: " + image.getOriginalFilename());
            }
        }
        
        validateProductData(product);
    }

    private void validateProductUpdate(Product product, List<MultipartFile> images) {
        if (images != null) {
            for (MultipartFile image : images) {
                if (!fileValidationUtil.isValidImageFile(image)) {
                    throw new RuntimeException("Invalid image file: " + image.getOriginalFilename());
                }
            }
        }
        
        validateProductData(product);
    }

    private void validateProductData(Product product) {
        if (product.getDescription() != null && product.getDescription().split("\\s+").length > 200) {
            throw new RuntimeException("Description cannot exceed 200 words.");
        }
    }

    private List<String> saveImages(List<MultipartFile> images) {
        List<String> urls = new ArrayList<>();
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        
        for (MultipartFile file : images) {
            String filename = fileValidationUtil.generateUniqueFilename(file.getOriginalFilename());
            Path path = Paths.get(uploadDir + filename);
            try {
                Files.write(path, file.getBytes());
                urls.add("/uploads/products/" + filename);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image: " + filename, e);
            }
        }
        return urls;
    }

    private void deleteImageFile(String imageUrl) {
        try {
            if (imageUrl != null && imageUrl.startsWith("/uploads/products/")) {
                String filename = imageUrl.substring("/uploads/products/".length());
                Path path = Paths.get(uploadDir + filename);
                Files.deleteIfExists(path);
            }
        } catch (IOException e) {
            // Log the error but don't throw exception as it's cleanup
            System.err.println("Failed to delete image file: " + imageUrl);
        }
    }
} 