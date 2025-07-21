package com.example.challengeapp.service.impl;

import com.example.challengeapp.controller.dtos.request.LoginUserRequestDto;
import com.example.challengeapp.controller.dtos.request.UserCreateRequestDto;
import com.example.challengeapp.controller.dtos.response.GetUserResponseDto;
import com.example.challengeapp.controller.dtos.response.LoginResponseDto;
import com.example.challengeapp.exception.UserAlreadyExistsException;
import com.example.challengeapp.model.User;
import com.example.challengeapp.repository.UserRepository;
import com.example.challengeapp.security.JwtUtils;
import com.example.challengeapp.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private AuthenticationManager authenticationManager;
    private JwtUtils jwtUtils;

    @Override
    @Transactional
    public GetUserResponseDto createUser(UserCreateRequestDto userCreateRequestDto) {
        // Check if user already exists
        if (userRepository.findByEmail(userCreateRequestDto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User with email " + userCreateRequestDto.getEmail() + " already exists");
        }

        String role = userCreateRequestDto.getRole();
        if (role == null || role.trim().isEmpty()) {
            role = "USER";
        } else if (!role.equals("USER") && !role.equals("ADMIN")) {
            throw new IllegalArgumentException("Invalid role. Role must be USER or ADMIN");
        }

        User user = new User();
        user.setName(userCreateRequestDto.getName());
        user.setEmail(userCreateRequestDto.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(userCreateRequestDto.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        return mapToResponseDto(savedUser);
    }

    @Override
    @Transactional
    public LoginResponseDto login(LoginUserRequestDto loginUserRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginUserRequestDto.getEmail(), 
                loginUserRequestDto.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginUserRequestDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        GetUserResponseDto userResponse = mapToResponseDto(user);
        
        return new LoginResponseDto(jwt, userResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GetUserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<GetUserResponseDto> result = new ArrayList<>();
        for (User user : users) {
            result.add(mapToResponseDto(user));
        }
        return result;
    }

    private GetUserResponseDto mapToResponseDto(User user) {
        return new GetUserResponseDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getPhone(),
            user.getAddress(),
            user.getCity(),
            user.getPostalCode()
        );
    }
}
