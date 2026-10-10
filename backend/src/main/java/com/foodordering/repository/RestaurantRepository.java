package com.foodordering.repository;

import com.foodordering.model.Restaurant;
import com.foodordering.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByIsOpenTrue();
    Optional<Restaurant> findByOwnerId(Long ownerId);
    List<Restaurant> findByOwner(User owner);

    @Query("SELECT r FROM Restaurant r WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.cuisineType) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.address) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Restaurant> searchRestaurants(@Param("query") String query);
}
