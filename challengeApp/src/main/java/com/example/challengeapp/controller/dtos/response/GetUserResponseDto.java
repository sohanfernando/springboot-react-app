package com.example.challengeapp.controller.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetUserResponseDto {
    private Long id;
    private String name;
    private String email;
}
