package com.example.backend;

import com.example.backend.repository.RateLimitRepository;
import com.example.backend.security.RateLimiter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.time.Duration;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Throttling end to end, with the counters in a real (in-memory) database. */
@SpringBootTest(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.sql.init.mode=never",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
        "app.signup.max-per-hour=3"
})
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
class RateLimitIntegrationTest {
    private static final String PASSWORD = "correct-horse-battery";

    @Autowired private MockMvc mockMvc;
    @Autowired private RateLimitRepository rateLimitRepository;
    @Autowired private RateLimiter rateLimiter;

    private static String uniqueEmail() {
        return "u" + UUID.randomUUID().toString().replace("-", "") + "@example.com";
    }

    private ResultActions signUp(String email, String fromAddress) throws Exception {
        return mockMvc.perform(post("/users/signup")
                .with(request -> {
                    request.setRemoteAddr(fromAddress);
                    return request;
                })
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test\",\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}"));
    }

    private ResultActions logIn(String email, String password, String fromAddress) throws Exception {
        return mockMvc.perform(post("/users/login")
                .with(request -> {
                    request.setRemoteAddr(fromAddress);
                    return request;
                })
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"));
    }

    @Test
    void signupsAreLimitedPerAddress() throws Exception {
        for (int i = 0; i < 3; i++) {
            signUp(uniqueEmail(), "198.51.100.1").andExpect(status().isOk());
        }
        signUp(uniqueEmail(), "198.51.100.1").andExpect(status().isTooManyRequests());

        // Someone else is unaffected.
        signUp(uniqueEmail(), "198.51.100.2").andExpect(status().isOk());
    }

    @Test
    void failedSignupsCountTowardsTheLimitToo() throws Exception {
        String taken = uniqueEmail();
        signUp(taken, "198.51.100.3").andExpect(status().isOk());

        // Probing which emails are registered uses up the same allowance.
        signUp(taken, "198.51.100.3").andExpect(status().isConflict());
        signUp(taken, "198.51.100.3").andExpect(status().isConflict());
        signUp(taken, "198.51.100.3").andExpect(status().isTooManyRequests());
    }

    @Test
    void tenWrongPasswordsLockTheAccountEvenForTheRightPassword() throws Exception {
        String email = uniqueEmail();
        signUp(email, "198.51.100.4").andExpect(status().isOk());

        for (int i = 0; i < 10; i++) {
            logIn(email, "wrong-password", "198.51.100.5").andExpect(status().isUnauthorized());
        }

        logIn(email, PASSWORD, "198.51.100.5").andExpect(status().isTooManyRequests());
        // The account is locked whichever address the next attempt comes from.
        logIn(email, PASSWORD, "198.51.100.6").andExpect(status().isTooManyRequests());
    }

    @Test
    void aCorrectPasswordClearsEarlierFailures() throws Exception {
        String email = uniqueEmail();
        signUp(email, "198.51.100.7").andExpect(status().isOk());

        for (int i = 0; i < 9; i++) {
            logIn(email, "wrong-password", "198.51.100.8").andExpect(status().isUnauthorized());
        }
        logIn(email, PASSWORD, "198.51.100.8").andExpect(status().isOk());
        for (int i = 0; i < 9; i++) {
            logIn(email, "wrong-password", "198.51.100.9").andExpect(status().isUnauthorized());
        }

        logIn(email, PASSWORD, "198.51.100.9").andExpect(status().isOk());
    }

    @Test
    void countersLiveInTheDatabaseNotInMemory() {
        String key = "test:" + UUID.randomUUID();
        rateLimiter.hit(key, Duration.ofMinutes(5));
        rateLimiter.hit(key, Duration.ofMinutes(5));

        // A second instance, as another server or a restarted one would be, sees the same count.
        RateLimiter anotherServer = new RateLimiter(rateLimitRepository);
        assertTrue(anotherServer.isBlocked(key, 2));
        assertFalse(anotherServer.isBlocked(key, 3));
    }

    @Test
    void anExpiredCounterNoLongerBlocksAndStartsAgain() throws Exception {
        String key = "test:" + UUID.randomUUID();
        rateLimiter.hit(key, Duration.ofMillis(50));
        assertTrue(rateLimiter.isBlocked(key, 1));

        Thread.sleep(120);

        assertFalse(rateLimiter.isBlocked(key, 1));
        rateLimiter.hit(key, Duration.ofMinutes(5));
        assertTrue(rateLimiter.isBlocked(key, 1));
        assertFalse(rateLimiter.isBlocked(key, 2));
    }
}
