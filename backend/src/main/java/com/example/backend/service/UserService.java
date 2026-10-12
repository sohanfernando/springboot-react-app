package com.example.backend.service;

import com.example.backend.controller.dtos.request.LoginUserRequestDto;
import com.example.backend.controller.dtos.request.UserCreateRequestDto;
import com.example.backend.controller.dtos.request.UserUpdateRequestDto;
import com.example.backend.controller.dtos.response.AuthResponseDto;
import com.example.backend.controller.dtos.response.GetUserResponseDto;

import java.util.List;

public interface UserService {
    AuthResponseDto createUser(UserCreateRequestDto userCreateRequestDto);
    GetUserResponseDto createAdmin(UserCreateRequestDto userCreateRequestDto);
    AuthResponseDto login(LoginUserRequestDto loginUserRequestDto, String clientAddress);
    GetUserResponseDto updateProfile(Long id, UserUpdateRequestDto update);
    List<GetUserResponseDto> getAllUsers();
}
