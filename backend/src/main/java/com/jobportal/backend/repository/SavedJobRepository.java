package com.jobportal.backend.repository;

import com.jobportal.backend.model.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUserId(Long userId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
    
    List<SavedJob> findByUserEmail(String email);
    boolean existsByUserEmailAndJobId(String email, Long jobId);
    void deleteByUserEmailAndJobId(String email, Long jobId);
}
