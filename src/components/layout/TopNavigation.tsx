// components/layout/TopNavigation.tsx
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const TopNavigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Fehler beim Ausloggen:", error);
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "light":
        return <Sun className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  return (
    <header className="bg-background border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        <h2 className="text-xl font-semibold">BloomBalance pro</h2>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.username || "Benutzer"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/settings");
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Einstellungen</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setTheme("light");
                    setIsOpen(false);
                  }}
                >
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Hell</span>
                  {theme === "light" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setTheme("dark");
                    setIsOpen(false);
                  }}
                >
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dunkel</span>
                  {theme === "dark" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setTheme("system");
                    setIsOpen(false);
                  }}
                >
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>System</span>
                  {theme === "system" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Abmelden</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
