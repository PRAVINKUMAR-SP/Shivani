package com.jobportal.backend.controller;

import com.jobportal.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> payload) {
        String response = chatService.getChatResponse(payload);
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("response", response != null ? response : "Sorry, I am currently unavailable. Please try again later.");
        return ResponseEntity.ok(responseMap);
    }
}
