package com.example.challengeapp.repository;

import com.example.challengeapp.model.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ProductRepositoryTest {
    @Autowired
    private ProductRepository productRepository;

    @Test
    void testFindByCategory() {
        Product p1 = new Product();
        p1.setName("Tee");
        p1.setCategory("Men");
        productRepository.save(p1);

        Product p2 = new Product();
        p2.setName("Dress");
        p2.setCategory("Women");
        productRepository.save(p2);

        List<Product> menProducts = productRepository.findByCategory("Men");
        assertFalse(menProducts.isEmpty());
        assertEquals("Men", menProducts.get(0).getCategory());
    }

    @Test
    void testFindByCategoryAndSubcategory() {
        Product p1 = new Product();
        p1.setName("Tee");
        p1.setCategory("Men");
        p1.setSubcategory("T-Shirts");
        productRepository.save(p1);

        List<Product> result = productRepository.findByCategoryAndSubcategory("Men", "T-Shirts");
        assertFalse(result.isEmpty());
        assertEquals("T-Shirts", result.get(0).getSubcategory());
    }
} 