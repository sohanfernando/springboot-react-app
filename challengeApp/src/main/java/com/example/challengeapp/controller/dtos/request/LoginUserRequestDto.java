package com.example.challengeapp.controller.dtos.request;

import lombok.Data;

@Data
public class LoginUserRequestDto {
    private String email;
    private String password;
}
