package com.pulso.backend.application.dto;

import com.pulso.backend.domain.model.User;
import com.pulso.backend.domain.model.UserStatus;

public record UserDto(
    String id,
    String name,
    String email,
    String status
) {
    public static UserDto fromEntity(User user) {
        return new UserDto(
            user.getUsername(),
            user.getName(),
            user.getEmail(),
            user.getStatus().name().toLowerCase()
        );
    }
}
