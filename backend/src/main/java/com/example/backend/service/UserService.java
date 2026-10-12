package com.example.backend.service;

import com.example.backend.controller.dtos.request.LoginUserRequestDto;
import com.example.backend.controller.dtos.request.UserCreateRequestDto;
import com.example.backend.controller.dtos.response.GetUserResponseDto;

public interface UserService {
    GetUserResponseDto createUser(UserCreateRequestDto userCreateRequestDto);
    GetUserResponseDto login(LoginUserRequestDto loginUserRequestDto);
}
