package com.foodordering.config;

import com.foodordering.model.*;
import com.foodordering.repository.FoodItemRepository;
import com.foodordering.repository.OrderRepository;
import com.foodordering.repository.RestaurantRepository;
import com.foodordering.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            System.out.println("Data already initialized. Skipping seeding.");
            return;
        }

        System.out.println("Seeding database with default users, restaurants, food items, and orders...");

        // 1. Seed Users
        User customer = new User("Rahul Sharma", "customer@foodie.com", passwordEncoder.encode("password123"),
                "+91 9876543210", "Flat 402, Green Meadows Apt, Indiranagar, Bengaluru", Role.CUSTOMER);
        userRepository.save(customer);

        User restaurantAdmin = new User("Chef Antonio Rossi", "admin@foodie.com", passwordEncoder.encode("password123"),
                "+91 9811223344", "124 Brigade Road, Bengaluru", Role.RESTAURANT_ADMIN);
        userRepository.save(restaurantAdmin);

        User deliveryPerson = new User("Vikram Singh", "delivery@foodie.com", passwordEncoder.encode("password123"),
                "+91 9988776655", "12 Koramangala 4th Block, Bengaluru", Role.DELIVERY_PERSONNEL);
        userRepository.save(deliveryPerson);

        // 2. Seed Restaurants
        Restaurant r1 = new Restaurant(
                "Spice Symphony",
                "Authentic royal Indian recipes, clay-oven tandoori grills, and fragrant dum biryanis made with organic spices.",
                "North Indian & Mughlai",
                "Shop 4, MG Road, Bengaluru",
                "+91 80 2345 6789",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
                4.8, 30, 40.0, 150.0, true, restaurantAdmin
        );
        restaurantRepository.save(r1);

        Restaurant r2 = new Restaurant(
                "Bella Italia Trattoria",
                "Classic Roman woodfired sourdough pizzas, creamy handcrafted alfredo, and authentic Italian tiramisu.",
                "Italian & Continental",
                "45 100 Feet Road, Indiranagar, Bengaluru",
                "+91 80 4123 9876",
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                4.7, 35, 50.0, 200.0, true, null
        );
        restaurantRepository.save(r2);

        Restaurant r3 = new Restaurant(
                "The Burger Hub",
                "Premium Angus beef & crispy spiced paneer smash burgers, loaded truffle parmesan fries, and thick shakes.",
                "American & Fast Food",
                "77 Jyoti Nivas College Rd, Koramangala, Bengaluru",
                "+91 80 6789 1234",
                "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
                4.6, 25, 35.0, 120.0, true, null
        );
        restaurantRepository.save(r3);

        Restaurant r4 = new Restaurant(
                "Dragon Wok & Sushi Bar",
                "Sizzling wok tossed Hakka noodles, steamed crystal dim sums, and freshly prepared salmon & avocado rolls.",
                "Pan-Asian & Japanese",
                "89 Richmond Town, Bengaluru",
                "+91 80 5544 3322",
                "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
                4.9, 40, 45.0, 250.0, true, null
        );
        restaurantRepository.save(r4);

        Restaurant r5 = new Restaurant(
                "Sweet Cravings Bakery",
                "Artisanal French pastries, molten Belgian chocolate lava cakes, New York cheesecakes, and specialty coffees.",
                "Desserts & Café",
                "15 Lavelle Road, Bengaluru",
                "+91 80 3322 1100",
                "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
                4.8, 20, 30.0, 100.0, true, null
        );
        restaurantRepository.save(r5);

        // 3. Seed Food Items for Spice Symphony (r1)
        FoodItem f1 = new FoodItem(r1, "Butter Chicken Royale", "Tender chicken tikka simmered in a velvety smooth tomato and fenugreek butter gravy.", 380.0, "Mains", "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80", false, true);
        FoodItem f2 = new FoodItem(r1, "Paneer Tikka Masala", "Charcoal roasted cottage cheese cubes with bell peppers in a rich spiced onion tomato gravy.", 320.0, "Mains", "https://images.unsplash.com/photo-1567184109411-b28f21ee097a?auto=format&fit=crop&w=600&q=80", true, true);
        FoodItem f3 = new FoodItem(r1, "Hyderabadi Dum Biryani", "Aromatic long-grain basmati rice layered with saffron, marinated chicken, and slow-cooked in sealed clay pot.", 350.0, "Rice & Biryani", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80", false, true);
        FoodItem f4 = new FoodItem(r1, "Garlic Butter Naan", "Traditional clay oven baked flatbread brushed with crushed roasted garlic and fresh dairy butter.", 60.0, "Breads", "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80", true, true);
        FoodItem f5 = new FoodItem(r1, "Crispy Veg Spring Rolls", "Golden fried pastry stuffed with crunchy vegetables, served with sweet chili sauce.", 190.0, "Starters", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80", true, true);
        FoodItem f6 = new FoodItem(r1, "Gulab Jamun (2 Pcs)", "Warm milk-solid dumplings soaked in cardamom and rose infused golden sugar syrup.", 90.0, "Desserts", "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80", true, true);
        FoodItem f7 = new FoodItem(r1, "Mango Lassi", "Chilled whipped yogurt drink sweetened with fresh Alphonso mango pulp and saffron.", 110.0, "Beverages", "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80", true, true);
        foodItemRepository.saveAll(Arrays.asList(f1, f2, f3, f4, f5, f6, f7));

        // 4. Seed Food Items for Bella Italia (r2)
        FoodItem b1 = new FoodItem(r2, "Margherita Woodfired Pizza", "San Marzano tomato sauce, fresh mozzarella fior di latte, basil leaves, extra virgin olive oil.", 390.0, "Pizza", "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80", true, true);
        FoodItem b2 = new FoodItem(r2, "Truffle Mushroom Fettuccine", "Fresh handmade egg fettuccine tossed with wild porchini mushrooms and fragrant black truffle cream.", 450.0, "Pasta", "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80", true, true);
        FoodItem b3 = new FoodItem(r2, "Crispy Calamari Fritti", "Tender calamari rings dusted with semolina, fried crisp, served with roasted garlic aioli.", 360.0, "Starters", "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80", false, true);
        FoodItem b4 = new FoodItem(r2, "Classic Italian Tiramisu", "Savoiardi ladyfingers dipped in espresso, layered with whipped mascarpone and Valrhona cocoa.", 240.0, "Desserts", "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80", true, true);
        foodItemRepository.saveAll(Arrays.asList(b1, b2, b3, b4));

        // 5. Seed Food Items for The Burger Hub (r3)
        FoodItem h1 = new FoodItem(r3, "Smoky Bacon & Cheddar Burger", "Double smash patties, crispy smoked bacon, aged English cheddar, grilled onions, house sauce.", 320.0, "Burgers", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", false, true);
        FoodItem h2 = new FoodItem(r3, "Crispy Paneer Crunch Burger", "Spicy battered cottage cheese steak, crunchy pickled jalapeños, peri-peri mayo on toasted brioche.", 260.0, "Burgers", "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80", true, true);
        FoodItem h3 = new FoodItem(r3, "Truffle Parmesan Loaded Fries", "Golden shoestring potato fries tossed in aromatic white truffle oil, shaved parmesan, and herbs.", 180.0, "Sides", "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80", true, true);
        FoodItem h4 = new FoodItem(r3, "Salted Caramel Shake", "Creamy vanilla gelato blended with rich salted caramel sauce, topped with whipped cream.", 160.0, "Beverages", "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", true, true);
        foodItemRepository.saveAll(Arrays.asList(h1, h2, h3, h4));

        // 6. Seed Food Items for Dragon Wok (r4)
        FoodItem d1 = new FoodItem(r4, "Salmon & Avocado Roll (8 Pcs)", "Fresh Atlantic salmon, creamy avocado, cucumber, Japanese sushi rice rolled in roasted nori.", 480.0, "Sushi", "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80", false, true);
        FoodItem d2 = new FoodItem(r4, "Spicy Schezwan Hakka Noodles", "Wok-fried egg noodles with shredded vegetables, scallions, and fiery homemade Schezwan sauce.", 240.0, "Noodles", "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80", true, true);
        foodItemRepository.saveAll(Arrays.asList(d1, d2));

        // 7. Seed Food Items for Sweet Cravings (r5)
        FoodItem s1 = new FoodItem(r5, "Molten Chocolate Lava Cake", "Warm chocolate cake with a rich liquid fudge core, served with dark chocolate drizzle.", 210.0, "Desserts", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", true, true);
        FoodItem s2 = new FoodItem(r5, "New York Style Cheesecake", "Classic dense and creamy baked cheesecake on a buttery graham cracker crust with berry compote.", 250.0, "Desserts", "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80", true, true);
        foodItemRepository.saveAll(Arrays.asList(s1, s2));

        // 8. Seed Sample Order
        Order sampleOrder = new Order();
        sampleOrder.setOrderNumber("ORD-9823101");
        sampleOrder.setCustomer(customer);
        sampleOrder.setRestaurant(r1);
        sampleOrder.setDeliveryPersonnel(deliveryPerson);
        sampleOrder.setDeliveryAddress("Flat 402, Green Meadows Apt, Indiranagar, Bengaluru");
        sampleOrder.setDeliveryPhone("+91 9876543210");
        sampleOrder.setCustomerNotes("Please ring the bell twice and leave near doorstep.");
        sampleOrder.setPaymentMethod("UPI");
        sampleOrder.setPaymentStatus("PAID");
        sampleOrder.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        sampleOrder.setEstimatedDeliveryTime("15 mins");

        OrderItem oi1 = new OrderItem(sampleOrder, f1, f1.getName(), f1.getPrice(), 1, 380.0);
        OrderItem oi2 = new OrderItem(sampleOrder, f4, f4.getName(), f4.getPrice(), 2, 120.0);
        sampleOrder.addItem(oi1);
        sampleOrder.addItem(oi2);

        sampleOrder.setSubtotal(500.0);
        sampleOrder.setDeliveryFee(40.0);
        sampleOrder.setTax(25.0);
        sampleOrder.setDiscount(0.0);
        sampleOrder.setTotalAmount(565.0);

        orderRepository.save(sampleOrder);

        System.out.println("Database initialization completed successfully!");
    }
}
