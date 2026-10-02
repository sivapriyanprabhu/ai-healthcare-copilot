import api from './api';
import { ChatConversation, ChatMessage } from '../types';

export const chatService = {
  getConversations: async (): Promise<ChatConversation[]> => {
    const response = await api.get<ChatConversation[]>('/chat/conversations');
    return response.data;
  },

  getConversationById: async (id: number): Promise<ChatConversation> => {
    const response = await api.get<ChatConversation>(`/chat/conversations/${id}`);
    return response.data;
  },

  sendMessage: async (message: string, conversationId?: number, language?: string): Promise<ChatMessage> => {
    const response = await api.post<ChatMessage>('/chat/message', { message, conversationId, language });
    return response.data;
  },

  deleteConversation: async (id: number): Promise<void> => {
    await api.delete(`/chat/conversations/${id}`);
  }
};
