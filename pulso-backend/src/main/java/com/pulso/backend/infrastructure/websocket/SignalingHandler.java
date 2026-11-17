package com.pulso.backend.infrastructure.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class SignalingHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(SignalingHandler.class);

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map: username -> WebSocketSession
    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    // Reverse Map: sessionId -> username
    private final Map<String, String> sessionUsers = new ConcurrentHashMap<>();

    // Channel subscriptions: channelId -> Set of usernames
    private final Map<String, Set<String>> channelSubscriptions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("Nova conexão WebSocket estabelecida: id={}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            SignalingMessage sigMsg = objectMapper.readValue(message.getPayload(), SignalingMessage.class);
            String type = sigMsg.getType();

            if (type == null) {
                log.warn("Mensagem sem tipo recebida da sessão {}", session.getId());
                return;
            }

            log.debug("Mensagem recebida: tipo={}, from={}, to={}", type, sigMsg.getFrom(), sigMsg.getTo());

            switch (type) {
                case "register" -> handleRegister(session, sigMsg);
                case "join-channel" -> handleJoinChannel(session, sigMsg);
                case "leave-channel" -> handleLeaveChannel(session, sigMsg);
                case "call-offer", "call-answer", "ice-candidate", "call-reject", "call-end" -> handlePeerSignaling(sigMsg);
                case "ptt-start", "ptt-stop" -> handlePttBroadcast(sigMsg);
                default -> log.warn("Tipo de mensagem não reconhecido: {}", type);
            }

        } catch (Exception e) {
            log.error("Erro ao processar mensagem WebSocket da sessão {}: {}", session.getId(), e.getMessage());
        }
    }

    private void handleRegister(WebSocketSession session, SignalingMessage message) {
        String username = message.getFrom();
        if (username != null && !username.isBlank()) {
            userSessions.put(username, session);
            sessionUsers.put(session.getId(), username);
            log.info("Usuário '{}' registrado no WebSocket (sessão={})", username, session.getId());

            // Send registration confirmation back
            SignalingMessage ack = new SignalingMessage("registered", "server", username);
            sendToSession(session, ack);
        }
    }

    private void handleJoinChannel(WebSocketSession session, SignalingMessage message) {
        String channelId = message.getChannelId();
        String username = message.getFrom();

        if (channelId != null && username != null) {
            channelSubscriptions.computeIfAbsent(channelId, k -> new CopyOnWriteArraySet<>()).add(username);
            log.info("Usuário '{}' ingressou no canal '{}'", username, channelId);

            // Notify other channel members
            broadcastToChannel(channelId, username, message);
        }
    }

    private void handleLeaveChannel(WebSocketSession session, SignalingMessage message) {
        String channelId = message.getChannelId();
        String username = message.getFrom();

        if (channelId != null && username != null) {
            Set<String> members = channelSubscriptions.get(channelId);
            if (members != null) {
                members.remove(username);
                broadcastToChannel(channelId, username, message);
                log.info("Usuário '{}' saiu do canal '{}'", username, channelId);
            }
        }
    }

    private void handlePeerSignaling(SignalingMessage message) {
        String targetUser = message.getTo();
        if (targetUser == null) {
            log.warn("Destinatário ausente na mensagem peer: {}", message.getType());
            return;
        }

        WebSocketSession targetSession = userSessions.get(targetUser);
        if (targetSession != null && targetSession.isOpen()) {
            sendToSession(targetSession, message);
            log.debug("Mensagem '{}' encaminhada de '{}' para '{}'", message.getType(), message.getFrom(), targetUser);
        } else {
            log.warn("Usuário destino '{}' não está conectado", targetUser);
            // Optionally reply caller with user-offline
            WebSocketSession callerSession = userSessions.get(message.getFrom());
            if (callerSession != null && callerSession.isOpen() && "call-offer".equals(message.getType())) {
                SignalingMessage reject = new SignalingMessage("call-reject", "server", message.getFrom());
                reject.setCallId(message.getCallId());
                sendToSession(callerSession, reject);
            }
        }
    }

    private void handlePttBroadcast(SignalingMessage message) {
        String channelId = message.getChannelId();
        if (channelId != null) {
            // Channel broadcast
            broadcastToChannel(channelId, message.getFrom(), message);
        } else if (message.getTo() != null) {
            // Direct 1-on-1 PTT
            WebSocketSession targetSession = userSessions.get(message.getTo());
            if (targetSession != null && targetSession.isOpen()) {
                sendToSession(targetSession, message);
            }
        }
    }

    private void broadcastToChannel(String channelId, String senderUsername, SignalingMessage message) {
        Set<String> members = channelSubscriptions.get(channelId);
        if (members == null || members.isEmpty()) return;

        for (String member : members) {
            if (!member.equals(senderUsername)) {
                WebSocketSession session = userSessions.get(member);
                if (session != null && session.isOpen()) {
                    sendToSession(session, message);
                }
            }
        }
    }

    private void sendToSession(WebSocketSession session, SignalingMessage message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            synchronized (session) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(json));
                }
            }
        } catch (IOException e) {
            log.error("Erro ao enviar mensagem para sessão {}: {}", session.getId(), e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String username = sessionUsers.remove(session.getId());
        if (username != null) {
            userSessions.remove(username);
            // Remove from channels
            channelSubscriptions.values().forEach(members -> members.remove(username));
            log.info("Sessão WebSocket encerrada para o usuário '{}': {}", username, status);
        }
    }
}
