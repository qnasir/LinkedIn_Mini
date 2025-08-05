import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import UserSuggestions from '@/components/UserSuggestions';
import TrendingPosts from '@/components/TrendingPosts';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { posts } = usePosts();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const isAdmin = user?.email === 'admin@linkedmini.com';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 lg:order-2 space-y-6">
            {/* Welcome Card */}
            <Card className="shadow-card border-border bg-gradient-primary/5 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold font-display text-foreground">
                      Welcome back, {user?.name}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      {isAdmin ? 'Admin Dashboard - Manage your platform' : 'Share your professional journey'}
                    </p>
                  </div>
                  {isAdmin && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      Admin
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <CreatePost />
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold font-display text-foreground">Recent Posts</h2>
              {posts.length === 0 ? (
                <Card className="shadow-card border-border">
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>

          {/* Left sidebar - User suggestions */}
          <div className="lg:col-span-1 lg:order-1 space-y-6">
            <UserSuggestions />
          </div>

          {/* Right sidebar - Trending posts */}
          <div className="lg:col-span-1 lg:order-3 space-y-6">
            <TrendingPosts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;