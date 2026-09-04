package com.jobportal.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

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
public class ChatService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
    public String getChatResponse(Map<String, Object> payload) {
        try {
            boolean isSearchGrounded = payload.containsKey("isSearchGrounded") && (Boolean) payload.get("isSearchGrounded");
            String userMessage = (String) payload.get("message");
            List<Map<String, String>> history = (List<Map<String, String>>) payload.get("history");

            if ("dummy".equals(groqApiKey)) {
                // Simulate network delay
                Thread.sleep(1000);
                String prefix = isSearchGrounded ? "[Live Web] Based on recent Q3 SEC filings... " : "";
                return prefix + "This is a simulated AI response from the backend. Since the backend was started with a 'dummy' API key, I am bypassing the Groq API. " +
                       "When you provide a real key, I will analyze your query: '" + userMessage + "' properly.";
            }

            List<Map<String, String>> messages = new ArrayList<>();
            
            // System Prompt
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            
            String prompt = "You are the 'Shivani AI Investment Advisor', an expert in digital health tech, telemedicine, and enterprise architectures. " +
                            "You represent Shivani Technologies. You must be professional, insightful, and concise. " +
                            "Answer questions about our scaling models, operations, telemetry pipelines, security, and market forecasts.";
            
            if (isSearchGrounded) {
                prompt += " IMPORTANT: The user has enabled 'Live Google Search Grounding'. You must simulate fetching live market reports and prefix your response with '[Live Web]'. Reference recent market trends or specific data points related to their query to simulate a live web search.";
            }
            
            systemMessage.put("content", prompt);
            messages.add(systemMessage);

            // Add history
            if (history != null) {
                for (Map<String, String> h : history) {
                    Map<String, String> msg = new HashMap<>();
                    msg.put("role", h.get("role").equals("ai") ? "assistant" : "user");
                    msg.put("content", h.get("text"));
                    messages.add(msg);
                }
            }

            // Add current message
            Map<String, String> currentMessage = new HashMap<>();
            currentMessage.put("role", "user");
            currentMessage.put("content", userMessage);
            messages.add(currentMessage);

            Map<String, Object> requestBodyMap = new HashMap<>();
            requestBodyMap.put("model", "llama-3.3-70b-versatile");
            requestBodyMap.put("messages", messages);
            requestBodyMap.put("temperature", 0.7);

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
                return rootNode.path("choices").get(0).path("message").path("content").asText();
            } else {
                System.err.println("Groq API error: " + response.statusCode() + " " + response.body());
            }

        } catch (Exception e) {
            System.err.println("Exception calling Groq API for chat: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}
