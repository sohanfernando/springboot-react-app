package com.example.challengeapp.controller;

import com.example.challengeapp.model.Order;
import com.example.challengeapp.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    private Order order;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setId(1L);
        order.setUserId(1L);
        order.setStatus("processing");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testPlaceOrder_AsAdmin() throws Exception {
        when(orderService.createOrder(any(Order.class))).thenReturn(order);

        String orderJson = objectMapper.writeValueAsString(order);

        mockMvc.perform(post("/admin/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(1));

        verify(orderService).createOrder(any(Order.class));
    }

    @Test
    @WithMockUser(roles = "USER")
    void testPlaceOrder_AsUser_Forbidden() throws Exception {
        String orderJson = objectMapper.writeValueAsString(order);

        mockMvc.perform(post("/admin/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))
                .andExpect(status().isForbidden());

        verify(orderService, never()).createOrder(any(Order.class));
    }

    @Test
    void testPlaceOrder_Unauthenticated_Unauthorized() throws Exception {
        String orderJson = objectMapper.writeValueAsString(order);

        mockMvc.perform(post("/admin/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))
                .andExpect(status().isUnauthorized());

        verify(orderService, never()).createOrder(any(Order.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetOrderById_AsAdmin() throws Exception {
        when(orderService.getOrderById(1L)).thenReturn(order);

        mockMvc.perform(get("/admin/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("processing"));

        verify(orderService).getOrderById(1L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetOrderById_NotFound() throws Exception {
        when(orderService.getOrderById(999L)).thenThrow(new RuntimeException("Order not found"));

        mockMvc.perform(get("/admin/orders/999"))
                .andExpect(status().isInternalServerError());

        verify(orderService).getOrderById(999L);
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetOrderById_AsUser_Forbidden() throws Exception {
        mockMvc.perform(get("/admin/orders/1"))
                .andExpect(status().isForbidden());

        verify(orderService, never()).getOrderById(any());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllOrders_AsAdmin() throws Exception {
        when(orderService.getAllOrders()).thenReturn(List.of(order));

        mockMvc.perform(get("/admin/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].status").value("processing"));

        verify(orderService).getAllOrders();
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetAllOrders_AsUser_Forbidden() throws Exception {
        mockMvc.perform(get("/admin/orders"))
                .andExpect(status().isForbidden());

        verify(orderService, never()).getAllOrders();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllOrders_EmptyList() throws Exception {
        when(orderService.getAllOrders()).thenReturn(List.of());

        mockMvc.perform(get("/admin/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());

        verify(orderService).getAllOrders();
    }
} 