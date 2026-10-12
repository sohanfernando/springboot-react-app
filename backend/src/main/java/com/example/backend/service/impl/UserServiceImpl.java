package com.example.backend.service.impl;

import com.example.backend.controller.dtos.request.LoginUserRequestDto;
import com.example.backend.controller.dtos.request.UserCreateRequestDto;
import com.example.backend.controller.dtos.request.UserUpdateRequestDto;
import com.example.backend.controller.dtos.response.AuthResponseDto;
import com.example.backend.controller.dtos.response.GetUserResponseDto;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import com.example.backend.security.LoginAttemptService;
import com.example.backend.service.UserService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class UserServiceImpl implements UserService {
    private static final String ROLE_USER = "USER";
    private static final String ROLE_ADMIN = "ADMIN";

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtService jwtService;
    private final LoginAttemptService loginAttemptService;
    // Compared against when the email is unknown, so a miss costs the same
    // time as a wrong password and response timing does not reveal which
    // emails are registered.
    private final String decoyHash;

    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder,
                           JwtService jwtService, LoginAttemptService loginAttemptService) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtService = jwtService;
        this.loginAttemptService = loginAttemptService;
        this.decoyHash = bCryptPasswordEncoder.encode("decoy-password-never-matches");
    }

    @Override
    public AuthResponseDto createUser(UserCreateRequestDto request) {
        return toAuthResponse(register(request, ROLE_USER));
    }

    @Override
    public GetUserResponseDto createAdmin(UserCreateRequestDto request) {
        return toResponse(register(request, ROLE_ADMIN));
    }

    @Override
    public AuthResponseDto login(LoginUserRequestDto request, String clientAddress) {
        String email = normalise(request.getEmail());

        if (loginAttemptService.isBlocked(email, clientAddress)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Too many sign-in attempts. Please wait 15 minutes and try again.");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        String hash = user != null ? user.getPassword() : decoyHash;
        boolean matches = bCryptPasswordEncoder.matches(request.getPassword(), hash);

        if (user == null || !matches) {
            loginAttemptService.recordFailure(email, clientAddress);
            // One message for both cases, so it cannot be used to test which emails exist.
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        loginAttemptService.recordSuccess(email);
        return toAuthResponse(user);
    }

    @Override
    public GetUserResponseDto updateProfile(Long id, UserUpdateRequestDto update) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        if (update.getName() != null) user.setName(update.getName().trim());
        if (update.getEmail() != null) {
            String email = normalise(update.getEmail());
            if (!email.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(email)) {
                throw emailTaken();
            }
            user.setEmail(email);
        }
        if (update.getPhone() != null) user.setPhone(update.getPhone());
        if (update.getAddress() != null) user.setAddress(update.getAddress());
        if (update.getCity() != null) user.setCity(update.getCity());
        if (update.getPostalCode() != null) user.setPostalCode(update.getPostalCode());

        return toResponse(save(user));
    }

    @Override
    public List<GetUserResponseDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    private User register(UserCreateRequestDto request, String role) {
        String email = normalise(request.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw emailTaken();
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        user.setRole(role);
        return save(user);
    }

    /** The unique index is the real guard; this covers two signups racing past the check. */
    private User save(User user) {
        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw emailTaken();
        }
    }

    private static ResponseStatusException emailTaken() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "An account with that email already exists.");
    }

    private static String normalise(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private GetUserResponseDto toResponse(User user) {
        return new GetUserResponseDto(user.getId(), user.getName(), user.getEmail(), user.getRole(),
                user.getPhone(), user.getAddress(), user.getCity(), user.getPostalCode());
    }

    private AuthResponseDto toAuthResponse(User user) {
        return new AuthResponseDto(user.getId(), user.getName(), user.getEmail(), user.getRole(),
                user.getPhone(), user.getAddress(), user.getCity(), user.getPostalCode(),
                jwtService.issue(user.getId()));
    }
}
