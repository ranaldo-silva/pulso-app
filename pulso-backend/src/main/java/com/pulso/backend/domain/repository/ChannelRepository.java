package com.pulso.backend.domain.repository;

import com.pulso.backend.domain.model.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {
    Optional<Channel> findByChannelKey(String channelKey);
    boolean existsByChannelKey(String channelKey);
}
