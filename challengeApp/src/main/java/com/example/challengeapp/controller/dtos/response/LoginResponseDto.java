package com.example.challengeapp.controller.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String token;
    private String type = "Bearer";
    private GetUserResponseDto user;
    
    public LoginResponseDto(String token, GetUserResponseDto user) {
        this.token = token;
        this.user = user;
    }
}