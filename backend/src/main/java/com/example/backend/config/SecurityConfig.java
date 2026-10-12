package com.example.backend.config;

import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtAuthFilter;
import com.example.backend.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.List;

@Configuration
public class SecurityConfig {

    private static final String ADMIN = "ADMIN";

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtService jwtService, UserRepository userRepository)
            throws Exception {
        http
                // Safe to disable: authentication is a bearer token in a header,
                // which a browser never attaches on its own, so there is no
                // ambient credential for a cross-site request to ride on.
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((req, res, ex) ->
                                writeError(res, HttpServletResponse.SC_UNAUTHORIZED, "Please sign in to continue."))
                        .accessDeniedHandler((req, res, ex) ->
                                writeError(res, HttpServletResponse.SC_FORBIDDEN, "You do not have access to this.")))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(HttpMethod.GET, "/").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users/signup", "/users/login").permitAll()

                        // The storefront reads the catalogue from /admin/products,
                        // so reads are public and only writes need an admin.
                        .requestMatchers(HttpMethod.GET, "/admin/products/**", "/uploads/**").permitAll()
                        .requestMatchers("/admin/**").hasRole(ADMIN)

                        .requestMatchers(HttpMethod.GET, "/users").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.POST, "/users/admins").hasRole(ADMIN)

                        // Delivery and cash limits are shown to every visitor, and
                        // pricing a bag reveals nothing but catalogue prices.
                        .requestMatchers(HttpMethod.GET, "/api/settings").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/orders/quote").permitAll()
                        .requestMatchers("/api/settings").hasRole(ADMIN)

                        .requestMatchers(HttpMethod.GET, "/api/orders").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/orders/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/orders/*/status").hasRole(ADMIN)

                        .requestMatchers(HttpMethod.GET, "/api/payments").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/payments/**").hasRole(ADMIN)

                        // Everything else needs a signed-in user; controllers then
                        // check that the record being touched belongs to them.
                        .anyRequest().authenticated())
                .addFilterBefore(new JwtAuthFilter(jwtService, userRepository),
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins}") List<String> allowedOrigins) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    private static void writeError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
