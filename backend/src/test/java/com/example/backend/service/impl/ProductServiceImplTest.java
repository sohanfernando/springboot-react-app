package com.example.backend.service.impl;

import com.example.backend.model.Product;
import com.example.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    /**
     * A stored product always has at least one image — createProduct enforces
     * that — so the fixtures here give `existing` a gallery.
     */
    private Product existingWithImages(String... urls) {
        Product existing = new Product();
        existing.setId(1L);
        existing.setName("Old");
        existing.setImages(new ArrayList<>(List.of(urls)));
        return existing;
    }

    private Product updatePayload() {
        Product updated = new Product();
        updated.setName("New");
        updated.setDescription("desc");
        updated.setPrice(10.0);
        updated.setCategory("Men");
        updated.setSubcategory("T-Shirts");
        return updated;
    }

    @Test
    void testUpdateProduct() {
        Product existing = existingWithImages("/uploads/products/a.webp");
        Product updated = updatePayload();
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);
        Product result = productService.updateProduct(1L, updated, new ArrayList<>());
        assertEquals("New", result.getName());
        assertEquals("desc", result.getDescription());
        assertEquals(10.0, result.getPrice());
        assertEquals("Men", result.getCategory());
        assertEquals("T-Shirts", result.getSubcategory());
    }

    /** No images sent at all: the stored gallery must survive untouched. */
    @Test
    void testUpdateProductKeepsExistingImagesWhenNoneSent() {
        Product existing = existingWithImages("/uploads/products/a.webp", "/uploads/products/b.webp");
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        Product result = productService.updateProduct(1L, updatePayload(), null);

        assertEquals(2, result.getImages().size());
    }

    /** The client sends back only the images it kept — the rest are dropped. */
    @Test
    void testUpdateProductRemovesImagesTheClientDropped() {
        Product existing = existingWithImages(
                "/uploads/products/a.webp", "/uploads/products/b.webp", "/uploads/products/c.webp");
        Product updated = updatePayload();
        updated.setImages(new ArrayList<>(List.of("/uploads/products/a.webp")));

        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        Product result = productService.updateProduct(1L, updated, null);

        assertEquals(1, result.getImages().size());
        assertEquals("/uploads/products/a.webp", result.getImages().get(0));
    }

    /** Six is the ceiling; a seventh is rejected. */
    @Test
    void testUpdateProductRejectsMoreThanSixImages() {
        Product existing = existingWithImages("/uploads/products/a.webp");
        Product updated = updatePayload();
        updated.setImages(new ArrayList<>(List.of(
                "/1.webp", "/2.webp", "/3.webp", "/4.webp", "/5.webp", "/6.webp", "/7.webp")));

        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));

        RuntimeException error = assertThrows(RuntimeException.class,
                () -> productService.updateProduct(1L, updated, null));
        assertTrue(error.getMessage().contains("between 1 and 6"));
    }

    /** Six uploads on create are accepted, seven are not. */
    @Test
    void testCreateProductAllowsSixImagesAndRejectsSeven() {
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        Product product = new Product();
        product.setName("Six");
        Product result = productService.createProduct(product, mockFiles(6));
        assertEquals(6, result.getImages().size());

        RuntimeException error = assertThrows(RuntimeException.class,
                () -> productService.createProduct(new Product(), mockFiles(7)));
        assertTrue(error.getMessage().contains("between 1 and 6"));
    }

    /** Each upload is filed under the colour the admin picked for it. */
    @Test
    void testCreateProductFilesImagesUnderTheirColour() {
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        Product product = new Product();
        product.setName("Two-tone");
        product.setColors(new ArrayList<>(List.of("Black", "Blue")));
        product.setNewImageColors(new ArrayList<>(List.of("Black", "Blue")));

        Product result = productService.createProduct(product, mockFiles(2));

        assertEquals(2, result.getImageColors().size());
        assertEquals("Black", result.getImageColors().get(result.getImages().get(0)));
        assertEquals("Blue", result.getImageColors().get(result.getImages().get(1)));
    }

    /**
     * A colour that is not one of the product's own colours is dropped, so the
     * image falls back to "shows for every colour" rather than disappearing.
     */
    @Test
    void testCreateProductIgnoresUnknownColour() {
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        Product product = new Product();
        product.setColors(new ArrayList<>(List.of("Black")));
        product.setNewImageColors(new ArrayList<>(List.of("Neon")));

        Product result = productService.createProduct(product, mockFiles(1));

        assertTrue(result.getImageColors().isEmpty());
    }

    /** Assignments survive an edit, and follow images that were removed out. */
    @Test
    void testUpdateProductKeepsColourAssignmentsForKeptImagesOnly() {
        Product existing = existingWithImages("/a.webp", "/b.webp");
        Product updated = updatePayload();
        updated.setColors(new ArrayList<>(List.of("Black", "Blue")));
        updated.setImages(new ArrayList<>(List.of("/a.webp")));
        Map<String, String> sent = new HashMap<>();
        sent.put("/a.webp", "Black");
        sent.put("/b.webp", "Blue"); // dropped along with the image itself
        updated.setImageColors(sent);

        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        Product result = productService.updateProduct(1L, updated, null);

        assertEquals(1, result.getImageColors().size());
        assertEquals("Black", result.getImageColors().get("/a.webp"));
    }

    private List<MultipartFile> mockFiles(int count) {
        List<MultipartFile> files = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            MultipartFile file = Mockito.mock(MultipartFile.class);
            try {
                Mockito.when(file.getBytes()).thenReturn(new byte[0]);
                Mockito.when(file.getOriginalFilename()).thenReturn("image-" + i + ".webp");
            } catch (Exception e) {
                fail("Mocking the upload failed");
            }
            files.add(file);
        }
        return files;
    }
} 