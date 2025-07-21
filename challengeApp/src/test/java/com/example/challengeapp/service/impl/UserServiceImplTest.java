package com.example.challengeapp.service.impl;

import com.example.challengeapp.controller.dtos.request.LoginUserRequestDto;
import com.example.challengeapp.controller.dtos.request.UserCreateRequestDto;
import com.example.challengeapp.controller.dtos.response.GetUserResponseDto;
import com.example.challengeapp.controller.dtos.response.LoginResponseDto;
import com.example.challengeapp.exception.UserAlreadyExistsException;
import com.example.challengeapp.model.User;
import com.example.challengeapp.repository.UserRepository;
import com.example.challengeapp.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserServiceImpl userService;

    private UserCreateRequestDto createUserDto;
    private LoginUserRequestDto loginDto;
    private User user;

    @BeforeEach
    void setUp() {
        createUserDto = new UserCreateRequestDto();
        createUserDto.setName("Test User");
        createUserDto.setEmail("test@example.com");
        createUserDto.setPassword("password123");
        createUserDto.setRole("USER");

        loginDto = new LoginUserRequestDto();
        loginDto.setEmail("test@example.com");
        loginDto.setPassword("password123");

        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setRole("USER");
    }

    @Test
    void testCreateUser_Success() {
        // Arrange
        when(userRepository.findByEmail(createUserDto.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(createUserDto.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        GetUserResponseDto result = userService.createUser(createUserDto);

        // Assert
        assertNotNull(result);
        assertEquals("Test User", result.getName());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("USER", result.getRole());

        verify(userRepository).findByEmail(createUserDto.getEmail());
        verify(passwordEncoder).encode(createUserDto.getPassword());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testCreateUser_UserAlreadyExists() {
        // Arrange
        when(userRepository.findByEmail(createUserDto.getEmail())).thenReturn(Optional.of(user));

        // Act & Assert
        UserAlreadyExistsException exception = assertThrows(
            UserAlreadyExistsException.class,
            () -> userService.createUser(createUserDto)
        );

        assertTrue(exception.getMessage().contains("already exists"));
        verify(userRepository).findByEmail(createUserDto.getEmail());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testCreateUser_InvalidRole() {
        // Arrange
        createUserDto.setRole("INVALID_ROLE");

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.createUser(createUserDto)
        );

        assertTrue(exception.getMessage().contains("Invalid role"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testCreateUser_NullRole_DefaultsToUser() {
        // Arrange
        createUserDto.setRole(null);
        when(userRepository.findByEmail(createUserDto.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(createUserDto.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(1L);
            return savedUser;
        });

        // Act
        GetUserResponseDto result = userService.createUser(createUserDto);

        // Assert
        assertEquals("USER", result.getRole());
        verify(userRepository).save(argThat(user -> "USER".equals(user.getRole())));
    }

    @Test
    void testCreateUser_AdminRole() {
        // Arrange
        createUserDto.setRole("ADMIN");
        when(userRepository.findByEmail(createUserDto.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(createUserDto.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(1L);
            return savedUser;
        });

        // Act
        GetUserResponseDto result = userService.createUser(createUserDto);

        // Assert
        assertEquals("ADMIN", result.getRole());
        verify(userRepository).save(argThat(user -> "ADMIN".equals(user.getRole())));
    }

    @Test
    void testLogin_Success() {
        // Arrange
        String jwtToken = "test-jwt-token";
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn(jwtToken);
        when(userRepository.findByEmail(loginDto.getEmail())).thenReturn(Optional.of(user));

        // Act
        LoginResponseDto result = userService.login(loginDto);

        // Assert
        assertNotNull(result);
        assertEquals(jwtToken, result.getToken());
        assertEquals("Bearer", result.getType());
        assertNotNull(result.getUser());
        assertEquals("test@example.com", result.getUser().getEmail());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils).generateJwtToken(authentication);
        verify(userRepository).findByEmail(loginDto.getEmail());
    }

    @Test
    void testLogin_BadCredentials() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        BadCredentialsException exception = assertThrows(
            BadCredentialsException.class,
            () -> userService.login(loginDto)
        );

        assertEquals("Bad credentials", exception.getMessage());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils, never()).generateJwtToken(any(Authentication.class));
        verify(userRepository, never()).findByEmail(anyString());
    }

    @Test
    void testLogin_UserNotFound() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("token");
        when(userRepository.findByEmail(loginDto.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> userService.login(loginDto)
        );

        assertTrue(exception.getMessage().contains("User not found"));
        verify(userRepository).findByEmail(loginDto.getEmail());
    }

    @Test
    void testGetAllUsers() {
        // Arrange
        User user1 = new User();
        user1.setId(1L);
        user1.setName("User 1");
        user1.setEmail("user1@example.com");
        user1.setRole("USER");

        User user2 = new User();
        user2.setId(2L);
        user2.setName("User 2");
        user2.setEmail("user2@example.com");
        user2.setRole("ADMIN");

        when(userRepository.findAll()).thenReturn(List.of(user1, user2));

        // Act
        List<GetUserResponseDto> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        
        GetUserResponseDto firstUser = result.get(0);
        assertEquals("User 1", firstUser.getName());
        assertEquals("user1@example.com", firstUser.getEmail());
        assertEquals("USER", firstUser.getRole());

        GetUserResponseDto secondUser = result.get(1);
        assertEquals("User 2", secondUser.getName());
        assertEquals("user2@example.com", secondUser.getEmail());
        assertEquals("ADMIN", secondUser.getRole());

        verify(userRepository).findAll();
    }

    @Test
    void testGetAllUsers_EmptyList() {
        // Arrange
        when(userRepository.findAll()).thenReturn(List.of());

        // Act
        List<GetUserResponseDto> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userRepository).findAll();
    }
} 