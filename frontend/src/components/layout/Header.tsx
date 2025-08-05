import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, LogOut, User, Zap } from "lucide-react";

export const Header = () => {
  const [notifications] = useState(3);
  const [userName, setUserName] = useState("John Doe"); // default fallback
  const navigate = useNavigate();

  useEffect(() => {
    // Load user name from localStorage or sessionStorage (whatever you used in login)
    const name = localStorage.getItem("name"); // or sessionStorage.getItem("name")
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 relative z-10">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Support Hub
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative hover:bg-primary-glow/20 transition-smooth"
        >
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {notifications}
            </Badge>
          )}
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-primary-glow/20 transition-smooth"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="/api/placeholder/32/32" alt="Profile" />
                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                  {userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:block">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border">
            <DropdownMenuItem
              className="flex items-center space-x-2 hover:bg-accent cursor-pointer"
              onClick={() =>{
  console.log("Navigating to profile");
  navigate('/profile');
}}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center space-x-2 hover:bg-accent cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center space-x-2 hover:bg-accent cursor-pointer text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
