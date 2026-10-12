package com.example.backend.controller;

import com.example.backend.controller.dtos.request.UserUpdateRequestDto;
import com.example.backend.controller.dtos.response.GetUserResponseDto;
import com.example.backend.security.AuthUser;
import com.example.backend.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Filters are off here, so these cover controller logic only; the URL rules
// are exercised end to end in SecurityIntegrationTest.
@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    private void signInAs(long id, String role) {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                new AuthUser(id, "user" + id + "@example.com", role), null, List.of()));
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void testUpdateUser() throws Exception {
        signInAs(1L, "USER");
        Mockito.when(userService.updateProfile(eq(1L), any(UserUpdateRequestDto.class)))
                .thenReturn(new GetUserResponseDto(1L, "Updated Name", "user1@example.com", "USER", null, null, null, null));

        mockMvc.perform(patch("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Updated Name\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"));
    }

    @Test
    void aUserCannotUpdateSomeoneElse() throws Exception {
        signInAs(2L, "USER");

        mockMvc.perform(patch("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Hijacked\"}"))
                .andExpect(status().isForbidden());

        Mockito.verifyNoInteractions(userService);
    }

    @Test
    void signupRejectsAShortPassword() throws Exception {
        mockMvc.perform(post("/users/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test\",\"email\":\"test@example.com\",\"password\":\"short\"}"))
                .andExpect(status().isBadRequest());

        Mockito.verifyNoInteractions(userService);
    }

    @Test
    void signupRejectsAMalformedEmail() throws Exception {
        mockMvc.perform(post("/users/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test\",\"email\":\"not-an-email\",\"password\":\"password1\"}"))
                .andExpect(status().isBadRequest());

        Mockito.verifyNoInteractions(userService);
    }
}
