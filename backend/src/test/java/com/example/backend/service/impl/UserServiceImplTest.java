package com.example.backend.service.impl;

import com.example.backend.controller.dtos.request.LoginUserRequestDto;
import com.example.backend.controller.dtos.request.UserCreateRequestDto;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.LoginAttemptService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

public class UserServiceImplTest {
    private static final String ADDRESS = "203.0.113.7";

    private UserRepository userRepository;
    private BCryptPasswordEncoder encoder;
    private JwtService jwtService;
    private UserServiceImpl service;

    @BeforeEach
    void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        encoder = new BCryptPasswordEncoder(4);
        jwtService = new JwtService("", 60);
        service = new UserServiceImpl(userRepository, encoder, jwtService, new LoginAttemptService());
        Mockito.when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User saved = i.getArgument(0);
            if (saved.getId() == null) saved.setId(1L);
            return saved;
        });
    }

    private User storedUser(String email, String rawPassword) {
        User user = new User();
        user.setId(1L);
        user.setName("Test");
        user.setEmail(email);
        user.setPassword(encoder.encode(rawPassword));
        user.setRole("USER");
        Mockito.when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        return user;
    }

    private LoginUserRequestDto loginRequest(String email, String password) {
        LoginUserRequestDto dto = new LoginUserRequestDto();
        dto.setEmail(email);
        dto.setPassword(password);
        return dto;
    }

    @Test
    void testCreateUser() {
        var result = service.createUser(new UserCreateRequestDto("Test", "Test@Example.com", "password1"));

        assertEquals("Test", result.getName());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("USER", result.getRole());
        assertEquals(Optional.of(1L), jwtService.verify(result.getToken()));
    }

    @Test
    void signupRejectsAnEmailThatIsAlreadyRegistered() {
        Mockito.when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        var e = assertThrows(ResponseStatusException.class,
                () -> service.createUser(new UserCreateRequestDto("Test", "test@example.com", "password1")));
        assertEquals(HttpStatus.CONFLICT, e.getStatusCode());
    }

    @Test
    void loginReturnsATokenForTheRightPassword() {
        storedUser("test@example.com", "password1");

        var result = service.login(loginRequest(" Test@Example.com ", "password1"), ADDRESS);

        assertEquals(Optional.of(1L), jwtService.verify(result.getToken()));
    }

    @Test
    void wrongPasswordAndUnknownEmailGiveTheSameError() {
        storedUser("test@example.com", "password1");

        var wrongPassword = assertThrows(ResponseStatusException.class,
                () -> service.login(loginRequest("test@example.com", "nope-nope"), ADDRESS));
        var unknownEmail = assertThrows(ResponseStatusException.class,
                () -> service.login(loginRequest("nobody@example.com", "nope-nope"), ADDRESS));

        assertEquals(HttpStatus.UNAUTHORIZED, wrongPassword.getStatusCode());
        assertEquals(wrongPassword.getStatusCode(), unknownEmail.getStatusCode());
        assertEquals(wrongPassword.getReason(), unknownEmail.getReason());
    }

    @Test
    void repeatedFailuresLockTheAccountEvenForTheRightPassword() {
        storedUser("test@example.com", "password1");

        for (int i = 0; i < 10; i++) {
            assertThrows(ResponseStatusException.class,
                    () -> service.login(loginRequest("test@example.com", "nope-nope"), ADDRESS));
        }

        var e = assertThrows(ResponseStatusException.class,
                () -> service.login(loginRequest("test@example.com", "password1"), ADDRESS));
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, e.getStatusCode());
    }
}
