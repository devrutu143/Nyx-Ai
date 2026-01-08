
export type AppView = 'splash' | 'auth' | 'chat' | 'about';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface User {
  email: string;
  name?: string;
  photoURL?: string;
}
