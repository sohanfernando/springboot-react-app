package com.example.challengeapp.controller;

import com.example.challengeapp.model.Product;
import com.example.challengeapp.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    private Product product;
    private MockMultipartFile imageFile;
    private MockMultipartFile productJson;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(29.99);
        product.setCategory("Men");
        product.setSubcategory("T-Shirts");
        product.setImages(List.of("/uploads/products/test-image.jpg"));
        product.setColors(List.of("Red", "Blue"));
        product.setSizes(List.of("S", "M", "L"));
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        // Create mock files for multipart requests
        imageFile = new MockMultipartFile(
            "images",
            "test-image.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );

        String productJsonString = """
            {
                "name": "Test Product",
                "description": "Test Description",
                "price": 29.99,
                "category": "Men",
                "subcategory": "T-Shirts",
                "colors": ["Red", "Blue"],
                "sizes": ["S", "M", "L"]
            }
            """;

        productJson = new MockMultipartFile(
            "product",
            "",
            "application/json",
            productJsonString.getBytes()
        );
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateProduct_Success() throws Exception {
        when(productService.createProduct(any(Product.class), any(List.class))).thenReturn(product);

        mockMvc.perform(multipart("/admin/products")
                .file(productJson)
                .file(imageFile)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.category").value("Men"));

        verify(productService).createProduct(any(Product.class), any(List.class));
    }

    @Test
    @WithMockUser(roles = "USER")
    void testCreateProduct_AsUser_Forbidden() throws Exception {
        mockMvc.perform(multipart("/admin/products")
                .file(productJson)
                .file(imageFile))
                .andExpect(status().isForbidden());

        verify(productService, never()).createProduct(any(), any());
    }

    @Test
    void testCreateProduct_Unauthenticated_Unauthorized() throws Exception {
        mockMvc.perform(multipart("/admin/products")
                .file(productJson)
                .file(imageFile))
                .andExpect(status().isUnauthorized());

        verify(productService, never()).createProduct(any(), any());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateProduct_ServiceException() throws Exception {
        when(productService.createProduct(any(Product.class), any(List.class)))
            .thenThrow(new RuntimeException("Product creation failed"));

        mockMvc.perform(multipart("/admin/products")
                .file(productJson)
                .file(imageFile))
                .andExpect(status().isInternalServerError());

        verify(productService).createProduct(any(Product.class), any(List.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testUpdateProduct_Success() throws Exception {
        when(productService.updateProduct(eq(1L), any(Product.class), any(List.class))).thenReturn(product);

        mockMvc.perform(multipart("/admin/products/1")
                .file(productJson)
                .file(imageFile)
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"));

        verify(productService).updateProduct(eq(1L), any(Product.class), any(List.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllProducts() throws Exception {
        when(productService.getAllProducts()).thenReturn(List.of(product));

        mockMvc.perform(get("/admin/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Product"))
                .andExpect(jsonPath("$[0].category").value("Men"));

        verify(productService).getAllProducts();
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetAllProducts_AsUser_Forbidden() throws Exception {
        mockMvc.perform(get("/admin/products"))
                .andExpect(status().isForbidden());

        verify(productService, never()).getAllProducts();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetProductById() throws Exception {
        when(productService.getProductById(1L)).thenReturn(product);

        mockMvc.perform(get("/admin/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.id").value(1));

        verify(productService).getProductById(1L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetProductById_NotFound() throws Exception {
        when(productService.getProductById(999L)).thenThrow(new RuntimeException("Product not found"));

        mockMvc.perform(get("/admin/products/999"))
                .andExpect(status().isInternalServerError());

        verify(productService).getProductById(999L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetProductsByCategory() throws Exception {
        when(productService.getProductsByCategory("Men")).thenReturn(List.of(product));

        mockMvc.perform(get("/admin/products/category/Men"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Men"))
                .andExpect(jsonPath("$[0].name").value("Test Product"));

        verify(productService).getProductsByCategory("Men");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetProductsByCategory_EmptyResult() throws Exception {
        when(productService.getProductsByCategory("Accessories")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/admin/products/category/Accessories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());

        verify(productService).getProductsByCategory("Accessories");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetProductsByCategoryAndSubcategory() throws Exception {
        when(productService.getProductsByCategoryAndSubcategory("Men", "T-Shirts")).thenReturn(List.of(product));

        mockMvc.perform(get("/admin/products/category/Men/subcategory/T-Shirts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Men"))
                .andExpect(jsonPath("$[0].subcategory").value("T-Shirts"));

        verify(productService).getProductsByCategoryAndSubcategory("Men", "T-Shirts");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteProduct_Success() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/admin/products/1"))
                .andExpect(status().isOk());

        verify(productService).deleteProduct(1L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteProduct_NotFound() throws Exception {
        doThrow(new RuntimeException("Product not found")).when(productService).deleteProduct(999L);

        mockMvc.perform(delete("/admin/products/999"))
                .andExpect(status().isInternalServerError());

        verify(productService).deleteProduct(999L);
    }

    @Test
    @WithMockUser(roles = "USER")
    void testDeleteProduct_AsUser_Forbidden() throws Exception {
        mockMvc.perform(delete("/admin/products/1"))
                .andExpect(status().isForbidden());

        verify(productService, never()).deleteProduct(any());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAddImages_Success() throws Exception {
        when(productService.addImages(eq(1L), any(List.class))).thenReturn(product);

        mockMvc.perform(multipart("/admin/products/1/images")
                .file(imageFile))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"));

        verify(productService).addImages(eq(1L), any(List.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testRemoveImage_Success() throws Exception {
        when(productService.removeImage(1L, 0)).thenReturn(product);

        mockMvc.perform(delete("/admin/products/1/images/0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"));

        verify(productService).removeImage(1L, 0);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testRemoveImage_InvalidIndex() throws Exception {
        when(productService.removeImage(1L, 5)).thenThrow(new RuntimeException("Invalid image index"));

        mockMvc.perform(delete("/admin/products/1/images/5"))
                .andExpect(status().isInternalServerError());

        verify(productService).removeImage(1L, 5);
    }
} 