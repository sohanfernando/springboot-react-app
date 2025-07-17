package com.example.challengeapp.controller;

import com.example.challengeapp.model.Order;
import com.example.challengeapp.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
public class OrderControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    private Order order;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setId(1L);
        order.setUserId(1L);
        order.setStatus("processing");
    }

    @Test
    void testPlaceOrder() throws Exception {
        Mockito.when(orderService.createOrder(any(Order.class))).thenReturn(order);
        mockMvc.perform(MockMvcRequestBuilders.post("/admin/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":1}"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetOrderById() throws Exception {
        Mockito.when(orderService.getOrderById(1L)).thenReturn(order);
        mockMvc.perform(MockMvcRequestBuilders.get("/admin/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testGetAllOrders() throws Exception {
        Mockito.when(orderService.getAllOrders()).thenReturn(List.of(order));
        mockMvc.perform(MockMvcRequestBuilders.get("/admin/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }
} 