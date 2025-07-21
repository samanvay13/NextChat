import { useState, useCallback } from 'react';
import { Message, Conversation, ChatRequest, ChatResponse } from '../types/chat';

export const useChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (request: ChatRequest): Promise<ChatResponse> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('message', request.message);
      
      if (request.conversationId) {
        formData.append('conversationId', request.conversationId);
      }
      
      if (request.imageFile) {
        formData.append('image', request.imageFile);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.status === 401) {
        throw new Error('Please log in again');
      }

      const result: ChatResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to send message');
      }

      return result;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send message';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getConversations = useCallback(async (): Promise<Conversation[]> => {
    try {
      const response = await fetch('/api/conversations', {
        credentials: 'include',
      });
      
      if (response.status === 401) {
        throw new Error('Please log in again');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to get conversations');
      }

      return result.conversations;

    } catch (err: any) {
      setError(err.message || 'Failed to get conversations');
      return [];
    }
  }, []);

  const getMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        credentials: 'include',
      });
      
      if (response.status === 401) {
        throw new Error('Please log in again');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to get messages');
      }

      return result.messages;

    } catch (err: any) {
      setError(err.message || 'Failed to get messages');
      return [];
    }
  }, []);

  return {
    sendMessage,
    getConversations,
    getMessages,
    loading,
    error,
  };
};