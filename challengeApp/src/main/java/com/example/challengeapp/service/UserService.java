package com.example.challengeapp.service;

import com.example.challengeapp.controller.dtos.request.LoginUserRequestDto;
import com.example.challengeapp.controller.dtos.request.UserCreateRequestDto;
import com.example.challengeapp.controller.dtos.response.GetUserResponseDto;

public interface UserService {
    GetUserResponseDto createUser(UserCreateRequestDto userCreateRequestDto);
    GetUserResponseDto login(LoginUserRequestDto loginUserRequestDto);
}
