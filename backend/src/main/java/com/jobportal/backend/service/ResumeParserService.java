package com.jobportal.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
public class ResumeParserService {

    private static final List<String> COMMON_SKILLS = Arrays.asList(
            "Java", "Python", "JavaScript", "React", "Node.js", "Spring Boot", "SQL", "HTML", "CSS", 
            "AWS", "Docker", "Kubernetes", "Git", "C++", "C#", "Angular", "Vue", "MongoDB", "PostgreSQL",
            "Machine Learning", "Data Science", "TypeScript", "Linux", "REST API", "GraphQL"
    );

    public Map<String, Object> parseResume(MultipartFile file) {
        Map<String, Object> extractedData = new HashMap<>();
        
        if (file.isEmpty() || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            extractedData.put("error", "Invalid file. Only PDF is supported.");
            return extractedData;
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            // Extract Email
            Pattern emailPattern = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");
            Matcher emailMatcher = emailPattern.matcher(text);
            if (emailMatcher.find()) {
                extractedData.put("email", emailMatcher.group());
            }

            // Extract Phone (Basic heuristic)
            Pattern phonePattern = Pattern.compile("(\\(?\\d{3}\\)?[\\s.-]?)?\\d{3}[\\s.-]?\\d{4}");
            Matcher phoneMatcher = phonePattern.matcher(text);
            if (phoneMatcher.find()) {
                extractedData.put("phoneNumber", phoneMatcher.group());
            }

            // Extract Skills
            List<String> foundSkills = new ArrayList<>();
            String lowerText = text.toLowerCase();
            for (String skill : COMMON_SKILLS) {
                // word boundary to avoid partial matches
                if (lowerText.matches(".*\\b" + skill.toLowerCase().replace("+", "\\+") + "\\b.*")) {
                    foundSkills.add(skill);
                }
            }
            extractedData.put("skills", foundSkills);

            // Basic extraction for Education and Experience
            // We'll look for keywords "Education" and "Experience" and grab the text after them up to the next double newline
            String education = extractSection(text, "Education");
            if (education != null) extractedData.put("education", education.trim());

            String experience = extractSection(text, "Experience");
            if (experience != null) extractedData.put("experience", experience.trim());

        } catch (IOException e) {
            extractedData.put("error", "Failed to parse PDF file.");
            e.printStackTrace();
        }

        return extractedData;
    }

    private String extractSection(String fullText, String sectionHeader) {
        // Split by lines
        String[] lines = fullText.split("\\r?\\n");
        boolean inSection = false;
        StringBuilder sectionText = new StringBuilder();
        int emptyLineCount = 0;

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.toLowerCase().equals(sectionHeader.toLowerCase())) {
                inSection = true;
                continue;
            }

            if (inSection) {
                if (trimmed.isEmpty()) {
                    emptyLineCount++;
                    // If we hit two empty lines, assume section is over
                    if (emptyLineCount >= 2 && sectionText.length() > 20) {
                        break;
                    }
                } else {
                    emptyLineCount = 0;
                    sectionText.append(trimmed).append("\n");
                }
                
                // Stop if we hit another common header
                if (trimmed.matches("(?i)^(Experience|Education|Skills|Projects|Summary|Objective|Certifications)$")) {
                    break;
                }
            }
        }
        return sectionText.length() > 0 ? sectionText.toString() : null;
    }
}
