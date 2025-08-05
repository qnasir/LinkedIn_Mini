import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import SearchBar from './SearchBar';
import NotificationPanel from './NotificationPanel';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Home } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold font-display text-foreground">LinkedMini</span>
          </Link>

          {/* Search bar - only show when authenticated */}
          {isAuthenticated && (
            <div className="flex-1 max-w-md mx-6">
              <SearchBar />
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to={`/profile/${user?.id}`}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <NotificationPanel />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;