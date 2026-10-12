package com.example.backend.controller.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/** Profile fields a user may change. Role and password are intentionally absent. */
@Data
public class UserUpdateRequestDto {
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters.")
    private String name;

    @Email(message = "Please enter a valid email address.")
    @Size(min = 1, max = 254, message = "Email is too long.")
    private String email;

    @Size(max = 30, message = "Phone number is too long.")
    private String phone;

    @Size(max = 255, message = "Address is too long.")
    private String address;

    @Size(max = 100, message = "City is too long.")
    private String city;

    @Size(max = 20, message = "Postal code is too long.")
    private String postalCode;
}
