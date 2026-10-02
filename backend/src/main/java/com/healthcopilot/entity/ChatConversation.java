package com.healthcopilot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_conversations")
public class ChatConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages = new ArrayList<>();

    public ChatConversation() {}

    public ChatConversation(Long id, Patient patient, String title, LocalDateTime createdAt, LocalDateTime updatedAt, List<ChatMessage> messages) {
        this.id = id;
        this.patient = patient;
        this.title = title;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
        if (messages != null) this.messages = messages;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ChatMessage> getMessages() { return messages; }
    public void setMessages(List<ChatMessage> messages) { this.messages = messages; }

    public static ChatConversationBuilder builder() { return new ChatConversationBuilder(); }

    public static class ChatConversationBuilder {
        private Long id;
        private Patient patient;
        private String title;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<ChatMessage> messages = new ArrayList<>();

        public ChatConversationBuilder id(Long id) { this.id = id; return this; }
        public ChatConversationBuilder patient(Patient patient) { this.patient = patient; return this; }
        public ChatConversationBuilder title(String title) { this.title = title; return this; }
        public ChatConversationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ChatConversationBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public ChatConversationBuilder messages(List<ChatMessage> messages) { this.messages = messages; return this; }

        public ChatConversation build() {
            return new ChatConversation(id, patient, title, createdAt, updatedAt, messages);
        }
    }
}
