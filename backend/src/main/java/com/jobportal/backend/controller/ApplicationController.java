package com.jobportal.backend.controller;

import com.jobportal.backend.model.Application;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> applyForJob(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long jobId = payload.get("jobId");

        if (userId == null || jobId == null) {
            return ResponseEntity.badRequest().body("userId and jobId are required.");
        }

        if (applicationRepository.existsByApplicantIdAndJobId(userId, jobId)) {
            return ResponseEntity.badRequest().body("User has already applied for this job.");
        }

        User user = userRepository.findById(userId).orElse(null);
        Job job = jobRepository.findById(jobId).orElse(null);

        if (user == null || job == null) {
            return ResponseEntity.badRequest().body("User or Job not found.");
        }

        Application application = new Application();
        application.setApplicant(user);
        application.setJob(job);
        application.setStatus("APPLIED");

        Application savedApplication = applicationRepository.save(application);
        return ResponseEntity.ok(savedApplication);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Application>> getApplicationsByUser(@PathVariable Long userId) {
        List<Application> applications = applicationRepository.findByApplicantId(userId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkApplicationStatus(@RequestParam Long userId, @RequestParam Long jobId) {
        boolean hasApplied = applicationRepository.existsByApplicantIdAndJobId(userId, jobId);
        return ResponseEntity.ok(hasApplied);
    }
}
