import { useAuth } from '@/context/AuthContext';
import Landing from './Landing';
import Dashboard from './Dashboard';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <Landing />;
};

export default Home;