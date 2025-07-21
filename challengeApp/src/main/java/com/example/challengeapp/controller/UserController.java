package com.example.challengeapp.controller;

import com.example.challengeapp.controller.dtos.request.LoginUserRequestDto;
import com.example.challengeapp.controller.dtos.request.UserCreateRequestDto;
import com.example.challengeapp.controller.dtos.response.GetUserResponseDto;
import com.example.challengeapp.controller.dtos.response.LoginResponseDto;
import com.example.challengeapp.model.User;
import com.example.challengeapp.repository.UserRepository;
import com.example.challengeapp.security.UserDetailsImpl;
import com.example.challengeapp.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private UserService userService;
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<GetUserResponseDto> signup(@Valid @RequestBody UserCreateRequestDto userCreateRequestDto) {
        GetUserResponseDto response = userService.createUser(userCreateRequestDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginUserRequestDto loginUserRequestDto) {
        LoginResponseDto response = userService.login(loginUserRequestDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GetUserResponseDto>> getAllUsers() {
        List<GetUserResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile")
    public ResponseEntity<GetUserResponseDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        GetUserResponseDto response = new GetUserResponseDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getPhone(),
            user.getAddress(),
            user.getCity(),
            user.getPostalCode()
        );
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/profile")
    public ResponseEntity<GetUserResponseDto> updateCurrentUser(@RequestBody User updatedUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Only allow updating certain fields
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getAddress() != null) user.setAddress(updatedUser.getAddress());
        if (updatedUser.getCity() != null) user.setCity(updatedUser.getCity());
        if (updatedUser.getPostalCode() != null) user.setPostalCode(updatedUser.getPostalCode());
        
        User savedUser = userRepository.save(user);
        
        GetUserResponseDto response = new GetUserResponseDto(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole(),
            savedUser.getPhone(),
            savedUser.getAddress(),
            savedUser.getCity(),
            savedUser.getPostalCode()
        );
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GetUserResponseDto> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getAddress() != null) user.setAddress(updatedUser.getAddress());
        if (updatedUser.getCity() != null) user.setCity(updatedUser.getCity());
        if (updatedUser.getPostalCode() != null) user.setPostalCode(updatedUser.getPostalCode());
        if (updatedUser.getRole() != null && (updatedUser.getRole().equals("USER") || updatedUser.getRole().equals("ADMIN"))) {
            user.setRole(updatedUser.getRole());
        }
        
        User savedUser = userRepository.save(user);
        
        GetUserResponseDto response = new GetUserResponseDto(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole(),
            savedUser.getPhone(),
            savedUser.getAddress(),
            savedUser.getCity(),
            savedUser.getPostalCode()
        );
        
        return ResponseEntity.ok(response);
    }
}
