package com.example.challengeapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(originPatterns = "*")
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> getStatus() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "ChallengeApp Backend is running successfully.");
        return ResponseEntity.ok(status);
    }
}
