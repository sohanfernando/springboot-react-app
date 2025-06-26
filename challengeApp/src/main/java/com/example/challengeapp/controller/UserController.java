package com.example.challengeapp.controller;

import com.example.challengeapp.controller.dtos.request.LoginUserRequestDto;
import com.example.challengeapp.controller.dtos.request.UserCreateRequestDto;
import com.example.challengeapp.service.impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private UserServiceImpl userServiceImpl;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserCreateRequestDto userCreateRequestDto) {
        return ResponseEntity.ok(userServiceImpl.createUser(userCreateRequestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginUserRequestDto loginUserRequestDto) {
        return ResponseEntity.ok(userServiceImpl.login(loginUserRequestDto));
    }
}
