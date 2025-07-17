package com.example.challengeapp.repository;

import com.example.challengeapp.model.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class OrderRepositoryTest {
    @Autowired
    private OrderRepository orderRepository;

    @Test
    void testSaveOrder() {
        Order order = new Order();
        order.setUserId(1L);
        order.setItems("[{\"productId\":1,\"quantity\":2}]");
        order.setTotal(100.0);
        order.setRecipientName("John Doe");
        order.setAddress("123 Main St");
        order.setCity("City");
        order.setPostalCode("12345");
        order.setStatus("processing");
        Order saved = orderRepository.save(order);
        assertNotNull(saved.getId());
        assertEquals(1L, saved.getUserId());
    }
} 