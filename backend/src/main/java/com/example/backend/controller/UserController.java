package com.example.backend.controller;

import com.example.backend.controller.dtos.request.LoginUserRequestDto;
import com.example.backend.controller.dtos.request.UserCreateRequestDto;
import com.example.backend.controller.dtos.request.UserUpdateRequestDto;
import com.example.backend.security.AuthUser;
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import com.example.backend.security.RateLimiter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Duration SIGNUP_WINDOW = Duration.ofHours(1);

    private final UserService userService;
    private final RateLimiter rateLimiter;
    private final int maxSignupsPerHour;

    public UserController(UserService userService, RateLimiter rateLimiter,
                          @Value("${app.signup.max-per-hour:5}") int maxSignupsPerHour) {
        this.userService = userService;
        this.rateLimiter = rateLimiter;
        this.maxSignupsPerHour = maxSignupsPerHour;
    }

    /**
     * Limited per client address. Every attempt counts, successful or not, so
     * the limit also slows down using the "email already exists" answer to
     * find out which addresses are registered.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserCreateRequestDto request, HttpServletRequest http) {
        String key = "signup-address:" + http.getRemoteAddr();
        if (rateLimiter.isBlocked(key, maxSignupsPerHour)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Too many accounts created from this connection. Please try again in an hour.");
        }
        rateLimiter.hit(key, SIGNUP_WINDOW);
        return ResponseEntity.ok(userService.createUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginUserRequestDto request, HttpServletRequest http) {
        // getRemoteAddr, not X-Forwarded-For: that header is caller-supplied and
        // would let an attacker pick a fresh "address" for every guess.
        return ResponseEntity.ok(userService.login(request, http.getRemoteAddr()));
    }

    /** Admin only (enforced in SecurityConfig). */
    @PostMapping("/admins")
    public ResponseEntity<?> createAdmin(@Valid @RequestBody UserCreateRequestDto request) {
        return ResponseEntity.ok(userService.createAdmin(request));
    }

    /** Admin only (enforced in SecurityConfig). */
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @Valid @RequestBody UserUpdateRequestDto update,
                                        @AuthenticationPrincipal AuthUser caller) {
        if (!caller.isAdmin() && !caller.id().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own profile.");
        }
        return ResponseEntity.ok(userService.updateProfile(id, update));
    }
}
