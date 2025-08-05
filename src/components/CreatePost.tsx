import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { user } = useAuth();
  const { addPost } = usePosts();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please write something before posting!"
      });
      return;
    }

    if (!user) return;

    setIsPosting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addPost(content.trim(), user.id, user.name, user.title);
      setContent('');
      
      toast({
        title: "Success!",
        description: "Your post has been published."
      });
    } catch (error) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Failed to publish post. Please try again."
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="shadow-card border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-display text-foreground">Share an update</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Try adding hashtags like #technology #career"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-input focus:ring-primary"
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {content.length}/500
            </span>
            <Button 
              type="submit" 
              disabled={isPosting || !content.trim()}
              className="bg-gradient-primary hover:bg-primary/90"
            >
              {isPosting ? (
                'Posting...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;