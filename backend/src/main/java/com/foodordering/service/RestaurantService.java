package com.foodordering.service;

import com.foodordering.dto.RestaurantRequest;
import com.foodordering.model.Restaurant;
import com.foodordering.model.User;
import com.foodordering.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public List<Restaurant> searchRestaurants(String query) {
        if (query == null || query.trim().isEmpty()) {
            return restaurantRepository.findAll();
        }
        return restaurantRepository.searchRestaurants(query.trim());
    }

    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }

    public Restaurant getRestaurantByOwnerId(Long ownerId) {
        return restaurantRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("No restaurant found for owner id: " + ownerId));
    }

    public Restaurant createRestaurant(RestaurantRequest req, User owner) {
        Restaurant restaurant = new Restaurant(
                req.getName(),
                req.getDescription(),
                req.getCuisineType(),
                req.getAddress(),
                req.getPhone(),
                req.getImageUrl(),
                req.getRating() != null ? req.getRating() : 4.5,
                req.getDeliveryTimeMinutes() != null ? req.getDeliveryTimeMinutes() : 30,
                req.getDeliveryFee() != null ? req.getDeliveryFee() : 40.0,
                req.getMinOrderAmount() != null ? req.getMinOrderAmount() : 150.0,
                req.getIsOpen() != null ? req.getIsOpen() : true,
                owner
        );
        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(Long id, RestaurantRequest req) {
        Restaurant restaurant = getRestaurantById(id);
        if (req.getName() != null) restaurant.setName(req.getName());
        if (req.getDescription() != null) restaurant.setDescription(req.getDescription());
        if (req.getCuisineType() != null) restaurant.setCuisineType(req.getCuisineType());
        if (req.getAddress() != null) restaurant.setAddress(req.getAddress());
        if (req.getPhone() != null) restaurant.setPhone(req.getPhone());
        if (req.getImageUrl() != null) restaurant.setImageUrl(req.getImageUrl());
        if (req.getRating() != null) restaurant.setRating(req.getRating());
        if (req.getDeliveryTimeMinutes() != null) restaurant.setDeliveryTimeMinutes(req.getDeliveryTimeMinutes());
        if (req.getDeliveryFee() != null) restaurant.setDeliveryFee(req.getDeliveryFee());
        if (req.getMinOrderAmount() != null) restaurant.setMinOrderAmount(req.getMinOrderAmount());
        if (req.getIsOpen() != null) restaurant.setIsOpen(req.getIsOpen());
        return restaurantRepository.save(restaurant);
    }
}
