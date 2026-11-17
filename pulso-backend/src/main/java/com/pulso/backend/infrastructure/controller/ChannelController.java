package com.pulso.backend.infrastructure.controller;

import com.pulso.backend.application.dto.ChannelDto;
import com.pulso.backend.application.dto.CreateChannelRequest;
import com.pulso.backend.application.service.ChannelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/channels")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @GetMapping
    public ResponseEntity<List<ChannelDto>> getAllChannels() {
        return ResponseEntity.ok(channelService.getAllChannels());
    }

    @GetMapping("/{key}")
    public ResponseEntity<?> getChannelByKey(@PathVariable String key) {
        try {
            return ResponseEntity.ok(channelService.getChannelByKey(key));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createChannel(
            @Valid @RequestBody CreateChannelRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ChannelDto channel = channelService.createChannel(request, userDetails.getUsername());
        return ResponseEntity.ok(channel);
    }

    @PostMapping("/{key}/join")
    public ResponseEntity<?> joinChannel(
            @PathVariable String key,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            return ResponseEntity.ok(channelService.joinChannel(key, userDetails.getUsername()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{key}/leave")
    public ResponseEntity<?> leaveChannel(
            @PathVariable String key,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            return ResponseEntity.ok(channelService.leaveChannel(key, userDetails.getUsername()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
