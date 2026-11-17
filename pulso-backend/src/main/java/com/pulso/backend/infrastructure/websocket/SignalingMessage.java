package com.pulso.backend.infrastructure.websocket;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SignalingMessage {

    private String type;
    private String callId;
    private String channelId;
    private String from;
    private String to;
    private Object offer;
    private Object answer;
    private Object candidate;
    private Map<String, Object> payload;

    public SignalingMessage() {}

    public SignalingMessage(String type, String from, String to) {
        this.type = type;
        this.from = from;
        this.to = to;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCallId() { return callId; }
    public void setCallId(String callId) { this.callId = callId; }

    public String getChannelId() { return channelId; }
    public void setChannelId(String channelId) { this.channelId = channelId; }

    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public Object getOffer() { return offer; }
    public void setOffer(Object offer) { this.offer = offer; }

    public Object getAnswer() { return answer; }
    public void setAnswer(Object answer) { this.answer = answer; }

    public Object getCandidate() { return candidate; }
    public void setCandidate(Object candidate) { this.candidate = candidate; }

    public Map<String, Object> getPayload() { return payload; }
    public void setPayload(Map<String, Object> payload) { this.payload = payload; }
}
