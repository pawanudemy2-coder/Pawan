
export enum FeedbackType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  VOICE = 'VOICE',
  CODE = 'CODE'
}

export interface Feedback {
  id: string;
  author: string;
  type: FeedbackType;
  content: string;
  timestamp: number;
  metadata?: {
    codeDiff?: string;
    caption?: string;
  };
}

export interface Challenge {
  id: string;
  topic: string;
  tutor: string;
  deadline: number;
  description: string;
  submissionsCount: number;
}

export interface Project {
  id: string;
  challengeId: string; // Linked to a topic
  title: string;
  description: string;
  owner: string;
  status: 'DRAFT' | 'TESTING' | 'FINALIZED';
  codeSnippet: string;
  thumbnail: string;
  feedbacks: Feedback[];
  createdAt: number;
  votes: number; // For community polling
}

export interface Notification {
  id: string;
  message: string;
  projectId: string;
  timestamp: number;
  isRead: boolean;
}
