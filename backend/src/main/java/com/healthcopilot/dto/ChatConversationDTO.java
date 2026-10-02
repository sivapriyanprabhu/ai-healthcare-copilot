package com.healthcopilot.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ChatConversationDTO {
    private Long id;
    private Long patientId;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ChatMessageDTO> messages;

    public ChatConversationDTO() {}

    public ChatConversationDTO(Long id, Long patientId, String title, LocalDateTime createdAt, LocalDateTime updatedAt, List<ChatMessageDTO> messages) {
        this.id = id;
        this.patientId = patientId;
        this.title = title;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.messages = messages;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ChatMessageDTO> getMessages() { return messages; }
    public void setMessages(List<ChatMessageDTO> messages) { this.messages = messages; }

    public static ChatConversationDTOBuilder builder() { return new ChatConversationDTOBuilder(); }

    public static class ChatConversationDTOBuilder {
        private Long id;
        private Long patientId;
        private String title;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<ChatMessageDTO> messages;

        public ChatConversationDTOBuilder id(Long id) { this.id = id; return this; }
        public ChatConversationDTOBuilder patientId(Long patientId) { this.patientId = patientId; return this; }
        public ChatConversationDTOBuilder title(String title) { this.title = title; return this; }
        public ChatConversationDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ChatConversationDTOBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public ChatConversationDTOBuilder messages(List<ChatMessageDTO> messages) { this.messages = messages; return this; }

        public ChatConversationDTO build() {
            return new ChatConversationDTO(id, patientId, title, createdAt, updatedAt, messages);
        }
    }
}
