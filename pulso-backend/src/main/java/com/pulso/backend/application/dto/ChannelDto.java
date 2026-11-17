package com.pulso.backend.application.dto;

import com.pulso.backend.domain.model.Channel;
import java.util.Set;

public record ChannelDto(
    String id,
    String name,
    String description,
    String icon,
    Set<String> members,
    String createdBy
) {
    public static ChannelDto fromEntity(Channel channel) {
        return new ChannelDto(
            channel.getChannelKey(),
            channel.getName(),
            channel.getDescription(),
            channel.getIcon(),
            channel.getMembers(),
            channel.getCreatedBy()
        );
    }
}
