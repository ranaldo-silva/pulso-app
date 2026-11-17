package com.pulso.backend.application.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
    @NotBlank(message = "Username ou email é obrigatório")
    String login,

    @NotBlank(message = "Senha é obrigatória")
    String password
) {}
