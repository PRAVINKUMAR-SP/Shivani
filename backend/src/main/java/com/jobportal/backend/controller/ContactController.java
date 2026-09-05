package com.jobportal.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send")
    public ResponseEntity<?> sendContactEmail(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String phone = request.get("phone");
        String subject = request.get("subject");
        String messageBody = request.get("message");

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo("pravin007ptk@gmail.com");
            mailMessage.setSubject("Contact Form Submission: " + subject);
            
            String text = "You have received a new message from the contact form.\n\n" +
                          "Name: " + name + "\n" +
                          "Email: " + email + "\n" +
                          "Phone: " + phone + "\n\n" +
                          "Message:\n" + messageBody;
            
            mailMessage.setText(text);
            mailMessage.setReplyTo(email);
            
            mailSender.send(mailMessage);

            return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send email: " + e.getMessage()));
        }
    }
}
