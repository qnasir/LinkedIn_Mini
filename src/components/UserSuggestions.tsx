import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { UserPlus, Users } from 'lucide-react';

const UserSuggestions = () => {
  const { user, getAllUsers, followUser } = useAuth();
  const allUsers = getAllUsers();
  
  // Get suggested users (users not followed by current user)
  const suggestedUsers = allUsers
    .filter(u => u.id !== user?.id && !user?.following?.includes(u.id))
    .slice(0, 3);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleFollow = (userId: string) => {
    followUser(userId);
  };

  if (suggestedUsers.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center">
          <Users className="w-5 h-5 mr-2 text-primary" />
          People you may know
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedUsers.map(suggestedUser => (
          <div key={suggestedUser.id} className="flex items-center justify-between">
            <Link 
              to={`/profile/${suggestedUser.id}`}
              className="flex items-center space-x-3 flex-1 hover:bg-accent/50 rounded-lg p-2 -m-2 transition-colors"
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-medium">
                  {getInitials(suggestedUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{suggestedUser.name}</p>
                <p className="text-sm text-muted-foreground truncate">{suggestedUser.title}</p>
              </div>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleFollow(suggestedUser.id)}
              className="ml-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserSuggestions;