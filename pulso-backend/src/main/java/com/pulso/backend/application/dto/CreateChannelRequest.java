package com.pulso.backend.application.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateChannelRequest(
    @NotBlank(message = "Nome do canal é obrigatório")
    String name,
    String description,
    String icon
) {}
