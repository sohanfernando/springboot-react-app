package com.example.challengeapp.service.impl;

import com.example.challengeapp.model.Order;
import com.example.challengeapp.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order order;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setId(1L);
        order.setUserId(1L);
        order.setStatus("processing");
    }

    @Test
    void testCreateOrder_Success() {
        // Arrange
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order newOrder = new Order();
        newOrder.setUserId(1L);
        newOrder.setStatus("pending");

        // Act
        Order result = orderService.createOrder(newOrder);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1L, result.getUserId());
        assertEquals("processing", result.getStatus());

        verify(orderRepository).save(any(Order.class));
    }



    @Test
    void testGetOrderById_Success() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act
        Order result = orderService.getOrderById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1L, result.getUserId());
        assertEquals("processing", result.getStatus());

        verify(orderRepository).findById(1L);
    }

    @Test
    void testGetOrderById_NotFound() {
        // Arrange
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> orderService.getOrderById(999L)
        );

        assertTrue(exception.getMessage().contains("Order not found"));
        verify(orderRepository).findById(999L);
    }

    @Test
    void testGetAllOrders() {
        // Arrange
        Order order1 = new Order();
        order1.setId(1L);
        order1.setUserId(1L);
        order1.setStatus("processing");

        Order order2 = new Order();
        order2.setId(2L);
        order2.setUserId(2L);
        order2.setStatus("completed");

        when(orderRepository.findAll()).thenReturn(List.of(order1, order2));

        // Act
        List<Order> result = orderService.getAllOrders();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        
        assertEquals(1L, result.get(0).getId());
        assertEquals("processing", result.get(0).getStatus());
        
        assertEquals(2L, result.get(1).getId());
        assertEquals("completed", result.get(1).getStatus());

        verify(orderRepository).findAll();
    }

    @Test
    void testGetAllOrders_EmptyList() {
        // Arrange
        when(orderRepository.findAll()).thenReturn(List.of());

        // Act
        List<Order> result = orderService.getAllOrders();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(orderRepository).findAll();
    }

    @Test
    void testCreateOrder_WithValidOrder() {
        // Arrange
        Order newOrder = new Order();
        newOrder.setUserId(2L);
        newOrder.setStatus("pending");
        
        Order savedOrder = new Order();
        savedOrder.setId(2L);
        savedOrder.setUserId(2L);
        savedOrder.setStatus("pending");
        
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        // Act
        Order result = orderService.createOrder(newOrder);

        // Assert
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals(2L, result.getUserId());
        assertEquals("pending", result.getStatus());

        verify(orderRepository).save(any(Order.class));
    }
} 