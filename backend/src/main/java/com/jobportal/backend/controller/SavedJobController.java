package com.jobportal.backend.controller;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.SavedJob;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.SavedJobRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/saved-jobs")
@CrossOrigin(origins = "*")
public class SavedJobController {

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/toggle")
    @Transactional
    public ResponseEntity<?> toggleSavedJob(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String name = (String) payload.get("name");
        
        if (email == null || payload.get("jobId") == null) {
            return ResponseEntity.badRequest().body("email and jobId are required.");
        }
        
        Long jobId = Long.valueOf(payload.get("jobId").toString());

        if (savedJobRepository.existsByUserEmailAndJobId(email, jobId)) {
            savedJobRepository.deleteByUserEmailAndJobId(email, jobId);
            Map<String, Object> response = new HashMap<>();
            response.put("saved", false);
            return ResponseEntity.ok(response);
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

        SavedJob savedJob = new SavedJob();
        savedJob.setUser(user);
        savedJob.setJob(job);
        savedJobRepository.save(savedJob);

        Map<String, Object> response = new HashMap<>();
        response.put("saved", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<SavedJob>> getSavedJobsByUser(@PathVariable String email) {
        List<SavedJob> savedJobs = savedJobRepository.findByUserEmail(email);
        return ResponseEntity.ok(savedJobs);
    }
}
