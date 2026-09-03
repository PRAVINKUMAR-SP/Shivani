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
            if (jobRepository.count() == 0) {
                Job job1 = new Job(null, "Senior React Developer", "TechCorp", "Looking for an experienced React developer with strong Tailwind skills.", "Remote", "$120,000 - $150,000", "Full-time", null);
                Job job2 = new Job(null, "Spring Boot Backend Engineer", "FinanceHub", "Join our finance team to build robust microservices.", "New York, NY", "$130,000 - $160,000", "Full-time", null);
                Job job3 = new Job(null, "Frontend Intern", "Startup Inc.", "Great opportunity to learn React and build user interfaces.", "San Francisco, CA", "$40,000", "Part-time", null);
                Job job4 = new Job(null, "Full Stack Developer", "WebSolutions", "We need a versatile developer proficient in React and Java.", "Austin, TX", "$110,000 - $140,000", "Full-time", null);

                jobRepository.saveAll(List.of(job1, job2, job3, job4));
                System.out.println("Jobs seeded to database.");
            }
        };
    }
}
