import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, User, ArrowRight, Crown, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Landing = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDemoLogin = async (email: string, userType: string) => {
    const success = await login(email, 'demo');
    if (success) {
      toast({
        title: `Welcome ${userType}!`,
        description: "You've been logged in with a demo account."
      });
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: Users,
      title: "Professional Networking",
      description: "Connect with professionals in your industry"
    },
    {
      icon: MessageSquare,
      title: "Share Updates", 
      description: "Post updates and engage with your network"
    },
    {
      icon: User,
      title: "Professional Profiles",
      description: "Build your professional presence online"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-foreground">LinkedMini</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Build Your Professional Network
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with professionals, share insights, and grow your career with LinkedMini - 
            a modern networking platform designed for today's professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary hover:bg-primary/90 text-lg px-8">
                Join Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Demo Login Cards */}
          <div className="max-w-2xl mx-auto mb-16">
            <h3 className="text-lg font-semibold text-foreground mb-4">Try Demo Accounts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer"
                    onClick={() => handleDemoLogin('admin@linkedmini.com', 'Admin')}>
                <CardContent className="p-4 text-center">
                  <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Admin Demo</h4>
                  <p className="text-sm text-muted-foreground">Full platform access</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer"
                    onClick={() => handleDemoLogin('john@example.com', 'John Doe')}>
                <CardContent className="p-4 text-center">
                  <UserCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer"
                    onClick={() => handleDemoLogin('jane@example.com', 'Jane Smith')}>
                <CardContent className="p-4 text-center">
                  <UserCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Jane Smith</h4>
                  <p className="text-sm text-muted-foreground">Product Manager</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything you need for professional networking
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple, powerful tools to help you connect and grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-hover transition-all duration-300 text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto shadow-hover bg-gradient-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to start networking?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of professionals already using LinkedMini
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-gradient-primary hover:bg-primary/90">
                  Create Your Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>
            <span className="text-lg font-bold text-foreground">LinkedMini</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 LinkedMini. A modern professional networking platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;