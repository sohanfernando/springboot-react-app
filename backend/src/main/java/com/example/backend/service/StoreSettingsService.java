package com.example.backend.service;

import com.example.backend.controller.dtos.request.StoreSettingsDto;
import com.example.backend.model.StoreSettings;
import com.example.backend.repository.StoreSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class StoreSettingsService {

    private final StoreSettingsRepository repository;

    /** The saved settings, or the starting values until an administrator saves some. */
    public StoreSettings get() {
        return repository.findById(StoreSettings.SINGLETON_ID).orElseGet(() ->
                new StoreSettings(new BigDecimal("500"), new BigDecimal("5000"), new BigDecimal("3000")));
    }

    public StoreSettings update(StoreSettingsDto request) {
        StoreSettings settings = new StoreSettings(
                request.getShippingFee(), request.getFreeShippingThreshold(), request.getCodLimit());
        return repository.save(settings);
    }

    public static StoreSettingsDto toDto(StoreSettings settings) {
        return new StoreSettingsDto(
                settings.getShippingFee(), settings.getFreeShippingThreshold(), settings.getCodLimit());
    }
}
