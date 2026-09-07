package com.jobportal.backend.controller;

import com.jobportal.backend.model.ContactMessage;
import com.jobportal.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping("/send")
    public ResponseEntity<?> sendContactMessage(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String phone = request.get("phone");
        String subject = request.get("subject");
        String messageBody = request.get("message");

        try {
            ContactMessage msg = new ContactMessage();
            msg.setName(name);
            msg.setEmail(email);
            msg.setPhone(phone);
            msg.setSubject(subject);
            msg.setMessage(messageBody);
            msg.setIsRead(false);
            msg.setCreatedAt(LocalDateTime.now());

            contactMessageRepository.save(msg);

            return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send message: " + e.getMessage()));
        }
    }

    // Admin endpoints
    @GetMapping("/all")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactMessageRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        long count = contactMessageRepository.countByIsRead(false);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return contactMessageRepository.findById(id).map(msg -> {
            msg.setIsRead(true);
            contactMessageRepository.save(msg);
            return ResponseEntity.ok(Map.of("message", "Marked as read"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        if (contactMessageRepository.existsById(id)) {
            contactMessageRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Message deleted"));
        }
        return ResponseEntity.notFound().build();
    }
}
