package com.healthcopilot.dto;

import java.time.LocalDateTime;

public class ChatMessageDTO {
    private Long id;
    private String sender;
    private String content;
    private String citations;
    private LocalDateTime createdAt;

    public ChatMessageDTO() {}

    public ChatMessageDTO(Long id, String sender, String content, String citations, LocalDateTime createdAt) {
        this.id = id;
        this.sender = sender;
        this.content = content;
        this.citations = citations;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCitations() { return citations; }
    public void setCitations(String citations) { this.citations = citations; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ChatMessageDTOBuilder builder() { return new ChatMessageDTOBuilder(); }

    public static class ChatMessageDTOBuilder {
        private Long id;
        private String sender;
        private String content;
        private String citations;
        private LocalDateTime createdAt;

        public ChatMessageDTOBuilder id(Long id) { this.id = id; return this; }
        public ChatMessageDTOBuilder sender(String sender) { this.sender = sender; return this; }
        public ChatMessageDTOBuilder content(String content) { this.content = content; return this; }
        public ChatMessageDTOBuilder citations(String citations) { this.citations = citations; return this; }
        public ChatMessageDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ChatMessageDTO build() {
            return new ChatMessageDTO(id, sender, content, citations, createdAt);
        }
    }
}
