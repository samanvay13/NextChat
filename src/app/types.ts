export interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

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

export interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalVx: number;
  originalVy: number;
  id: number;
}

export interface ThemeClasses {
  bg: string;
  sidebarBg: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  button: string;
  buttonText: string;
  inputBg: string;
  hover: string;
  cardBg: string;
  cardHover: string;
  neonAccent: string;
  toggleBg: string;
  profileBg: string;
}
