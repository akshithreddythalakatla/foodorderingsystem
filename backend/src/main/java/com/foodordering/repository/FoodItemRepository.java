package com.foodordering.repository;

import com.foodordering.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByRestaurantId(Long restaurantId);
    List<FoodItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);
    List<FoodItem> findByRestaurantIdAndCategory(Long restaurantId, String category);
}
