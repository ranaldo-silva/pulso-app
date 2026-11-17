package com.pulso.backend.domain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "call_history")
public class CallHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String callId;

    @Column(nullable = false)
    private String callerUsername;

    @Column(nullable = false)
    private String calleeUsername;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CallStatus status;

    private Integer durationSeconds = 0;

    private LocalDateTime startedAt = LocalDateTime.now();
    private LocalDateTime endedAt;

    public enum CallStatus {
        COMPLETED,
        MISSED,
        REJECTED,
        FAILED
    }

    public CallHistory() {}

    public CallHistory(String callId, String callerUsername, String calleeUsername, CallStatus status) {
        this.callId = callId;
        this.callerUsername = callerUsername;
        this.calleeUsername = calleeUsername;
        this.status = status;
        this.startedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCallId() { return callId; }
    public void setCallId(String callId) { this.callId = callId; }

    public String getCallerUsername() { return callerUsername; }
    public void setCallerUsername(String callerUsername) { this.callerUsername = callerUsername; }

    public String getCalleeUsername() { return calleeUsername; }
    public void setCalleeUsername(String calleeUsername) { this.calleeUsername = calleeUsername; }

    public CallStatus getStatus() { return status; }
    public void setStatus(CallStatus status) { this.status = status; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getEndedAt() { return endedAt; }
    public void setEndedAt(LocalDateTime endedAt) { this.endedAt = endedAt; }
}
