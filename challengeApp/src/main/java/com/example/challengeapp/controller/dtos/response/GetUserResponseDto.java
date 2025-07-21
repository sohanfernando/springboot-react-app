package com.example.challengeapp.controller.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetUserResponseDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String address;
    private String city;
    private String postalCode;
}
