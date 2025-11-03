// Message types
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

// AI Model types
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
}

// Chat types
export interface ChatSession {
  id: string;
  title: string;
  model: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response types
export interface ChatRequest {
  model: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  stream?: boolean;
}

export interface ChatResponse {
  id: string;
  message: Message;
  model: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
