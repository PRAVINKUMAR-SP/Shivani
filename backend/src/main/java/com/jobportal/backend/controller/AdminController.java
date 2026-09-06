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

    @Autowired
    private com.jobportal.backend.repository.SavedJobRepository savedJobRepository;
    
    @Autowired
    private com.jobportal.backend.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.jobportal.backend.repository.TestResultRepository testResultRepository;

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
            List<Job> jobs = jobRepository.findAll();
            jobs.forEach(job -> {
                job.setApplicantCount((int) applicationRepository.countByJobId(job.getId()));
            });
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/users/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            java.util.Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
            User user = userOpt.get();

            // Prevent deleting the main admin
            if ("pravin007ptk@gmail.com".equalsIgnoreCase(user.getEmail())) {
                return ResponseEntity.badRequest().body("Cannot delete the main admin account.");
            }

            // 1. Delete TestResults
            List<com.jobportal.backend.model.TestResult> tests = testResultRepository.findByUserIdOrderByCreatedAtDesc(id);
            testResultRepository.deleteAll(tests);

            // 2. Delete Notifications
            List<com.jobportal.backend.model.Notification> notifications = notificationRepository.findByUserEmailOrderByCreatedAtDesc(user.getEmail());
            notificationRepository.deleteAll(notifications);

            // 3. Delete SavedJobs
            List<com.jobportal.backend.model.SavedJob> savedJobs = savedJobRepository.findByUserEmail(user.getEmail());
            savedJobRepository.deleteAll(savedJobs);

            // 4. Delete Applications (where they are the applicant)
            List<com.jobportal.backend.model.Application> applications = applicationRepository.findByApplicantId(id);
            applicationRepository.deleteAll(applications);

            // 5. If employer, delete their Jobs (and cascading Applications/SavedJobs for those jobs)
            if ("EMPLOYER".equalsIgnoreCase(user.getRole())) {
                List<Job> employerJobs = jobRepository.findByEmployer(user);
                for (Job job : employerJobs) {
                    deleteJobInternal(job.getId());
                }
            }

            userRepository.delete(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/users/{id}/role")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        try {
            String newRole = payload.get("role");
            if (newRole == null) return ResponseEntity.badRequest().body("Role is required");

            java.util.Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
            User user = userOpt.get();

            if ("pravin007ptk@gmail.com".equalsIgnoreCase(user.getEmail())) {
                return ResponseEntity.badRequest().body("Cannot change the main admin's role.");
            }

            user.setRole(newRole.toUpperCase());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/jobs/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            boolean success = deleteJobInternal(id);
            if (!success) return ResponseEntity.notFound().build();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private boolean deleteJobInternal(Long id) {
        java.util.Optional<Job> jobOpt = jobRepository.findById(id);
        if (jobOpt.isEmpty()) return false;
        
        // Delete related Applications
        List<com.jobportal.backend.model.Application> applications = applicationRepository.findByJobId(id);
        applicationRepository.deleteAll(applications);
        
        // Delete related SavedJobs
        savedJobRepository.deleteByJobId(id);
        
        // Delete the Job itself
        jobRepository.delete(jobOpt.get());
        
        return true;
    }

    @GetMapping("/export/users")
    public ResponseEntity<String> exportUsersCsv() {
        try {
            List<User> users = userRepository.findAll();
            StringBuilder csv = new StringBuilder("ID,Name,Email,Role,Provider\n");
            for (User u : users) {
                csv.append(u.getId()).append(",")
                   .append("\"").append(u.getName() != null ? u.getName().replace("\"", "\"\"") : "").append("\",")
                   .append("\"").append(u.getEmail() != null ? u.getEmail().replace("\"", "\"\"") : "").append("\",")
                   .append(u.getRole()).append(",")
                   .append(u.getAuthProvider()).append("\n");
            }
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=\"users_export.csv\"");
            headers.add("Content-Type", "text/csv; charset=UTF-8");
            
            return new ResponseEntity<>(csv.toString(), headers, org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
