package com.example.backend.controller.dtos.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreSettingsDto {
    @NotNull(message = "Enter a delivery fee.")
    @DecimalMin(value = "0", message = "The delivery fee cannot be negative.")
    @Digits(integer = 8, fraction = 2, message = "The delivery fee is too large or has too many decimals.")
    private BigDecimal shippingFee;

    @NotNull(message = "Enter a free delivery threshold.")
    @DecimalMin(value = "0", message = "The free delivery threshold cannot be negative.")
    @Digits(integer = 8, fraction = 2, message = "The free delivery threshold is too large or has too many decimals.")
    private BigDecimal freeShippingThreshold;

    @NotNull(message = "Enter a cash on delivery limit.")
    @DecimalMin(value = "0", message = "The cash on delivery limit cannot be negative.")
    @Digits(integer = 8, fraction = 2, message = "The cash on delivery limit is too large or has too many decimals.")
    private BigDecimal codLimit;
}
