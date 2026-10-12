package com.example.backend.security;

/** The authenticated caller, resolved from a verified token on each request. */
public record AuthUser(Long id, String email, String role) {

    public boolean isAdmin() {
        return "ADMIN".equals(role);
    }
}
