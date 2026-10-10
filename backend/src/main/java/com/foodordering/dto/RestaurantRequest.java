package com.foodordering.dto;

import jakarta.validation.constraints.NotBlank;

public class RestaurantRequest {
    @NotBlank
    private String name;

    private String description;
    private String cuisineType;
    private String address;
    private String phone;
    private String imageUrl;
    private Double rating = 4.5;
    private Integer deliveryTimeMinutes = 30;
    private Double deliveryFee = 40.0;
    private Double minOrderAmount = 150.0;
    private Boolean isOpen = true;

    public RestaurantRequest() {
    }

    public RestaurantRequest(String name, String description, String cuisineType, String address,
                             String phone, String imageUrl, Double rating, Integer deliveryTimeMinutes,
                             Double deliveryFee, Double minOrderAmount, Boolean isOpen) {
        this.name = name;
        this.description = description;
        this.cuisineType = cuisineType;
        this.address = address;
        this.phone = phone;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.deliveryTimeMinutes = deliveryTimeMinutes;
        this.deliveryFee = deliveryFee;
        this.minOrderAmount = minOrderAmount;
        this.isOpen = isOpen;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCuisineType() {
        return cuisineType;
    }

    public void setCuisineType(String cuisineType) {
        this.cuisineType = cuisineType;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getDeliveryTimeMinutes() {
        return deliveryTimeMinutes;
    }

    public void setDeliveryTimeMinutes(Integer deliveryTimeMinutes) {
        this.deliveryTimeMinutes = deliveryTimeMinutes;
    }

    public Double getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(Double deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public Double getMinOrderAmount() {
        return minOrderAmount;
    }

    public void setMinOrderAmount(Double minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }

    public Boolean getIsOpen() {
        return isOpen;
    }

    public void setIsOpen(Boolean isOpen) {
        this.isOpen = isOpen;
    }
}
