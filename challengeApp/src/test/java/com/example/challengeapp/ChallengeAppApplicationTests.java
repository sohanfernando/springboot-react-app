package com.example.challengeapp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class ChallengeAppApplicationTests {

    @Test
    void contextLoads() {
        // This test ensures that the Spring application context loads successfully
        // with all the security configurations, JWT setup, and dependencies
    }

    @Test
    void applicationStartsSuccessfully() {
        // This test verifies that the application can start with all components
        // including security filters, JWT configuration, and service beans
    }
}
