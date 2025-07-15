package com.example.challengeapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // disable CSRF for APIs (only for testing or frontend APIs)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/users/signup", "/users/login").permitAll() // allow public access
                        .requestMatchers("/uploads/products/**").permitAll() // allow public access to images
                        .requestMatchers("/favicon.ico").permitAll() // allow public access to favicon
                        // TEMP: Allow all access to /admin/products for testing
                        .requestMatchers("/admin/products/**").permitAll()
                        .requestMatchers("/api/orders/**").permitAll() // allow public access to order API
                        .requestMatchers("/admin/**").hasRole("ADMIN") // Admin only
                        .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                        .anyRequest().authenticated() // all other requests require authentication
                );
        return http.build();
    }
}
