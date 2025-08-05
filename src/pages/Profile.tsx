import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Edit, UserPlus, UserMinus, MapPin, Globe } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Mock user data for demo - use data from AuthContext
const mockUsers = [
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
  }
];

const handleFollow = (profileUser: any, isFollowing: boolean, followUser: any, unfollowUser: any, toast: any) => {
  if (isFollowing) {
    unfollowUser(profileUser.id);
    toast({
      title: "Unfollowed",
      description: `You unfollowed ${profileUser.name}`
    });
  } else {
    followUser(profileUser.id);
    toast({
      title: "Following", 
      description: `You are now following ${profileUser.name}`
    });
  }
};

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, updateProfile, followUser, unfollowUser } = useAuth();
  const { getUserPosts } = usePosts();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');

  const profileUser = mockUsers.find(u => u.id === userId) || currentUser;
  const userPosts = getUserPosts(userId || '');
  const isOwnProfile = currentUser?.id === userId;
  const isFollowing = currentUser?.following?.includes(userId || '') || false;

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditStart = () => {
    setEditName(profileUser.name);
    setEditBio(profileUser.bio);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (isOwnProfile && currentUser) {
      updateProfile({ name: editName, bio: editBio });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditName('');
    setEditBio('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-card border-border">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                    {getInitials(profileUser.name)}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-center font-semibold"
                    />
                    <Textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleEditSave}>Save</Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-xl font-display">{profileUser.name}</CardTitle>
                    {profileUser.title && (
                      <p className="text-muted-foreground font-medium">{profileUser.title}</p>
                    )}
                    <p className="text-muted-foreground mt-2">{profileUser.bio}</p>
                    
                    {/* Stats */}
                    <div className="flex justify-center space-x-6 mt-4 pt-4 border-t border-border">
                      <div className="text-center">
                        <p className="font-semibold text-foreground">{profileUser.followers?.length || 0}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-foreground">{profileUser.following?.length || 0}</p>
                        <p className="text-xs text-muted-foreground">Following</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-foreground">{userPosts.length}</p>
                        <p className="text-xs text-muted-foreground">Posts</p>
                      </div>
                    </div>
                    
                    {isOwnProfile ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleEditStart}
                        className="mt-4"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleFollow(profileUser, isFollowing, followUser, unfollowUser, toast)}
                        variant={isFollowing ? "outline" : "default"}
                        className={`mt-4 transition-all duration-200 ${
                          isFollowing 
                            ? "hover:bg-destructive hover:text-destructive-foreground" 
                            : "bg-gradient-primary hover:bg-primary/90"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profileUser.email}</span>
                </div>
                {profileUser.location && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profileUser.location}</span>
                  </div>
                )}
                {profileUser.website && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{profileUser.website}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Posts */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold font-display text-foreground">
                {isOwnProfile ? 'Your Posts' : `${profileUser.name}'s Posts`}
              </h2>
              
              {userPosts.length === 0 ? (
                <Card className="shadow-card border-border">
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      {isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                userPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;