package com.jobportal.backend.controller;

import com.jobportal.backend.dto.AdminStatsDTO;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") // In production, replace with specific origins
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getAdminStats() {
        try {
            long totalUsers = userRepository.count();
            long totalSeekers = userRepository.countByRole("SEEKER");
            long totalEmployers = userRepository.countByRole("EMPLOYER");
            long totalJobs = jobRepository.count();
            long totalApplications = applicationRepository.count();

            AdminStatsDTO stats = new AdminStatsDTO(
                    totalUsers,
                    totalSeekers,
                    totalEmployers,
                    totalJobs,
                    totalApplications
            );

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        try {
            return ResponseEntity.ok(jobRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
