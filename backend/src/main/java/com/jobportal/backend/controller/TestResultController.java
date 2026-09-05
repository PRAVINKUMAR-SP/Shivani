package com.jobportal.backend.controller;

import com.jobportal.backend.model.TestResult;
import com.jobportal.backend.repository.TestResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "*")
public class TestResultController {

    @Autowired
    private TestResultRepository testResultRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitTestResult(@RequestBody TestResult testResult) {
        testResult.setCreatedAt(LocalDateTime.now());
        TestResult saved = testResultRepository.save(testResult);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/results")
    public ResponseEntity<List<TestResult>> getAllResults() {
        return ResponseEntity.ok(testResultRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/results/user/{userId}")
    public ResponseEntity<List<TestResult>> getUserResults(@PathVariable Long userId) {
        return ResponseEntity.ok(testResultRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }
}
