package com.jobportal.backend.repository;

import com.jobportal.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);
    List<Application> findByApplicantId(Long applicantId);
    boolean existsByApplicantIdAndJobId(Long applicantId, Long jobId);
    
    List<Application> findByApplicantEmail(String email);
    boolean existsByApplicantEmailAndJobId(String email, Long jobId);
    
    List<Application> findByJobEmployerEmail(String email);

    long countByJobEmployerEmail(String email);
    long countByJobEmployerEmailAndStatusIn(String email, List<String> statuses);
}

