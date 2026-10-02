package com.healthcopilot.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatRequest {

    @NotBlank(message = "Message content is required")
    private String message;

    private Long conversationId;
    private String language;

    public ChatRequest() {}

    public ChatRequest(String message, Long conversationId) {
        this.message = message;
        this.conversationId = conversationId;
    }

    public ChatRequest(String message, Long conversationId, String language) {
        this.message = message;
        this.conversationId = conversationId;
        this.language = language;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
