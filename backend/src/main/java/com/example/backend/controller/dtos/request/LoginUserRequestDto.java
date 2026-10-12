package com.example.backend.controller.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginUserRequestDto {
    @NotBlank(message = "Please enter your email.")
    @Size(max = 254, message = "Email is too long.")
    private String email;

    @NotBlank(message = "Please enter your password.")
    @Size(max = 72, message = "Password is too long.")
    private String password;
}
