'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

type Message = {
  id: number;
  role: 'user' | 'ai';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(scrollToBottom, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsTyping(true);
  
    const userMessage: Message = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
  
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: input }),
      });
  
      const data: Message = await response.json();
  
      setMessages((prev) => [...prev, { ...data, role: data.role as 'user' | 'ai' }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };  

  return (
    <main className={styles.main}>
      <div className={styles.chatContainer}>
        <h1 className={styles.title}>NextChat</h1>
        <div className={styles.messageArea}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.role === 'user' ? styles.userMessage : styles.aiMessage
              }`}
            >
              {message.content}
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.message} ${styles.aiMessage} ${styles.typing}`}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={onSubmit} className={styles.inputArea}>
          <input
            className={styles.input}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
          />
          <button type="submit" className={styles.sendButton} disabled={isTyping}>
            Send
          </button>
        </form>
      </div>
    </main>
  )
}
