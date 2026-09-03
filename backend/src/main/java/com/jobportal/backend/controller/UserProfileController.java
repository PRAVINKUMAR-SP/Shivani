package com.jobportal.backend.controller;

import com.jobportal.backend.model.User;
import com.jobportal.backend.model.UserProfile;
import com.jobportal.backend.repository.UserProfileRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.ResumeParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeParserService resumeParserService;

    @PostMapping("/parse-resume")
    public ResponseEntity<?> parseResume(@RequestParam("file") MultipartFile file) {
        Map<String, Object> parsedData = resumeParserService.parseResume(file);
        if (parsedData.containsKey("error")) {
            return ResponseEntity.badRequest().body(parsedData);
        }
        return ResponseEntity.ok(parsedData);
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getProfile(@PathVariable String email) {
        UserProfile profile = userProfileRepository.findByUserEmail(email).orElse(null);
        if (profile == null) {
            // Check if user exists
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            // Return empty profile with user ID
            profile = new UserProfile();
            profile.setUser(user);
        }
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{email}")
    @Transactional
    public ResponseEntity<?> updateProfile(@PathVariable String email, @RequestBody UserProfile updatedProfile) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        UserProfile existingProfile = userProfileRepository.findByUserEmail(email).orElse(new UserProfile());
        
        // Update fields
        existingProfile.setUser(user);
        existingProfile.setBio(updatedProfile.getBio());
        existingProfile.setPhoneNumber(updatedProfile.getPhoneNumber());
        existingProfile.setResumeUrl(updatedProfile.getResumeUrl());
        existingProfile.setSkills(updatedProfile.getSkills());
        existingProfile.setExperience(updatedProfile.getExperience());
        existingProfile.setEducation(updatedProfile.getEducation());

        userProfileRepository.save(existingProfile);

        return ResponseEntity.ok(existingProfile);
    }
}
