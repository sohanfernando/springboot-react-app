package com.example.challengeapp.service.impl;

import com.example.challengeapp.controller.dtos.request.LoginUserRequestDto;
import com.example.challengeapp.controller.dtos.request.UserCreateRequestDto;
import com.example.challengeapp.controller.dtos.response.GetUserResponseDto;
import com.example.challengeapp.model.User;
import com.example.challengeapp.repository.UserRepository;
import com.example.challengeapp.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public GetUserResponseDto createUser(UserCreateRequestDto userCreateRequestDto){

        String role = userCreateRequestDto.getRole();
        if(role == null || role.trim().isEmpty()){
            role = "USER";
        } else if (!role.equals("USER") && !role.equals("ADMIN")) {
            throw new RuntimeException("Invalid role. Role must be USER or ADMIN");
        }

        User user = new User();

        user.setName(userCreateRequestDto.getName());
        user.setEmail(userCreateRequestDto.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(userCreateRequestDto.getPassword()));
        user.setRole(role);

        userRepository.save(user);

        return new GetUserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Override
    public GetUserResponseDto login(LoginUserRequestDto loginUserRequestDto){
        User user = userRepository.findByEmail(loginUserRequestDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!bCryptPasswordEncoder.matches(loginUserRequestDto.getPassword(), user.getPassword())){
            throw new RuntimeException("Wrong password");
        }

        return new GetUserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public List<GetUserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<GetUserResponseDto> result = new ArrayList<>();
        for (User user : users) {
            result.add(new GetUserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
            ));
        }
        return result;
    }
}
