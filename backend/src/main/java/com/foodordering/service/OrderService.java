package com.foodordering.service;

import com.foodordering.dto.OrderItemRequest;
import com.foodordering.dto.OrderRequest;
import com.foodordering.model.*;
import com.foodordering.repository.FoodItemRepository;
import com.foodordering.repository.OrderRepository;
import com.foodordering.repository.RestaurantRepository;
import com.foodordering.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(OrderRequest req, User customer) {
        Restaurant restaurant = restaurantRepository.findById(req.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + req.getRestaurantId()));

        if (!Boolean.TRUE.equals(restaurant.getIsOpen())) {
            throw new RuntimeException("Restaurant is currently closed");
        }

        Order order = new Order();
        order.setOrderNumber("ORD-" + System.currentTimeMillis() % 10000000);
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(req.getDeliveryAddress() != null ? req.getDeliveryAddress() : customer.getAddress());
        order.setDeliveryPhone(req.getDeliveryPhone() != null ? req.getDeliveryPhone() : customer.getPhone());
        order.setCustomerNotes(req.getCustomerNotes());
        order.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "UPI");
        order.setPaymentStatus("PAID");
        order.setStatus(OrderStatus.PLACED);
        order.setEstimatedDeliveryTime((restaurant.getDeliveryTimeMinutes() != null ? restaurant.getDeliveryTimeMinutes() : 30) + " mins");

        double subtotal = 0.0;
        for (OrderItemRequest itemReq : req.getItems()) {
            FoodItem foodItem = foodItemRepository.findById(itemReq.getFoodItemId())
                    .orElseThrow(() -> new RuntimeException("Food item not found with id: " + itemReq.getFoodItemId()));

            double itemTotal = foodItem.getPrice() * itemReq.getQuantity();
            subtotal += itemTotal;

            OrderItem orderItem = new OrderItem(
                    order,
                    foodItem,
                    foodItem.getName(),
                    foodItem.getPrice(),
                    itemReq.getQuantity(),
                    itemTotal
            );
            order.addItem(orderItem);
        }

        double deliveryFee = restaurant.getDeliveryFee() != null ? restaurant.getDeliveryFee() : 40.0;
        double tax = Math.round((subtotal * 0.05) * 100.0) / 100.0; // 5% GST
        double discount = 0.0;
        double total = subtotal + deliveryFee + tax - discount;

        order.setSubtotal(subtotal);
        order.setDeliveryFee(deliveryFee);
        order.setTax(tax);
        order.setDiscount(discount);
        order.setTotalAmount(Math.round(total * 100.0) / 100.0);

        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found with number: " + orderNumber));
    }

    public List<Order> getCustomerOrders(Long customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Order> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
    }

    public List<Order> getAvailableDeliveries() {
        return orderRepository.findByStatusInOrderByCreatedAtDesc(
                Arrays.asList(OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP)
        );
    }

    public List<Order> getDeliveryOrders(Long deliveryPersonnelId) {
        return orderRepository.findByDeliveryPersonnelIdOrderByCreatedAtDesc(deliveryPersonnelId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus, Long deliveryPersonnelId) {
        Order order = getOrderById(orderId);
        order.setStatus(newStatus);

        if (deliveryPersonnelId != null) {
            User deliveryPerson = userRepository.findById(deliveryPersonnelId)
                    .orElseThrow(() -> new RuntimeException("Delivery personnel not found"));
            order.setDeliveryPersonnel(deliveryPerson);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order assignDelivery(Long orderId, User deliveryPersonnel) {
        Order order = getOrderById(orderId);
        order.setDeliveryPersonnel(deliveryPersonnel);
        if (order.getStatus() == OrderStatus.READY_FOR_PICKUP) {
            order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        }
        return orderRepository.save(order);
    }
}
