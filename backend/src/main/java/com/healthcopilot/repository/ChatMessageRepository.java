package com.healthcopilot.repository;

import com.healthcopilot.entity.ChatConversation;
import com.healthcopilot.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByConversationOrderByCreatedAtAsc(ChatConversation conversation);
}
