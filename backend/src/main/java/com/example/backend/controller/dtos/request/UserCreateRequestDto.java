package com.example.backend.controller.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Deliberately has no role field: the caller never chooses their own role. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequestDto {
    @NotBlank(message = "Please enter your name.")
    @Size(max = 100, message = "Name is too long.")
    private String name;

    @NotBlank(message = "Please enter your email.")
    @Email(message = "Please enter a valid email address.")
    @Size(max = 254, message = "Email is too long.")
    private String email;

    // BCrypt only reads the first 72 bytes, so longer passwords are refused
    // rather than silently truncated.
    @NotBlank(message = "Please enter a password.")
    @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters.")
    private String password;
}
