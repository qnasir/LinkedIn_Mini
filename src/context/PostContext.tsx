import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post, Comment, Notification } from '@/types';

interface PostContextType {
  posts: Post[];
  notifications: Notification[];
  addPost: (content: string, authorId: string, authorName: string, authorTitle?: string) => void;
  likePost: (postId: string, userId: string, userName: string) => void;
  addComment: (postId: string, content: string, authorId: string, authorName: string) => void;
  getUserPosts: (userId: string) => Post[];
  searchPosts: (query: string) => Post[];
  getTrendingPosts: () => Post[];
  markNotificationAsRead: (notificationId: string) => void;
  getUnreadNotifications: () => number;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

// Enhanced mock posts data
const mockPosts: Post[] = [
  {
    id: "1",
    content: "Excited to share that I've just launched my new project! Building in public has been an amazing journey. The community support has been incredible. #buildinpublic #startup",
    authorId: "1",
    authorName: "John Doe",
    authorTitle: "Senior Software Engineer",
    createdAt: new Date("2024-01-15T10:30:00"),
    likes: ["2", "admin"],
    comments: [
      {
        id: "c1",
        content: "Congratulations! Can't wait to try it out.",
        authorId: "2",
        authorName: "Jane Smith",
        createdAt: new Date("2024-01-15T11:00:00"),
        postId: "1"
      }
    ],
    tags: ["buildinpublic", "startup"]
  },
  {
    id: "2",
    content: "Great insights from today's tech conference. The future of AI in product development looks promising! Key takeaways: 1) AI will augment, not replace human creativity 2) Data quality is more important than quantity 3) Ethics should be built-in from day one #AI #ProductDevelopment #TechConference",
    authorId: "2", 
    authorName: "Jane Smith",
    authorTitle: "Senior Product Manager",
    createdAt: new Date("2024-01-14T15:45:00"),
    likes: ["1", "admin"],
    comments: [],
    tags: ["AI", "ProductDevelopment", "TechConference"]
  },
  {
    id: "3",
    content: "Just finished reading 'Clean Code' by Robert Martin - highly recommend it to all developers out there. The principles of writing readable, maintainable code are timeless. What's your favorite tech book? Drop your recommendations below! 📚 #CleanCode #SoftwareDevelopment #BookRecommendations",
    authorId: "1",
    authorName: "John Doe",
    authorTitle: "Senior Software Engineer",
    createdAt: new Date("2024-01-13T09:15:00"),
    likes: ["admin"],
    comments: [
      {
        id: "c2",
        content: "Great book! I'd also recommend 'The Pragmatic Programmer'",
        authorId: "admin",
        authorName: "Admin User",
        createdAt: new Date("2024-01-13T10:30:00"),
        postId: "3"
      }
    ],
    tags: ["CleanCode", "SoftwareDevelopment", "BookRecommendations"]
  }
];

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "like",
    message: "liked your post about launching your new project",
    fromUserId: "2",
    fromUserName: "Jane Smith",
    targetId: "1",
    createdAt: new Date("2024-01-15T11:30:00"),
    read: false
  },
  {
    id: "n2",
    type: "comment",
    message: "commented on your post",
    fromUserId: "2", 
    fromUserName: "Jane Smith",
    targetId: "1",
    createdAt: new Date("2024-01-15T11:00:00"),
    read: false
  }
];

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addPost = (content: string, authorId: string, authorName: string, authorTitle?: string) => {
    const tags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
    
    const newPost: Post = {
      id: (posts.length + 1).toString(),
      content,
      authorId,
      authorName,
      authorTitle,
      createdAt: new Date(),
      likes: [],
      comments: [],
      tags
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string, userId: string, userName: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const likes = post.likes || [];
        const isLiked = likes.includes(userId);
        
        if (isLiked) {
          return { ...post, likes: likes.filter(id => id !== userId) };
        } else {
          // Add notification if liking someone else's post
          if (post.authorId !== userId) {
            const newNotification: Notification = {
              id: `n${Date.now()}`,
              type: "like",
              message: "liked your post",
              fromUserId: userId,
              fromUserName: userName,
              targetId: postId,
              createdAt: new Date(),
              read: false
            };
            setNotifications(prev => [newNotification, ...prev]);
          }
          
          return { ...post, likes: [...likes, userId] };
        }
      }
      return post;
    }));
  };

  const addComment = (postId: string, content: string, authorId: string, authorName: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      content,
      authorId,
      authorName,
      createdAt: new Date(),
      postId
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const comments = [...(post.comments || []), newComment];
        
        // Add notification if commenting on someone else's post
        if (post.authorId !== authorId) {
          const newNotification: Notification = {
            id: `n${Date.now()}`,
            type: "comment",
            message: "commented on your post",
            fromUserId: authorId,
            fromUserName: authorName,
            targetId: postId,
            createdAt: new Date(),
            read: false
          };
          setNotifications(prev => [newNotification, ...prev]);
        }
        
        return { ...post, comments };
      }
      return post;
    }));
  };

  const getUserPosts = (userId: string): Post[] => {
    return posts.filter(post => post.authorId === userId);
  };

  const searchPosts = (query: string): Post[] => {
    return posts.filter(post => 
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.authorName.toLowerCase().includes(query.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getTrendingPosts = (): Post[] => {
    return [...posts]
      .sort((a, b) => {
        const aScore = (a.likes?.length || 0) + (a.comments?.length || 0);
        const bScore = (b.likes?.length || 0) + (b.comments?.length || 0);
        return bScore - aScore;
      })
      .slice(0, 3);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getUnreadNotifications = (): number => {
    return notifications.filter(n => !n.read).length;
  };

  return (
    <PostContext.Provider value={{
      posts,
      notifications,
      addPost,
      likePost,
      addComment,
      getUserPosts,
      searchPosts,
      getTrendingPosts,
      markNotificationAsRead,
      getUnreadNotifications
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (undefined === context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};