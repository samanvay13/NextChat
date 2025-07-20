import { supabaseAdmin } from './supabase-server';
import { Message, Conversation } from '../types/chat';

export class ChatService {
  static async createConversation(userId: string, title: string, initialContext: string = ''): Promise<Conversation> {
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .insert({
        user_id: userId,
        title,
        context: initialContext,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }

    return data;
  }

  static async getConversation(conversationId: string, userId: string): Promise<Conversation | null> {
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .select()
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get conversation: ${error.message}`);
    }

    return data;
  }

  static async updateConversationContext(conversationId: string, context: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('conversations')
      .update({ 
        context,
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to update conversation context: ${error.message}`);
    }
  }

  static async addMessage(
    conversationId: string,
    userId: string,
    content: string,
    role: 'user' | 'assistant' | 'system',
    imageUrl?: string
  ): Promise<Message> {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        content,
        role,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add message: ${error.message}`);
    }

    // Update conversation's last_message_at
    await supabaseAdmin
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  }

  static async getConversationMessages(conversationId: string, userId: string, limit: number = 50): Promise<Message[]> {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select()
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get messages: ${error.message}`);
    }

    return data || [];
  }

  static async getUserConversations(userId: string, limit: number = 20): Promise<Conversation[]> {
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .select()
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get conversations: ${error.message}`);
    }

    return data || [];
  }

  static async generateConversationTitle(firstMessage: string): Promise<string> {
    const words = firstMessage.split(' ').slice(0, 6);
    let title = words.join(' ');
    if (firstMessage.split(' ').length > 6) {
      title += '...';
    }
    return title || 'New Conversation';
  }

  static buildContextPrompt(messages: Message[], conversationContext: string): string {
    const recentMessages = messages.slice(-10);
    
    let contextPrompt = `You are an AI assistant specialized in analyzing images and providing detailed responses about their content. `;
    
    if (conversationContext) {
      contextPrompt += `\n\nConversation context: ${conversationContext}\n\n`;
    }
    
    if (recentMessages.length > 0) {
      contextPrompt += `Recent conversation history:\n`;
      recentMessages.forEach((msg, index) => {
        if (msg.role !== 'system') {
          contextPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
          if (msg.image_url) {
            contextPrompt += `[Image was shared in this message]\n`;
          }
        }
      });
    }
    
    contextPrompt += `\nPlease provide helpful, accurate, and contextually relevant responses. When analyzing images, be detailed and specific about what you observe.`;
    
    return contextPrompt;
  }
}