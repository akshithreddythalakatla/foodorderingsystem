package com.foodordering.controller;

import com.foodordering.dto.FoodItemRequest;
import com.foodordering.model.FoodItem;
import com.foodordering.service.FoodItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<FoodItem>> getItemsByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(foodItemService.getItemsByRestaurant(restaurantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(foodItemService.getItemById(id));
    }

    @PostMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<FoodItem> createFoodItem(@PathVariable Long restaurantId,
                                                   @Valid @RequestBody FoodItemRequest request) {
        return ResponseEntity.ok(foodItemService.createFoodItem(restaurantId, request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<FoodItem> updateFoodItem(@PathVariable Long id,
                                                   @Valid @RequestBody FoodItemRequest request) {
        return ResponseEntity.ok(foodItemService.updateFoodItem(id, request));
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<FoodItem> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(foodItemService.toggleAvailability(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<?> deleteFoodItem(@PathVariable Long id) {
        foodItemService.deleteFoodItem(id);
        return ResponseEntity.ok(Map.of("message", "Food item deleted successfully"));
    }
}
