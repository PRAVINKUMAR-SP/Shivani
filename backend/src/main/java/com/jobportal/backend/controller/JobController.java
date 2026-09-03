package com.jobportal.backend.controller;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.dto.EmployerStatsDTO;
import com.jobportal.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping
    public List<Job> getAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location) {
        
        boolean hasSearch = search != null && !search.isEmpty();
        boolean hasLocation = location != null && !location.isEmpty();

        if (hasSearch && hasLocation) {
            return jobRepository.searchJobs(search, location);
        } else if (hasSearch) {
            return jobRepository.findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCase(search, search);
        } else if (hasLocation) {
            return jobRepository.findByLocationContainingIgnoreCase(location);
        }
        
        return jobRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobRepository.findById(id);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody Map<String, Object> payload) {
        String employerEmail = (String) payload.get("employerEmail");
        if (employerEmail == null) {
            return ResponseEntity.badRequest().body("employerEmail is required");
        }

        User employer = userRepository.findByEmail(employerEmail).orElse(null);
        if (employer == null || !"EMPLOYER".equalsIgnoreCase(employer.getRole())) {
            return ResponseEntity.badRequest().body("User is not an employer");
        }

        Job job = new Job();
        job.setTitle((String) payload.get("title"));
        job.setCompany((String) payload.get("company"));
        job.setDescription((String) payload.get("description"));
        job.setLocation((String) payload.get("location"));
        job.setSalary((String) payload.get("salary"));
        job.setType((String) payload.get("type"));
        job.setExperience((String) payload.get("experience"));
        job.setTags((List<String>) payload.get("tags"));
        job.setEmployer(employer);

        return ResponseEntity.ok(jobRepository.save(job));
    }

    @GetMapping("/employer/{email}")
    public ResponseEntity<List<Job>> getJobsByEmployer(@PathVariable String email) {
        User employer = userRepository.findByEmail(email).orElse(null);
        if (employer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(jobRepository.findByEmployer(employer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        if (jobRepository.existsById(id)) {
            jobRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/employer/{email}/stats")
    public ResponseEntity<EmployerStatsDTO> getEmployerStats(@PathVariable String email) {
        long activeListings = jobRepository.countByEmployerEmail(email);
        long totalApplicants = applicationRepository.countByJobEmployerEmail(email);
        long shortlisted = applicationRepository.countByJobEmployerEmailAndStatusIn(
                email, List.of("REVIEWING", "ACCEPTED")
        );

        return ResponseEntity.ok(new EmployerStatsDTO(activeListings, totalApplicants, shortlisted));
    }
}
