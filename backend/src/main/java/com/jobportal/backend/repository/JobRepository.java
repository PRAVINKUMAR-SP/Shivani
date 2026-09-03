package com.jobportal.backend.repository;

import com.jobportal.backend.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.jobportal.backend.model.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCase(String title, String company);

    @Query("SELECT j FROM Job j WHERE " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.company) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<Job> searchJobs(@Param("search") String search, @Param("location") String location);

    List<Job> findByLocationContainingIgnoreCase(String location);

    List<Job> findByEmployer(User employer);
}
