package com.jobportal.backend.controller;

import com.jobportal.backend.model.Application;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import com.jobportal.backend.model.Notification;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.NotificationRepository;
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

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<?> applyForJob(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String name = (String) payload.get("name");
        
        if (email == null || payload.get("jobId") == null) {
            return ResponseEntity.badRequest().body("email and jobId are required.");
        }
        
        Long jobId = Long.valueOf(payload.get("jobId").toString());

        if (applicationRepository.existsByApplicantEmailAndJobId(email, jobId)) {
            return ResponseEntity.badRequest().body("User has already applied for this job.");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name != null ? name : "Unknown User");
            user.setRole("SEEKER");
            user = userRepository.save(user);
        }

        Job job = jobRepository.findById(jobId).orElse(null);

        if (job == null) {
            return ResponseEntity.badRequest().body("Job not found.");
        }

        Application application = new Application();
        application.setApplicant(user);
        application.setJob(job);
        application.setStatus("APPLIED");

        Application savedApplication = applicationRepository.save(application);
        
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType("APPLICATION_SUCCESS");
        notification.setMessage("You successfully applied for the position: " + job.getTitle() + " at " + job.getCompany() + ".");
        notificationRepository.save(notification);
        
        return ResponseEntity.ok(savedApplication);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Application>> getApplicationsByUser(@PathVariable String email) {
        List<Application> applications = applicationRepository.findByApplicantEmail(email);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkApplicationStatus(@RequestParam String email, @RequestParam Long jobId) {
        boolean hasApplied = applicationRepository.existsByApplicantEmailAndJobId(email, jobId);
        return ResponseEntity.ok(hasApplied);
    }
}
