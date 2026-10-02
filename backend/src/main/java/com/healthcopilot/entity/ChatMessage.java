package com.healthcopilot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private ChatConversation conversation;

    @Column(nullable = false, length = 20)
    private String sender; // USER or AI

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String citations;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ChatMessage() {}

    public ChatMessage(Long id, ChatConversation conversation, String sender, String content, String citations, LocalDateTime createdAt) {
        this.id = id;
        this.conversation = conversation;
        this.sender = sender;
        this.content = content;
        this.citations = citations;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ChatConversation getConversation() { return conversation; }
    public void setConversation(ChatConversation conversation) { this.conversation = conversation; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCitations() { return citations; }
    public void setCitations(String citations) { this.citations = citations; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ChatMessageBuilder builder() { return new ChatMessageBuilder(); }

    public static class ChatMessageBuilder {
        private Long id;
        private ChatConversation conversation;
        private String sender;
        private String content;
        private String citations;
        private LocalDateTime createdAt;

        public ChatMessageBuilder id(Long id) { this.id = id; return this; }
        public ChatMessageBuilder conversation(ChatConversation conversation) { this.conversation = conversation; return this; }
        public ChatMessageBuilder sender(String sender) { this.sender = sender; return this; }
        public ChatMessageBuilder content(String content) { this.content = content; return this; }
        public ChatMessageBuilder citations(String citations) { this.citations = citations; return this; }
        public ChatMessageBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ChatMessage build() {
            return new ChatMessage(id, conversation, sender, content, citations, createdAt);
        }
    }
}
