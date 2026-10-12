package com.example.backend.config;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Public signup can no longer create administrators, so a fresh database needs
 * another way to get its first one. Set ADMIN_EMAIL and ADMIN_PASSWORD and the
 * account is created at startup if that email is not already registered.
 * Further admins are added by an existing admin through POST /users/admins.
 */
@Component
@Slf4j
public class AdminBootstrap implements ApplicationRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final String email;
    private final String password;

    public AdminBootstrap(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
                          @Value("${app.admin.email:}") String email,
                          @Value("${app.admin.password:}") String password) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.email = email.trim().toLowerCase(Locale.ROOT);
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (email.isEmpty() || password.isEmpty()) return;
        if (userRepository.existsByEmail(email)) return;

        if (password.length() < 12) {
            log.error("ADMIN_PASSWORD must be at least 12 characters; no administrator was created.");
            return;
        }

        User admin = new User();
        admin.setName("Administrator");
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole("ADMIN");
        userRepository.save(admin);
        log.info("Created the initial administrator account for {}.", email);
    }
}
