package com.pulso.backend.application.service;

import com.pulso.backend.application.dto.ChannelDto;
import com.pulso.backend.application.dto.CreateChannelRequest;
import com.pulso.backend.domain.model.Channel;
import com.pulso.backend.domain.repository.ChannelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;

    public ChannelService(ChannelRepository channelRepository) {
        this.channelRepository = channelRepository;
    }

    public List<ChannelDto> getAllChannels() {
        return channelRepository.findAll()
                .stream()
                .map(ChannelDto::fromEntity)
                .toList();
    }

    public ChannelDto getChannelByKey(String key) {
        Channel channel = channelRepository.findByChannelKey(key)
                .orElseThrow(() -> new IllegalArgumentException("Canal não encontrado: " + key));
        return ChannelDto.fromEntity(channel);
    }

    public ChannelDto createChannel(CreateChannelRequest request, String createdBy) {
        String key = request.name().toLowerCase().replaceAll("\\s+", "-");
        int counter = 1;
        String finalKey = key;
        while (channelRepository.existsByChannelKey(finalKey)) {
            finalKey = key + "-" + counter++;
        }

        Channel channel = new Channel(finalKey, request.name(), request.description(), createdBy);
        if (request.icon() != null && !request.icon().isBlank()) {
            channel.setIcon(request.icon());
        }

        channelRepository.save(channel);
        return ChannelDto.fromEntity(channel);
    }

    public ChannelDto joinChannel(String key, String username) {
        Channel channel = channelRepository.findByChannelKey(key)
                .orElseThrow(() -> new IllegalArgumentException("Canal não encontrado: " + key));

        channel.getMembers().add(username);
        channelRepository.save(channel);
        return ChannelDto.fromEntity(channel);
    }

    public ChannelDto leaveChannel(String key, String username) {
        Channel channel = channelRepository.findByChannelKey(key)
                .orElseThrow(() -> new IllegalArgumentException("Canal não encontrado: " + key));

        channel.getMembers().remove(username);
        channelRepository.save(channel);
        return ChannelDto.fromEntity(channel);
    }
}
