package com.healthcopilot.controller;

import com.healthcopilot.dto.ChatConversationDTO;
import com.healthcopilot.dto.ChatMessageDTO;
import com.healthcopilot.dto.ChatRequest;
import com.healthcopilot.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ChatConversationDTO>> getConversations(Authentication authentication) {
        return ResponseEntity.ok(chatService.getPatientConversations(authentication.getName()));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ChatConversationDTO> getConversationById(Authentication authentication, @PathVariable("id") Long id) {
        return ResponseEntity.ok(chatService.getConversationById(authentication.getName(), id));
    }

    @PostMapping("/message")
    public ResponseEntity<ChatMessageDTO> sendMessage(Authentication authentication, @Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(authentication.getName(), request));
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<Void> deleteConversation(Authentication authentication, @PathVariable("id") Long id) {
        chatService.deleteConversation(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
