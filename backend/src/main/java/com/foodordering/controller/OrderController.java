package com.foodordering.controller;

import com.foodordering.dto.OrderRequest;
import com.foodordering.dto.StatusUpdateRequest;
import com.foodordering.model.Order;
import com.foodordering.model.User;
import com.foodordering.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderRequest request,
                                            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.createOrder(request, user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getCustomerOrders(user.getId()));
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<List<Order>> getRestaurantOrders(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(orderService.getRestaurantOrders(restaurantId));
    }

    @GetMapping("/available-deliveries")
    @PreAuthorize("hasRole('DELIVERY_PERSONNEL')")
    public ResponseEntity<List<Order>> getAvailableDeliveries() {
        return ResponseEntity.ok(orderService.getAvailableDeliveries());
    }

    @GetMapping("/my-deliveries")
    @PreAuthorize("hasRole('DELIVERY_PERSONNEL')")
    public ResponseEntity<List<Order>> getMyDeliveries(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getDeliveryOrders(user.getId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
                                                   @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus(), request.getDeliveryPersonnelId()));
    }

    @PatchMapping("/{id}/assign-delivery")
    @PreAuthorize("hasRole('DELIVERY_PERSONNEL')")
    public ResponseEntity<Order> assignDelivery(@PathVariable Long id,
                                                @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.assignDelivery(id, user));
    }
}
