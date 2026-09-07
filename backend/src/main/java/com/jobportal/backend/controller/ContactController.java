package com.jobportal.backend.controller;

import com.jobportal.backend.model.ContactMessage;
import com.jobportal.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @PostMapping("/send")
    public ResponseEntity<?> sendContactMessage(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String phone = request.get("phone");
        String subject = request.get("subject");
        String messageBody = request.get("message");

        try {
            // Always save to database first
            ContactMessage msg = new ContactMessage();
            msg.setName(name);
            msg.setEmail(email);
            msg.setPhone(phone);
            msg.setSubject(subject);
            msg.setMessage(messageBody);
            msg.setIsRead(false);
            msg.setCreatedAt(LocalDateTime.now());
            contactMessageRepository.save(msg);

            // Try sending email as well (best effort)
            if (mailSender != null) {
                try {
                    SimpleMailMessage mailMessage = new SimpleMailMessage();
                    // Gmail requires the 'from' address to be the authenticated user
                    mailMessage.setFrom("pravin007ptk@gmail.com");
                    mailMessage.setTo("pravin007ptk@gmail.com");
                    mailMessage.setSubject("Contact Form: " + (subject != null ? subject : "No Subject"));
                    mailMessage.setText(
                        "New message from contact form:\n\n" +
                        "Name: " + name + "\n" +
                        "Email: " + email + "\n" +
                        "Phone: " + phone + "\n\n" +
                        "Message:\n" + messageBody
                    );
                    mailMessage.setReplyTo(email);
                    mailSender.send(mailMessage);
                } catch (Exception emailEx) {
                    // Email failed but message is saved in DB - that's fine
                    System.out.println("Email notification failed (message saved to DB): " + emailEx.getMessage());
                }
            }

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
