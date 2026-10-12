package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.security.AuthUser;
import com.example.backend.service.CheckoutService;
import com.example.backend.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final CheckoutService checkoutService;

    /**
     * Only the bag, the delivery details and the payment reference are taken
     * from the request. The owner, id, status, prices and total are all set by
     * the server, so none of them can be forged from the browser.
     */
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order, @AuthenticationPrincipal AuthUser caller) {
        return ResponseEntity.ok(checkoutService.placeOrder(order, caller));
    }

    /** What the bag costs right now, for the checkout page to display. */
    @PostMapping("/quote")
    public ResponseEntity<?> quote(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(checkoutService.quote(request.get("items")).toResponse());
    }

    /** Admin only (enforced in SecurityConfig). */
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal AuthUser caller) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(caller.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, @AuthenticationPrincipal AuthUser caller) {
        Order order = orderService.getOrderById(id);
        if (!caller.isAdmin() && !caller.id().equals(order.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own orders.");
        }
        return ResponseEntity.ok(order);
    }

    /** Admin only (enforced in SecurityConfig). */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        Order order = orderService.getOrderById(id);
        order.setStatus(status.replaceAll("\"", "")); // Remove quotes if sent as JSON string
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    /** Admin only (enforced in SecurityConfig). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }
}
