package com.example.challengeapp.service.impl;

import com.example.challengeapp.model.Order;
import com.example.challengeapp.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OrderServiceImplTest {
    private OrderRepository orderRepository;
    private OrderServiceImpl orderService;

    @BeforeEach
    void setUp() {
        orderRepository = Mockito.mock(OrderRepository.class);
        orderService = new OrderServiceImpl(orderRepository);
    }

    @Test
    void testCreateOrder() {
        Order order = new Order();
        order.setUserId(1L);
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order o = (Order) i.getArguments()[0];
            o.setId(1L);
            return o;
        });
        Order result = orderService.createOrder(order);
        assertEquals(1L, result.getId());
        assertEquals(1L, result.getUserId());
    }

    @Test
    void testGetOrderById() {
        Order order = new Order();
        order.setId(1L);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        Order result = orderService.getOrderById(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetAllOrders() {
        List<Order> orders = new ArrayList<>();
        Order o = new Order();
        o.setId(1L);
        orders.add(o);
        when(orderRepository.findAll()).thenReturn(orders);
        List<Order> result = orderService.getAllOrders();
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
    }
} 