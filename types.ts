
export enum Role {
  USER = 'user',
  BOT = 'bot'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  responseTime?: number; // Time in seconds
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
