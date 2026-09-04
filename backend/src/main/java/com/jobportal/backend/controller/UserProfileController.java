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

    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        Map<String, Object> data = new java.util.HashMap<>();
        data.put("fileName", file.getOriginalFilename());
        // For simplicity in this mock, we just generate a dummy URL. 
        // In a real app, you would save the file to AWS S3 / Cloudinary.
        data.put("resumeUrl", "/uploads/" + file.getOriginalFilename());
        return ResponseEntity.ok(data);
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
        existingProfile.setResumeFileName(updatedProfile.getResumeFileName());
        existingProfile.setSkills(updatedProfile.getSkills());
        existingProfile.setExperience(updatedProfile.getExperience());
        existingProfile.setEducation(updatedProfile.getEducation());

        userProfileRepository.save(existingProfile);

        return ResponseEntity.ok(existingProfile);
    }
}
