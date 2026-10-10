package com.foodordering.controller;

import com.foodordering.dto.RestaurantRequest;
import com.foodordering.model.Restaurant;
import com.foodordering.model.User;
import com.foodordering.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants(@RequestParam(required = false) String query) {
        if (query != null && !query.trim().isEmpty()) {
            return ResponseEntity.ok(restaurantService.searchRestaurants(query));
        }
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @GetMapping("/my-restaurant")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<Restaurant> getMyRestaurant(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(restaurantService.getRestaurantByOwnerId(user.getId()));
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<Restaurant> createRestaurant(@Valid @RequestBody RestaurantRequest request,
                                                       @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(restaurantService.createRestaurant(request, user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id,
                                                       @Valid @RequestBody RestaurantRequest request) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, request));
    }
}
