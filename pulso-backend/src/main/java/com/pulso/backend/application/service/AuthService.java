package com.pulso.backend.application.service;

import com.pulso.backend.application.dto.AuthRequest;
import com.pulso.backend.application.dto.AuthResponse;
import com.pulso.backend.application.dto.RegisterRequest;
import com.pulso.backend.application.dto.UserDto;
import com.pulso.backend.domain.model.User;
import com.pulso.backend.domain.model.UserStatus;
import com.pulso.backend.domain.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        String username = request.name().toLowerCase().replaceAll("\\s+", "-");
        int counter = 1;
        String finalUsername = username;
        while (userRepository.existsByUsername(finalUsername)) {
            finalUsername = username + counter++;
        }

        User user = new User(
                finalUsername,
                request.name(),
                request.email(),
                passwordEncoder.encode(request.password())
        );

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, UserDto.fromEntity(user));
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.login())
                .or(() -> userRepository.findByEmail(request.login()))
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.password())
        );

        // Update status to online upon login
        user.setStatus(UserStatus.ONLINE);
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, UserDto.fromEntity(user));
    }
}
