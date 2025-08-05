import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostContext';
import { Link } from 'react-router-dom';
import { User, Post } from '@/types';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{users: User[], posts: Post[]}>({ users: [], posts: [] });
  const { searchUsers } = useAuth();
  const { searchPosts } = usePosts();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const users = searchUsers(query);
      const posts = searchPosts(query);
      setSearchResults({ users, posts });
    } else {
      setSearchResults({ users: [], posts: [] });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ users: [], posts: [] });
    setIsExpanded(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search people and posts..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="pl-10 pr-10 bg-accent/50 border-input focus:bg-background transition-all duration-200"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {isExpanded && (searchResults.users.length > 0 || searchResults.posts.length > 0 || searchQuery) && (
        <Card className="absolute top-full left-0 right-0 mt-2 shadow-hover border-border z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {searchQuery && searchResults.users.length === 0 && searchResults.posts.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            )}
            
            {searchResults.users.length > 0 && (
              <div className="border-b border-border">
                <div className="px-4 py-2 bg-accent/30">
                  <p className="text-sm font-medium text-muted-foreground">People</p>
                </div>
                {searchResults.users.slice(0, 3).map(user => (
                  <Link
                    key={user.id}
                    to={`/profile/${user.id}`}
                    onClick={() => setIsExpanded(false)}
                    className="block p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {searchResults.posts.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-accent/30">
                  <p className="text-sm font-medium text-muted-foreground">Posts</p>
                </div>
                {searchResults.posts.slice(0, 3).map(post => (
                  <div
                    key={post.id}
                    className="p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => setIsExpanded(false)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                          {getInitials(post.authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{post.authorName}</p>
                        <p className="text-sm text-muted-foreground truncate">{post.content.substring(0, 80)}...</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;