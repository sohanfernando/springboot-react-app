package com.example.challengeapp.service;

import com.example.challengeapp.model.Order;
import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    Order getOrderById(Long id);
    List<Order> getAllOrders();
} 