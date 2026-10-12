package com.example.backend.controller;

import com.example.backend.controller.dtos.request.StoreSettingsDto;
import com.example.backend.service.StoreSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class StoreSettingsController {

    private final StoreSettingsService settingsService;

    /** Public: the storefront shows these figures to every visitor. */
    @GetMapping
    public ResponseEntity<StoreSettingsDto> get() {
        return ResponseEntity.ok(StoreSettingsService.toDto(settingsService.get()));
    }

    /** Admin only (enforced in SecurityConfig). */
    @PutMapping
    public ResponseEntity<StoreSettingsDto> update(@Valid @RequestBody StoreSettingsDto request) {
        return ResponseEntity.ok(StoreSettingsService.toDto(settingsService.update(request)));
    }
}
