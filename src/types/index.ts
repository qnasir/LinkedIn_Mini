export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar?: string;
  title?: string;
  location?: string;
  website?: string;
  followers?: string[];
  following?: string[];
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorTitle?: string;
  createdAt: Date;
  likes?: string[];
  comments?: Comment[];
  tags?: string[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  postId: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  fromUserId: string;
  fromUserName: string;
  targetId?: string;
  createdAt: Date;
  read: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}