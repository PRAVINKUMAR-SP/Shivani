package com.jobportal.backend.controller;

import com.jobportal.backend.model.User;
import com.jobportal.backend.model.UserProfile;
import com.jobportal.backend.repository.UserProfileRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private static final Path UPLOAD_DIR = Paths.get("uploads").toAbsolutePath().normalize();

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    // Initialize upload directory
    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            Files.createDirectories(UPLOAD_DIR);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        try {
            // Generate a unique filename to avoid collisions
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String storedName = UUID.randomUUID().toString() + extension;

            // Save file to disk
            Path targetPath = UPLOAD_DIR.resolve(storedName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Build the download URL that the frontend/employer can use
            String resumeUrl = "/api/profile/resume/" + storedName;

            Map<String, Object> data = new java.util.HashMap<>();
            data.put("fileName", originalName);
            data.put("resumeUrl", resumeUrl);
            return ResponseEntity.ok(data);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to save file"));
        }
    }

    @GetMapping("/resume/{filename}")
    public ResponseEntity<Resource> downloadResume(@PathVariable String filename) {
        try {
            Path filePath = UPLOAD_DIR.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/pdf";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
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
