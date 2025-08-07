import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCurrentUser, logoutUser } from "@/utils/userAuth";
import { getUserLevel } from "@/utils/courseManager";
import { getUnreadNotificationsCount } from "@/utils/notificationManager";
import { useToast } from "@/hooks/use-toast";
import ChatBot from "@/components/features/ChatBot";

const TopBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userLevel, setUserLevel] = useState({ level: 1, progress: 0, nextLevelProgress: 100 });
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const level = getUserLevel(currentUser.id);
      setUserLevel(level);
      
      const notifications = getUnreadNotificationsCount(currentUser.id);
      setUnreadCount(notifications);
    }
  }, [currentUser]);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Courses", path: "/courses" },
    { name: "Arena", path: "/arena" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/signin');
  };

  return (
    <>
      <div className="platform-topbar">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-xl font-bold text-primary">theGnaN</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${
                isActive(link.path) ? "text-accent" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="icon-hover relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-accent text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="icon-hover relative">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-background border border-border shadow-lg">
              {/* User Level Info */}
              <div className="p-3 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Level {userLevel.level}</span>
                  <Badge variant="secondary" className="text-xs">
                    {userLevel.progress.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={userLevel.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {userLevel.nextLevelProgress.toFixed(0)}% to next level
                </p>
              </div>
              
              <DropdownMenuItem asChild>
                <Link to="/profile" className="w-full cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[60px] left-0 right-0 bg-background border-b border-border z-40 md:hidden fade-in">
          <nav className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link py-2 ${
                  isActive(link.path) ? "text-accent" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* ChatBot */}
      <ChatBot />
    </>
  );
};

export default TopBar;