package com.example.challengeapp.controller.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserCreateRequestDto {
    private String name;
    private String email;
    private String password;
}
