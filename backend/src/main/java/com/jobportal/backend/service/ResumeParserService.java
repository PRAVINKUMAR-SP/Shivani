package com.jobportal.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.type.TypeReference;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class ResumeParserService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> parseResume(MultipartFile file) {
        Map<String, Object> extractedData = new HashMap<>();
        
        if (file.isEmpty() || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            extractedData.put("error", "Invalid file. Only PDF is supported.");
            return extractedData;
        }

        extractedData.put("fileName", file.getOriginalFilename());

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if (text == null || text.trim().isEmpty()) {
                extractedData.put("error", "Could not extract text from PDF.");
                return extractedData;
            }

            // Call Groq API
            Map<String, Object> aiParsedData = callGroqApi(text);
            if (aiParsedData != null) {
                extractedData.putAll(aiParsedData);
            } else {
                extractedData.put("error", "AI parsing failed. Please try again.");
            }

        } catch (IOException e) {
            extractedData.put("error", "Failed to parse PDF file.");
            e.printStackTrace();
        }

        return extractedData;
    }

    private Map<String, Object> callGroqApi(String resumeText) {
        try {
            // Trim text to avoid token limits just in case
            if (resumeText.length() > 15000) {
                resumeText = resumeText.substring(0, 15000);
            }

            String prompt = "You are an expert resume parser. Extract the following information from the provided resume text and return it strictly as a JSON object (no markdown formatting, no code blocks, just raw JSON). " +
                            "Fields required: 'email' (string), 'phoneNumber' (string), 'skills' (array of strings), 'education' (string summary of education), 'experience' (string summary of work experience). " +
                            "If a field is not found, leave it as an empty string or empty array.\n\n" +
                            "Resume Text:\n" + resumeText;

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> requestBodyMap = new HashMap<>();
            requestBodyMap.put("model", "llama-3.1-8b-instant");
            requestBodyMap.put("messages", List.of(message));
            requestBodyMap.put("temperature", 0.0);

            String requestBody = objectMapper.writeValueAsString(requestBodyMap);

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                    .header("Authorization", "Bearer " + groqApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode rootNode = objectMapper.readTree(response.body());
                String content = rootNode.path("choices").get(0).path("message").path("content").asText();
                
                // Sometimes LLM returns JSON enclosed in ```json ... ``` despite instructions. Strip it if necessary.
                content = content.replaceAll("^```json\\s*", "").replaceAll("^```\\s*", "").replaceAll("\\s*```$", "").trim();
                
                return objectMapper.readValue(content, new TypeReference<Map<String, Object>>() {});
            } else {
                System.err.println("Groq API error: " + response.statusCode() + " " + response.body());
            }

        } catch (Exception e) {
            System.err.println("Exception calling Groq API: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}
