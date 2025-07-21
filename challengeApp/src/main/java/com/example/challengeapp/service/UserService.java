package com.example.challengeapp.service;

import com.example.challengeapp.controller.dtos.request.LoginUserRequestDto;
import com.example.challengeapp.controller.dtos.request.UserCreateRequestDto;
import com.example.challengeapp.controller.dtos.response.GetUserResponseDto;
import com.example.challengeapp.controller.dtos.response.LoginResponseDto;

import java.util.List;

public interface UserService {
    GetUserResponseDto createUser(UserCreateRequestDto userCreateRequestDto);
    LoginResponseDto login(LoginUserRequestDto loginUserRequestDto);
    List<GetUserResponseDto> getAllUsers();
}
