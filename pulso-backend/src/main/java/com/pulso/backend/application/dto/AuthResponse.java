package com.pulso.backend.application.dto;

public record AuthResponse(
    String token,
    UserDto user
) {}
