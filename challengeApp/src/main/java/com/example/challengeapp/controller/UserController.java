package com.example.challengeapp.controller;

import com.example.challengeapp.controller.dtos.request.LoginUserRequestDto;
import com.example.challengeapp.controller.dtos.request.UserCreateRequestDto;
import com.example.challengeapp.model.User;
import com.example.challengeapp.repository.UserRepository;
import com.example.challengeapp.service.impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private UserServiceImpl userServiceImpl;
    private UserRepository userRepository;

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserCreateRequestDto userCreateRequestDto) {
        return ResponseEntity.ok(userServiceImpl.createUser(userCreateRequestDto));
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginUserRequestDto loginUserRequestDto) {
        return ResponseEntity.ok(userServiceImpl.login(loginUserRequestDto));
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userServiceImpl.getAllUsers());
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var user = userOpt.get();
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getAddress() != null) user.setAddress(updatedUser.getAddress());
        if (updatedUser.getCity() != null) user.setCity(updatedUser.getCity());
        if (updatedUser.getPostalCode() != null) user.setPostalCode(updatedUser.getPostalCode());
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
