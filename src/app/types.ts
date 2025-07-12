export interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: string;
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