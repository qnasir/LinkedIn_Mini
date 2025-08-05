import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, bio: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  getAllUsers: () => User[];
  searchUsers: (query: string) => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced mock users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    bio: "Software Engineer passionate about building great products",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    website: "johndoe.dev",
    followers: ["2"],
    following: ["2", "admin"]
  },
  {
    id: "2", 
    name: "Jane Smith",
    email: "jane@example.com",
    bio: "Product Manager with 5+ years of experience in tech",
    title: "Senior Product Manager",
    location: "New York, NY",
    website: "janesmith.com",
    followers: ["1", "admin"],
    following: ["1"]
  },
  {
    id: "admin",
    name: "Admin User",
    email: "admin@linkedmini.com",
    bio: "Platform Administrator with full system access",
    title: "Platform Administrator",
    location: "Remote",
    followers: [],
    following: ["1", "2"]
  },
  {
    id: "3",
    name: "Alex Chen",
    email: "alex@example.com",
    bio: "UX Designer creating beautiful digital experiences",
    title: "Senior UX Designer",
    location: "Seattle, WA",
    followers: [],
    following: []
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria@example.com", 
    bio: "Data Scientist turning data into insights",
    title: "Lead Data Scientist",
    location: "Austin, TX",
    followers: [],
    following: []
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setAuthState({ user, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, bio: string): Promise<boolean> => {
    if (mockUsers.some(u => u.email === email)) {
      return false;
    }
    
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      bio,
      title: "Professional",
      location: "Remote",
      followers: [],
      following: []
    };
    
    mockUsers.push(newUser);
    setAuthState({ user: newUser, isAuthenticated: true });
    return true;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
  };

  const updateProfile = (updatedUser: Partial<User>) => {
    if (authState.user) {
      const updated = { ...authState.user, ...updatedUser };
      setAuthState({ ...authState, user: updated });
      
      const index = mockUsers.findIndex(u => u.id === authState.user!.id);
      if (index !== -1) {
        mockUsers[index] = updated;
      }
    }
  };

  const followUser = (userId: string) => {
    if (!authState.user) return;
    
    const currentUser = mockUsers.find(u => u.id === authState.user!.id);
    const targetUser = mockUsers.find(u => u.id === userId);
    
    if (currentUser && targetUser) {
      if (!currentUser.following?.includes(userId)) {
        currentUser.following = [...(currentUser.following || []), userId];
        targetUser.followers = [...(targetUser.followers || []), authState.user.id];
        
        setAuthState({ ...authState, user: currentUser });
      }
    }
  };

  const unfollowUser = (userId: string) => {
    if (!authState.user) return;
    
    const currentUser = mockUsers.find(u => u.id === authState.user!.id);
    const targetUser = mockUsers.find(u => u.id === userId);
    
    if (currentUser && targetUser) {
      currentUser.following = (currentUser.following || []).filter(id => id !== userId);
      targetUser.followers = (targetUser.followers || []).filter(id => id !== authState.user!.id);
      
      setAuthState({ ...authState, user: currentUser });
    }
  };

  const getAllUsers = () => mockUsers;

  const searchUsers = (query: string) => {
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.bio.toLowerCase().includes(query.toLowerCase()) ||
      user.title?.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateProfile,
      followUser,
      unfollowUser,
      getAllUsers,
      searchUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};