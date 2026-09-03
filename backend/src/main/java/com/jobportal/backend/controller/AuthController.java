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
            // We generally don't change role if they are already registered,
            // but if they had no role, we can set it.
            if (user.getRole() == null && role != null) {
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

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
