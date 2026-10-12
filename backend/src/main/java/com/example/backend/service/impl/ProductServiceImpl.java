package com.example.backend.service.impl;

import com.example.backend.model.Product;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final String uploadDir = "uploads/products/";
    private static final int MIN_IMAGES = 1;
    private static final int MAX_IMAGES = 6;

    @Override
    public Product createProduct(Product product, List<MultipartFile> images) {
        if (images == null || images.size() < MIN_IMAGES || images.size() > MAX_IMAGES) {
            throw new RuntimeException(
                    "Product must have between " + MIN_IMAGES + " and " + MAX_IMAGES + " images.");
        }
        if (product.getDescription() != null) {
            int wordCount = product.getDescription().trim().split("\\s+").length;
            if (wordCount > 200) {
                throw new RuntimeException("Description cannot exceed 200 words.");
            }
        }
        requireValidStock(product.getStock());
        List<String> imageUrls = saveImages(images);
        product.setImages(imageUrls);
        product.setImageColors(
                colorsForNewImages(imageUrls, product.getNewImageColors(), product.getColors()));
        product.setNewImageColors(null);
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
        requireValidStock(updated.getStock());
        product.setStock(updated.getStock());
        product.setCategory(updated.getCategory());
        product.setSubcategory(updated.getSubcategory());
        product.setColors(updated.getColors());
        product.setSizes(updated.getSizes());
        // Rebuild the gallery from the images the client kept plus any new
        // uploads. Previously this only ever appended, so an image removed in
        // the edit form was never actually removed on the server.
        List<String> finalImages = new ArrayList<>();
        if (updated.getImages() != null) {
            finalImages.addAll(updated.getImages());
        } else if (product.getImages() != null) {
            finalImages.addAll(product.getImages());
        }
        List<String> uploadedUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            uploadedUrls = saveImages(images);
            finalImages.addAll(uploadedUrls);
        }
        if (finalImages.size() < MIN_IMAGES || finalImages.size() > MAX_IMAGES) {
            throw new RuntimeException(
                    "Product must have between " + MIN_IMAGES + " and " + MAX_IMAGES + " images.");
        }
        product.setImages(finalImages);

        // Colour assignments: the ones the client kept for existing images,
        // plus the ones it sent alongside the new uploads.
        Map<String, String> finalColors = new HashMap<>();
        Set<String> validColors = new LinkedHashSet<>(
                updated.getColors() != null ? updated.getColors() : List.of());

        if (updated.getImageColors() != null) {
            updated.getImageColors().forEach((url, color) -> {
                if (finalImages.contains(url) && isUsableColor(color, validColors)) {
                    finalColors.put(url, color.trim());
                }
            });
        }
        finalColors.putAll(
                colorsForNewImages(uploadedUrls, updated.getNewImageColors(), updated.getColors()));
        product.setImageColors(finalColors);
        product.setNewImageColors(null);
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
        if (product.getImages().size() + images.size() > MAX_IMAGES) {
            throw new RuntimeException("Product can have at most " + MAX_IMAGES + " images.");
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

    /**
     * Pairs each newly saved image URL with the colour the client picked for
     * it. A colour that is not one of the product's own colours is dropped, so
     * a renamed or deleted colour leaves the image showing for every colour
     * rather than disappearing from the gallery entirely.
     */
    private Map<String, String> colorsForNewImages(
            List<String> urls, List<String> pickedColors, List<String> productColors) {
        Map<String, String> assigned = new HashMap<>();
        if (urls == null || pickedColors == null) return assigned;

        Set<String> validColors = new LinkedHashSet<>(
                productColors != null ? productColors : List.of());

        for (int i = 0; i < urls.size() && i < pickedColors.size(); i++) {
            String color = pickedColors.get(i);
            if (isUsableColor(color, validColors)) {
                assigned.put(urls.get(i), color.trim());
            }
        }
        return assigned;
    }

    /** Null is allowed and means the product's stock is not tracked. */
    private void requireValidStock(Integer stock) {
        if (stock != null && stock < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock cannot be negative.");
        }
    }

    private boolean isUsableColor(String color, Set<String> validColors) {
        return color != null && !color.isBlank() && validColors.contains(color.trim());
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