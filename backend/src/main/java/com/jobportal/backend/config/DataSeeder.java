package com.jobportal.backend.config;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner loadData(JobRepository jobRepository) {
        return args -> {
            if (jobRepository.count() > 0) {
                return;
            }
            Job job1 = new Job();
            job1.setTitle("Senior React Developer");
            job1.setCompany("TechCorp");
            job1.setDescription("Looking for an experienced React developer with strong Tailwind skills.");
            job1.setLocation("Remote");
            job1.setSalary("₹120,000 - ₹150,000");
            job1.setType("Full-time");
            job1.setExperience("5+ Years");
            job1.setApplicantCount(42);
            job1.setTags(List.of("React", "JavaScript", "Tailwind CSS"));

            Job job2 = new Job();
            job2.setTitle("Spring Boot Backend Engineer");
            job2.setCompany("FinanceHub");
            job2.setDescription("Join our finance team to build robust microservices.");
            job2.setLocation("New York, NY");
            job2.setSalary("₹130,000 - ₹160,000");
            job2.setType("Full-time");
            job2.setExperience("3+ Years");
            job2.setApplicantCount(18);
            job2.setTags(List.of("Java", "Spring Boot", "PostgreSQL"));

            Job job3 = new Job();
            job3.setTitle("Frontend Intern");
            job3.setCompany("Startup Inc.");
            job3.setDescription("Great opportunity to learn React and build user interfaces.");
            job3.setLocation("San Francisco, CA");
            job3.setSalary("₹40,000");
            job3.setType("Part-time");
            job3.setExperience("Entry Level");
            job3.setApplicantCount(156);
            job3.setTags(List.of("HTML", "CSS", "JavaScript"));

            Job job4 = new Job();
            job4.setTitle("Full Stack Developer");
            job4.setCompany("WebSolutions");
            job4.setDescription("We need a versatile developer proficient in React and Java.");
            job4.setLocation("Austin, TX");
            job4.setSalary("₹110,000 - ₹140,000");
            job4.setType("Full-time");
            job4.setExperience("4+ Years");
            job4.setApplicantCount(8);
            job4.setTags(List.of("React", "Java", "Docker"));

            jobRepository.saveAll(List.of(job1, job2, job3, job4));
            System.out.println("Jobs seeded to database with new fields.");
        };
    }
}
