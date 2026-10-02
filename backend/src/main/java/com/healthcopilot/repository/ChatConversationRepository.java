package com.healthcopilot.repository;

import com.healthcopilot.entity.ChatConversation;
import com.healthcopilot.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {
    List<ChatConversation> findByPatientOrderByUpdatedAtDesc(Patient patient);
}
