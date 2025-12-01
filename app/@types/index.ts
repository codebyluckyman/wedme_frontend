export interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
  favicon?: string;
  domain?: string;
}

export interface Question {
  id: number;
  text: string;
  // icon: React.ReactNode;
}

export interface ChatMessageInterface {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp?: Date;
}
