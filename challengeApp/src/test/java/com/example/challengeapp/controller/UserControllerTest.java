package com.example.challengeapp.controller;

import com.example.challengeapp.controller.dtos.request.LoginUserRequestDto;
import com.example.challengeapp.controller.dtos.request.UserCreateRequestDto;
import com.example.challengeapp.controller.dtos.response.GetUserResponseDto;
import com.example.challengeapp.controller.dtos.response.LoginResponseDto;
import com.example.challengeapp.model.User;
import com.example.challengeapp.repository.UserRepository;
import com.example.challengeapp.security.JwtUtils;
import com.example.challengeapp.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtUtils jwtUtils;

    private UserCreateRequestDto createUserDto;
    private LoginUserRequestDto loginDto;
    private GetUserResponseDto userResponseDto;
    private LoginResponseDto loginResponseDto;
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

        userResponseDto = new GetUserResponseDto();
        userResponseDto.setId(1L);
        userResponseDto.setName("Test User");
        userResponseDto.setEmail("test@example.com");
        userResponseDto.setRole("USER");

        loginResponseDto = new LoginResponseDto();
        loginResponseDto.setToken("test-jwt-token");
        loginResponseDto.setUser(userResponseDto);

        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setRole("USER");
    }

    @Test
    void testSignup_Success() throws Exception {
        when(userService.createUser(any(UserCreateRequestDto.class))).thenReturn(userResponseDto);

        mockMvc.perform(post("/users/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createUserDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test User"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));

        verify(userService).createUser(any(UserCreateRequestDto.class));
    }

    @Test
    void testSignup_ValidationError() throws Exception {
        UserCreateRequestDto invalidDto = new UserCreateRequestDto();
        invalidDto.setName(""); // Invalid - empty name
        invalidDto.setEmail("invalid-email"); // Invalid email format
        invalidDto.setPassword("123"); // Invalid - too short

        mockMvc.perform(post("/users/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));

        verify(userService, never()).createUser(any(UserCreateRequestDto.class));
    }

    @Test
    void testLogin_Success() throws Exception {
        when(userService.login(any(LoginUserRequestDto.class))).thenReturn(loginResponseDto);

        mockMvc.perform(post("/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));

        verify(userService).login(any(LoginUserRequestDto.class));
    }

    @Test
    void testLogin_ValidationError() throws Exception {
        LoginUserRequestDto invalidDto = new LoginUserRequestDto();
        invalidDto.setEmail(""); // Invalid - empty email
        invalidDto.setPassword(""); // Invalid - empty password

        mockMvc.perform(post("/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).login(any(LoginUserRequestDto.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllUsers_AsAdmin() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(userResponseDto));

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test User"));

        verify(userService).getAllUsers();
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetAllUsers_AsUser_Forbidden() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isForbidden());

        verify(userService, never()).getAllUsers();
    }

    @Test
    @WithMockUser(username = "test@example.com", roles = "USER")
    void testGetCurrentUser() throws Exception {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test User"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    @WithMockUser(username = "test@example.com", roles = "USER")
    void testUpdateCurrentUser() throws Exception {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        String updateJson = "{\"name\":\"Updated Name\",\"phone\":\"1234567890\"}";

        mockMvc.perform(patch("/users/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userRepository).findByEmail("test@example.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testUpdateUser_AsAdmin() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        String updateJson = "{\"name\":\"Admin Updated Name\",\"role\":\"ADMIN\"}";

        mockMvc.perform(patch("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userRepository).findById(1L);
        verify(userRepository).save(any(User.class));
    }

    @Test
    @WithMockUser(roles = "USER")
    void testUpdateUser_AsUser_Forbidden() throws Exception {
        String updateJson = "{\"name\":\"Updated Name\"}";

        mockMvc.perform(patch("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isForbidden());

        verify(userRepository, never()).findById(any());
    }

    @Test
    void testSignup_Unauthenticated_Success() throws Exception {
        // Signup should be accessible without authentication
        when(userService.createUser(any(UserCreateRequestDto.class))).thenReturn(userResponseDto);

        mockMvc.perform(post("/users/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createUserDto)))
                .andExpect(status().isOk());
    }

    @Test
    void testLogin_Unauthenticated_Success() throws Exception {
        // Login should be accessible without authentication
        when(userService.login(any(LoginUserRequestDto.class))).thenReturn(loginResponseDto);

        mockMvc.perform(post("/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk());
    }
} 