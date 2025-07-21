package com.example.challengeapp.service.impl;

import com.example.challengeapp.model.Product;
import com.example.challengeapp.repository.ProductRepository;
import com.example.challengeapp.util.FileValidationUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private FileValidationUtil fileValidationUtil;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;
    private MockMultipartFile validImageFile;
    private MockMultipartFile invalidImageFile;

    @BeforeEach
    void setUp() {
        // Set upload directory for tests
        ReflectionTestUtils.setField(productService, "uploadDir", "test-uploads/products/");

        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(29.99);
        product.setCategory("Men");
        product.setSubcategory("T-Shirts");
        product.setImages(new ArrayList<>(List.of("/uploads/products/test-image.jpg")));
        product.setColors(List.of("Red", "Blue"));
        product.setSizes(List.of("S", "M", "L"));
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        validImageFile = new MockMultipartFile(
            "image",
            "test-image.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );

        invalidImageFile = new MockMultipartFile(
            "image",
            "test-script.exe",
            "application/exe",
            "malicious content".getBytes()
        );
    }

    @Test
    void testCreateProduct_Success() {
        // Arrange
        when(fileValidationUtil.isValidImageFile(validImageFile)).thenReturn(true);
        when(fileValidationUtil.generateUniqueFilename("test-image.jpg")).thenReturn("123456_test-image.jpg");
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product newProduct = new Product();
        newProduct.setName("New Product");
        newProduct.setDescription("New Description");
        newProduct.setPrice(39.99);
        newProduct.setCategory("Women");
        newProduct.setSubcategory("Dresses");

        // Act
        Product result = productService.createProduct(newProduct, List.of(validImageFile));

        // Assert
        assertNotNull(result);
        assertEquals("Test Product", result.getName());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());

        verify(fileValidationUtil).isValidImageFile(validImageFile);
        verify(fileValidationUtil).generateUniqueFilename("test-image.jpg");
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testCreateProduct_NoImages_ThrowsException() {
        // Arrange
        Product newProduct = new Product();
        newProduct.setName("New Product");

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.createProduct(newProduct, null)
        );

        assertTrue(exception.getMessage().contains("must have at least 1 image"));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testCreateProduct_TooManyImages_ThrowsException() {
        // Arrange
        Product newProduct = new Product();
        newProduct.setName("New Product");

        List<MockMultipartFile> tooManyImages = List.of(
            validImageFile, validImageFile, validImageFile,
            validImageFile, validImageFile, validImageFile
        );

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.createProduct(newProduct, tooManyImages)
        );

        assertTrue(exception.getMessage().contains("at most 5 images"));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testCreateProduct_InvalidImageFile_ThrowsException() {
        // Arrange
        when(fileValidationUtil.isValidImageFile(invalidImageFile)).thenReturn(false);

        Product newProduct = new Product();
        newProduct.setName("New Product");

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.createProduct(newProduct, List.of(invalidImageFile))
        );

        assertTrue(exception.getMessage().contains("Invalid image file"));
        verify(fileValidationUtil).isValidImageFile(invalidImageFile);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testCreateProduct_DescriptionTooLong_ThrowsException() {
        // Arrange
        when(fileValidationUtil.isValidImageFile(validImageFile)).thenReturn(true);

        Product newProduct = new Product();
        newProduct.setName("New Product");
        // Create description with more than 200 words
        StringBuilder longDescription = new StringBuilder();
        for (int i = 0; i < 201; i++) {
            longDescription.append("word ");
        }
        newProduct.setDescription(longDescription.toString());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.createProduct(newProduct, List.of(validImageFile))
        );

        assertTrue(exception.getMessage().contains("cannot exceed 200 words"));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testUpdateProduct_Success() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(fileValidationUtil.isValidImageFile(validImageFile)).thenReturn(true);
        when(fileValidationUtil.generateUniqueFilename("test-image.jpg")).thenReturn("123456_test-image.jpg");
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product updatedProduct = new Product();
        updatedProduct.setName("Updated Product");
        updatedProduct.setDescription("Updated Description");
        updatedProduct.setPrice(49.99);

        // Act
        Product result = productService.updateProduct(1L, updatedProduct, List.of(validImageFile));

        // Assert
        assertNotNull(result);
        assertNotNull(result.getUpdatedAt());

        verify(productRepository).findById(1L);
        verify(fileValidationUtil).isValidImageFile(validImageFile);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testUpdateProduct_NotFound_ThrowsException() {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        Product updatedProduct = new Product();
        updatedProduct.setName("Updated Product");

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.updateProduct(999L, updatedProduct, null)
        );

        assertTrue(exception.getMessage().contains("Product not found"));
        verify(productRepository).findById(999L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testDeleteProduct_Success() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act
        productService.deleteProduct(1L);

        // Assert
        verify(productRepository).findById(1L);
        verify(productRepository).delete(product);
    }

    @Test
    void testDeleteProduct_NotFound_ThrowsException() {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.deleteProduct(999L)
        );

        assertTrue(exception.getMessage().contains("Product not found"));
        verify(productRepository).findById(999L);
        verify(productRepository, never()).delete(any(Product.class));
    }

    @Test
    void testGetAllProducts() {
        // Arrange
        List<Product> products = List.of(product);
        when(productRepository.findAll()).thenReturn(products);

        // Act
        List<Product> result = productService.getAllProducts();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).getName());

        verify(productRepository).findAll();
    }

    @Test
    void testGetProductById_Success() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act
        Product result = productService.getProductById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test Product", result.getName());
        assertEquals(1L, result.getId());

        verify(productRepository).findById(1L);
    }

    @Test
    void testGetProductById_NotFound_ThrowsException() {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.getProductById(999L)
        );

        assertTrue(exception.getMessage().contains("Product not found"));
        verify(productRepository).findById(999L);
    }

    @Test
    void testGetProductsByCategory() {
        // Arrange
        when(productRepository.findByCategory("Men")).thenReturn(List.of(product));

        // Act
        List<Product> result = productService.getProductsByCategory("Men");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Men", result.get(0).getCategory());

        verify(productRepository).findByCategory("Men");
    }

    @Test
    void testGetProductsByCategoryAndSubcategory() {
        // Arrange
        when(productRepository.findByCategoryAndSubcategory("Men", "T-Shirts")).thenReturn(List.of(product));

        // Act
        List<Product> result = productService.getProductsByCategoryAndSubcategory("Men", "T-Shirts");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Men", result.get(0).getCategory());
        assertEquals("T-Shirts", result.get(0).getSubcategory());

        verify(productRepository).findByCategoryAndSubcategory("Men", "T-Shirts");
    }

    @Test
    void testAddImages_Success() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(fileValidationUtil.isValidImageFile(validImageFile)).thenReturn(true);
        when(fileValidationUtil.generateUniqueFilename("test-image.jpg")).thenReturn("123456_test-image.jpg");
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        Product result = productService.addImages(1L, List.of(validImageFile));

        // Assert
        assertNotNull(result);
        verify(productRepository).findById(1L);
        verify(fileValidationUtil).isValidImageFile(validImageFile);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testAddImages_TooManyImages_ThrowsException() {
        // Arrange
        Product productWithMaxImages = new Product();
        productWithMaxImages.setImages(List.of("img1", "img2", "img3", "img4", "img5"));
        when(productRepository.findById(1L)).thenReturn(Optional.of(productWithMaxImages));

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.addImages(1L, List.of(validImageFile))
        );

        assertTrue(exception.getMessage().contains("at most 5 images"));
        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testRemoveImage_Success() {
        // Arrange
        Product productWithImages = new Product();
        productWithImages.setImages(new ArrayList<>(List.of("img1", "img2")));
        when(productRepository.findById(1L)).thenReturn(Optional.of(productWithImages));
        when(productRepository.save(any(Product.class))).thenReturn(productWithImages);

        // Act
        Product result = productService.removeImage(1L, 0);

        // Assert
        assertNotNull(result);
        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testRemoveImage_InvalidIndex_ThrowsException() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.removeImage(1L, 5)
        );

        assertTrue(exception.getMessage().contains("Invalid image index"));
        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testRemoveImage_LastImage_ThrowsException() {
        // Arrange
        Product productWithOneImage = new Product();
        productWithOneImage.setImages(new ArrayList<>(List.of("img1")));
        when(productRepository.findById(1L)).thenReturn(Optional.of(productWithOneImage));

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.removeImage(1L, 0)
        );

        assertTrue(exception.getMessage().contains("must have at least 1 image"));
        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
    }
} 