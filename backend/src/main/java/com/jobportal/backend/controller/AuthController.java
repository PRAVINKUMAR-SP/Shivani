package com.jobportal.backend.controller;

import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<User> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String name = payload.get("name");
        String picture = payload.get("picture");
        String role = payload.get("role");

        if (email == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user;
        
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            // Update mutable details
            if (name != null) user.setName(name);
            if (picture != null) user.setProfilePicUrl(picture);
            
            // Only update role if it's not already ADMIN
            if (role != null && !"ADMIN".equals(user.getRole())) {
                user.setRole(role.toUpperCase());
            }
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name != null ? name : "Unknown User");
            user.setProfilePicUrl(picture);
            
            user.setRole(role != null ? role.toUpperCase() : "SEEKER");
            user.setAuthProvider("GOOGLE");
        }

        // Hardcode admin access for specific email
        if ("pravin007ptk@gmail.com".equalsIgnoreCase(email)) {
            user.setRole("ADMIN");
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/register/local")
    @Transactional
    public ResponseEntity<?> registerLocal(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String name = payload.get("name");
        String password = payload.get("password");
        String role = payload.get("role");

        if (email == null || password == null || name == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(password); // In a real app, hash this!
        
        user.setRole(role != null ? role.toUpperCase() : "SEEKER");
        user.setAuthProvider("LOCAL");

        if ("pravin007ptk@gmail.com".equalsIgnoreCase(email)) {
            user.setRole("ADMIN");
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login/local")
    public ResponseEntity<?> loginLocal(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Missing email or password");
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        User user = optionalUser.get();
        if (user.getPassword() == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        return ResponseEntity.ok(user);
    }
}
