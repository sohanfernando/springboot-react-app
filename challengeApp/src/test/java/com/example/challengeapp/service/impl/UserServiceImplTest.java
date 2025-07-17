package com.example.challengeapp.service.impl;

import com.example.challengeapp.controller.dtos.request.UserCreateRequestDto;
import com.example.challengeapp.model.User;
import com.example.challengeapp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

public class UserServiceImplTest {
    @Test
    void testCreateUser() {
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        UserServiceImpl service = new UserServiceImpl(userRepository, encoder);

        UserCreateRequestDto dto = new UserCreateRequestDto("Test", "test@example.com", "pass", "USER");
        Mockito.when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        var result = service.createUser(dto);
        assertEquals("Test", result.getName());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("USER", result.getRole());
    }
} 