import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChat } from '../../hooks/useChat';
import { Message, Conversation } from '@/app/types';
import { ThemeClasses } from '@/app/types';

interface ChatWindowProps {
  conversation: Conversation | null;
  onNewConversation?: (conversation: Conversation) => void;
  themeClasses: ThemeClasses;
  isDarkMode: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onNewConversation,
  themeClasses,
  isDarkMode
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { sendMessage, getMessages, loading, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversation) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [conversation]);

  const loadMessages = async () => {
    if (!conversation) return;
    
    try {
      const conversationMessages = await getMessages(conversation.id);
      setMessages(conversationMessages);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async (messageContent: string, imageFile?: File) => {
    if (!messageContent.trim() && !imageFile) return;

    try {
      console.log('Sending message:', { messageContent, hasImage: !!imageFile });

      const result = await sendMessage({
        message: messageContent,
        conversationId: conversation?.id,
        imageFile
      });

      console.log('Send result:', result);

      if (result.success) {
        if (result.messages && Array.isArray(result.messages)) {
          const validMessages: Message[] = result.messages.filter((msg): msg is Message => 
            msg !== undefined && msg !== null && typeof msg === 'object' && 'id' in msg
          );
          if (validMessages.length > 0) {
            setMessages(prev => [...prev, ...validMessages]);
          }
        } else if (result.message && typeof result.message === 'object' && 'id' in result.message) {
          setMessages(prev => [...prev, result.message as Message]);
        }

        if (!conversation && result.conversation && onNewConversation) {
          onNewConversation(result.conversation);
        }
      } else {
        console.error('Send message failed:', result.error);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
          <div className="max-w-2xl text-center">
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              AI Assistant
            </h1>
            <p className={`text-lg ${themeClasses.textSecondary} mb-8`}>
              I can help you with questions, creative projects, analysis, and more. 
              You can also upload images for detailed analysis!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                "Explain quantum physics simply",
                "Help me write a story", 
                "Analyze this image",
                "Answer my questions"
              ].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={loading}
                  className={`p-4 ${themeClasses.cardBg} rounded-lg border ${themeClasses.border} ${themeClasses.cardHover} transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50`}
                >
                  <span className={`${themeClasses.textSecondary} text-sm`}>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <ChatInput
            onSendMessage={handleSendMessage}
            themeClasses={themeClasses}
            isDarkMode={isDarkMode}
            disabled={loading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full max-h-screen">
      <div className={`flex-shrink-0 p-[23px] border-b ${themeClasses.border} ${themeClasses.cardBg}`}>
        <h2 className={`text-lg text-center font-semibold ${themeClasses.text} truncate`}>
          {conversation.title}
        </h2>
        <p className={`text-sm text-center ${themeClasses.textMuted}`}>
          {messages.length} messages • Started {new Date(conversation.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className={`${themeClasses.textMuted}`}>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="pb-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                themeClasses={themeClasses}
                isDarkMode={isDarkMode}
              />
            ))}
            {loading && (
              <div className="flex gap-3 p-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-cyan-500' : 'bg-blue-500'}`}>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
                <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-4`}>
                  <p className={`${themeClasses.textMuted} text-sm`}>AI is thinking...</p>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="flex-shrink-0 p-4 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex-shrink-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          themeClasses={themeClasses}
          isDarkMode={isDarkMode}
          disabled={loading}
        />
      </div>
    </div>
  );
};