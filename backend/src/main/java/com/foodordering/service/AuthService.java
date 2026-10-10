package com.foodordering.service;

import com.foodordering.config.JwtTokenProvider;
import com.foodordering.dto.AuthResponse;
import com.foodordering.dto.LoginRequest;
import com.foodordering.dto.RegisterRequest;
import com.foodordering.model.Restaurant;
import com.foodordering.model.Role;
import com.foodordering.model.User;
import com.foodordering.repository.RestaurantRepository;
import com.foodordering.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user);
        Long restaurantId = null;

        if (user.getRole() == Role.RESTAURANT_ADMIN) {
            Optional<Restaurant> restaurant = restaurantRepository.findByOwnerId(user.getId());
            if (restaurant.isPresent()) {
                restaurantId = restaurant.get().getId();
            }
        }

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), restaurantId);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                request.getAddress(),
                request.getRole()
        );

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser);

        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole(), null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
