export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  context: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  imageFile?: File;
  imageUrl?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: Message;
  conversation?: Conversation;
  error?: string;
}