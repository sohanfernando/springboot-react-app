package com.example.challengeapp.service.impl;

import com.example.challengeapp.model.Product;
import com.example.challengeapp.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProductServiceImplTest {
    private ProductRepository productRepository;
    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        productRepository = Mockito.mock(ProductRepository.class);
        productService = new ProductServiceImpl(productRepository);
    }

    @Test
    void testCreateProduct() {
        Product product = new Product();
        product.setName("Test Product");
        List<MultipartFile> images = new ArrayList<>();
        MultipartFile mockFile = Mockito.mock(MultipartFile.class);
        try {
            Mockito.when(mockFile.getBytes()).thenReturn(new byte[0]);
        } catch (Exception e) {
            fail("Mocking getBytes failed");
        }
        images.add(mockFile);
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);
        Product result = productService.createProduct(product, images);
        assertEquals("Test Product", result.getName());
    }

    @Test
    void testGetAllProducts() {
        List<Product> products = new ArrayList<>();
        Product p = new Product();
        p.setName("Test");
        products.add(p);
        when(productRepository.findAll()).thenReturn(products);
        List<Product> result = productService.getAllProducts();
        assertEquals(1, result.size());
        assertEquals("Test", result.get(0).getName());
    }

    @Test
    void testGetProductById() {
        Product p = new Product();
        p.setId(1L);
        p.setName("Test");
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));
        Product result = productService.getProductById(1L);
        assertEquals(1L, result.getId());
        assertEquals("Test", result.getName());
    }

    @Test
    void testUpdateProduct() {
        Product existing = new Product();
        existing.setId(1L);
        existing.setName("Old");
        Product updated = new Product();
        updated.setName("New");
        updated.setDescription("desc");
        updated.setPrice(10.0);
        updated.setCategory("Men");
        updated.setSubcategory("T-Shirts");
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);
        Product result = productService.updateProduct(1L, updated, new ArrayList<>());
        assertEquals("New", result.getName());
        assertEquals("desc", result.getDescription());
        assertEquals(10.0, result.getPrice());
        assertEquals("Men", result.getCategory());
        assertEquals("T-Shirts", result.getSubcategory());
    }
} 