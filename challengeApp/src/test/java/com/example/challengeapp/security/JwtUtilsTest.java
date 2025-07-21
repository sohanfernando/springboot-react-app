package com.example.challengeapp.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private UserDetailsImpl userDetails;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        
        // Set test values using reflection
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "testSecretKey12345678901234567890123456789012345678901234567890");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000); // 24 hours

        // Create test user details
        userDetails = new UserDetailsImpl(
            1L,
            "Test User",
            "test@example.com",
            "password",
            List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        authentication = new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities()
        );
    }

    @Test
    void testGenerateJwtToken_WithAuthentication() {
        // Act
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts separated by dots
    }

    @Test
    void testGenerateJwtToken_WithEmail() {
        // Act
        String token = jwtUtils.generateJwtToken("test@example.com");

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3);
    }

    @Test
    void testGetEmailFromJwtToken() {
        // Arrange
        String token = jwtUtils.generateJwtToken(authentication);

        // Act
        String email = jwtUtils.getEmailFromJwtToken(token);

        // Assert
        assertEquals("test@example.com", email);
    }

    @Test
    void testValidateJwtToken_ValidToken() {
        // Arrange
        String token = jwtUtils.generateJwtToken(authentication);

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testValidateJwtToken_InvalidToken() {
        // Arrange
        String invalidToken = "invalid.jwt.token";

        // Act
        boolean isValid = jwtUtils.validateJwtToken(invalidToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testValidateJwtToken_EmptyToken() {
        // Act
        boolean isValid = jwtUtils.validateJwtToken("");

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testValidateJwtToken_NullToken() {
        // Act
        boolean isValid = jwtUtils.validateJwtToken(null);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testGetEmailFromJwtToken_WithDirectlyGeneratedToken() {
        // Arrange
        String email = "direct@example.com";
        String token = jwtUtils.generateJwtToken(email);

        // Act
        String extractedEmail = jwtUtils.getEmailFromJwtToken(token);

        // Assert
        assertEquals(email, extractedEmail);
    }

    @Test
    void testJwtTokenRoundTrip() {
        // Arrange
        String originalEmail = "roundtrip@example.com";

        // Act
        String token = jwtUtils.generateJwtToken(originalEmail);
        String extractedEmail = jwtUtils.getEmailFromJwtToken(token);
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertEquals(originalEmail, extractedEmail);
        assertTrue(isValid);
    }
}