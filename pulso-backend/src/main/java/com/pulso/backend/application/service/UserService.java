package com.pulso.backend.application.service;

import com.pulso.backend.application.dto.UserDto;
import com.pulso.backend.domain.model.User;
import com.pulso.backend.domain.model.UserStatus;
import com.pulso.backend.domain.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromEntity)
                .toList();
    }

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + username));
        return UserDto.fromEntity(user);
    }

    public UserDto updateStatus(String username, String statusName) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + username));

        try {
            UserStatus status = UserStatus.valueOf(statusName.toUpperCase());
            user.setStatus(status);
            userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Status inválido: " + statusName);
        }

        return UserDto.fromEntity(user);
    }
}
