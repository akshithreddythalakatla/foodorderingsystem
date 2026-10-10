package com.foodordering.service;

import com.foodordering.dto.FoodItemRequest;
import com.foodordering.model.FoodItem;
import com.foodordering.model.Restaurant;
import com.foodordering.repository.FoodItemRepository;
import com.foodordering.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<FoodItem> getItemsByRestaurant(Long restaurantId) {
        return foodItemRepository.findByRestaurantId(restaurantId);
    }

    public FoodItem getItemById(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
    }

    public FoodItem createFoodItem(Long restaurantId, FoodItemRequest req) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));

        FoodItem item = new FoodItem(
                restaurant,
                req.getName(),
                req.getDescription(),
                req.getPrice(),
                req.getCategory(),
                req.getImageUrl(),
                req.getIsVeg() != null ? req.getIsVeg() : true,
                req.getIsAvailable() != null ? req.getIsAvailable() : true
        );
        return foodItemRepository.save(item);
    }

    public FoodItem updateFoodItem(Long id, FoodItemRequest req) {
        FoodItem item = getItemById(id);
        if (req.getName() != null) item.setName(req.getName());
        if (req.getDescription() != null) item.setDescription(req.getDescription());
        if (req.getPrice() != null) item.setPrice(req.getPrice());
        if (req.getCategory() != null) item.setCategory(req.getCategory());
        if (req.getImageUrl() != null) item.setImageUrl(req.getImageUrl());
        if (req.getIsVeg() != null) item.setIsVeg(req.getIsVeg());
        if (req.getIsAvailable() != null) item.setIsAvailable(req.getIsAvailable());
        return foodItemRepository.save(item);
    }

    public FoodItem toggleAvailability(Long id) {
        FoodItem item = getItemById(id);
        item.setIsAvailable(!item.getIsAvailable());
        return foodItemRepository.save(item);
    }

    public void deleteFoodItem(Long id) {
        FoodItem item = getItemById(id);
        foodItemRepository.delete(item);
    }
}
