package com.example.backend.controller.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

/** The signed-in user's details plus the token to send on later requests. */
@Data
@AllArgsConstructor
public class AuthResponseDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String address;
    private String city;
    private String postalCode;
    private String token;
}
