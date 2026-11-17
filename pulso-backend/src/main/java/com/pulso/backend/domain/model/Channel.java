package com.pulso.backend.domain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "channels")
public class Channel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String channelKey;

    @Column(nullable = false)
    private String name;

    private String description;

    private String icon = "radio-outline";

    private String createdBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "channel_members", joinColumns = @JoinColumn(name = "channel_id"))
    @Column(name = "username")
    private Set<String> members = new HashSet<>();

    public Channel() {}

    public Channel(String channelKey, String name, String description, String createdBy) {
        this.channelKey = channelKey;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        if (createdBy != null) {
            this.members.add(createdBy);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getChannelKey() { return channelKey; }
    public void setChannelKey(String channelKey) { this.channelKey = channelKey; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Set<String> getMembers() { return members; }
    public void setMembers(Set<String> members) { this.members = members; }
}
