package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.security.AuthUser;
import com.example.backend.service.CheckoutService;
import com.example.backend.service.OrderService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Filters are off here, so these cover controller logic only; the URL rules
// are exercised end to end in SecurityIntegrationTest.
@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
public class OrderControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrderService orderService;

    @MockitoBean
    private CheckoutService checkoutService;

    private Order order;

    private void signInAs(long id, String role) {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                new AuthUser(id, "user" + id + "@example.com", role), null, List.of()));
    }

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setId(1L);
        order.setUserId(1L);
        order.setStatus("processing");
        signInAs(1L, "USER");
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // What placeOrder does with a forged body is covered in CheckoutIntegrationTest.
    @Test
    void testPlaceOrder() throws Exception {
        Mockito.when(checkoutService.placeOrder(any(Order.class), any(AuthUser.class))).thenReturn(order);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testGetOrderById() throws Exception {
        Mockito.when(orderService.getOrderById(1L)).thenReturn(order);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void aUserCannotReadSomeoneElsesOrder() throws Exception {
        signInAs(2L, "USER");
        Mockito.when(orderService.getOrderById(1L)).thenReturn(order);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/orders/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    void anAdminCanReadAnyOrder() throws Exception {
        signInAs(9L, "ADMIN");
        Mockito.when(orderService.getOrderById(1L)).thenReturn(order);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/orders/1"))
                .andExpect(status().isOk());
    }

    @Test
    void myOrdersReturnsOnlyTheCallersOrders() throws Exception {
        Mockito.when(orderService.getOrdersByUserId(1L)).thenReturn(List.of(order));
        mockMvc.perform(MockMvcRequestBuilders.get("/api/orders/mine"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testGetAllOrders() throws Exception {
        Mockito.when(orderService.getAllOrders()).thenReturn(List.of(order));
        mockMvc.perform(MockMvcRequestBuilders.get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }
}
