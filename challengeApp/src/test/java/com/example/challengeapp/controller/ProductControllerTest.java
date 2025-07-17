package com.example.challengeapp.controller;

import com.example.challengeapp.model.Product;
import com.example.challengeapp.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ProductControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setCategory("Men");
        product.setSubcategory("T-Shirts");
    }

    @Test
    void testGetAllProducts() throws Exception {
        Mockito.when(productService.getAllProducts()).thenReturn(List.of(product));
        mockMvc.perform(MockMvcRequestBuilders.get("/admin/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Product"));
    }

    @Test
    void testGetProductById() throws Exception {
        Mockito.when(productService.getProductById(1L)).thenReturn(product);
        mockMvc.perform(MockMvcRequestBuilders.get("/admin/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    void testGetProductsByCategory() throws Exception {
        Mockito.when(productService.getProductsByCategory("Men")).thenReturn(List.of(product));
        mockMvc.perform(MockMvcRequestBuilders.get("/admin/products/category/Men"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Men"));
    }

    @Test
    void testGetProductsByCategoryAndSubcategory() throws Exception {
        Mockito.when(productService.getProductsByCategoryAndSubcategory("Men", "T-Shirts")).thenReturn(List.of(product));
        mockMvc.perform(MockMvcRequestBuilders.get("/admin/products/category/Men/subcategory/T-Shirts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].subcategory").value("T-Shirts"));
    }

    @Test
    void testDeleteProduct() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/admin/products/1"))
                .andExpect(status().isOk());
    }
} 