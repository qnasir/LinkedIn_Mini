import { useState } from 'react';
import { Post } from '@/types';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const { likePost, addComment } = usePosts();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isLiked = user ? post.likes?.includes(user.id) : false;
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  const handleLike = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "Please login to like posts"
      });
      return;
    }
    likePost(post.id, user.id, user.name);
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;
    
    setIsCommenting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      addComment(post.id, commentText.trim(), user.id, user.name);
      setCommentText('');
      toast({
        title: "Comment added",
        description: "Your comment has been posted"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post comment"
      });
    } finally {
      setIsCommenting(false);
    }
  };

  const renderContent = (content: string) => {
    // Simple hashtag highlighting
    return content.split(' ').map((word, index) => (
      <span key={index}>
        {word.startsWith('#') ? (
          <span className="text-primary font-medium hover:underline cursor-pointer">
            {word}
          </span>
        ) : (
          word
        )}
        {index < content.split(' ').length - 1 ? ' ' : ''}
      </span>
    ));
  };

  return (
    <Card className="shadow-card hover:shadow-hover transition-all duration-300 border-border animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-medium">
                {getInitials(post.authorName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Link 
                to={`/profile/${post.authorId}`}
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                {post.authorName}
              </Link>
              {post.authorTitle && (
                <p className="text-sm text-muted-foreground">{post.authorTitle}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <p className="text-foreground leading-relaxed">
          {renderContent(post.content)}
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`transition-all duration-200 ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 mr-1 transition-all duration-200 ${
                isLiked ? 'fill-current animate-bounce-subtle' : ''
              }`} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {commentCount > 0 && <span>{commentCount}</span>}
            </Button>
          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="space-y-3 pt-3 border-t border-border animate-fade-in">
            {/* Add comment */}
            {user && (
              <div className="flex space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[60px] resize-none text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleComment}
                    disabled={!commentText.trim() || isCommenting}
                    className="ml-auto"
                  >
                    {isCommenting ? (
                      'Posting...'
                    ) : (
                      <>
                        <Send className="w-3 h-3 mr-1" />
                        Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Comments list */}
            {post.comments?.map(comment => (
              <div key={comment.id} className="flex space-x-2 animate-scale-in">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    {getInitials(comment.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-accent/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {comment.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;