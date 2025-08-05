import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { usePosts } from '@/context/PostContext';
import { TrendingUp, Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const TrendingPosts = () => {
  const { getTrendingPosts } = usePosts();
  const trendingPosts = getTrendingPosts();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (trendingPosts.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Trending Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingPosts.map((post, index) => (
          <div key={post.id} className="border-l-2 border-primary/20 pl-3">
            <div className="flex items-start space-x-2 mb-2">
              <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center">
                {index + 1}
              </span>
              <Link 
                to={`/profile/${post.authorId}`}
                className="flex items-center space-x-2 hover:bg-accent/50 rounded p-1 -m-1 transition-colors"
              >
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                    {getInitials(post.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{post.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </Link>
            </div>
            
            <p className="text-sm text-foreground leading-relaxed mb-2 line-clamp-2">
              {post.content.substring(0, 100)}...
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{post.likes?.length || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{post.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrendingPosts;