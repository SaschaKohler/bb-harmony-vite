import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, User, LogOut, Settings } from "lucide-react";

const TopNavigation: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Fehler beim Ausloggen:", error);
    }
  };

  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bachblüten Admin</h2>
        <div className="flex items-center">
          <button className="mr-4">
            <Bell className="w-6 h-6" />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center focus:outline-none"
            >
              <img
                className="w-8 h-8 rounded-full mr-2"
                src={user?.avatar_url || "https://via.placeholder.com/32"}
                alt="User avatar"
              />
              <span className="mr-1">{user?.email || "User"}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="mr-2 w-4 h-4" />
                  Profil
                </Link>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Settings className="mr-2 w-4 h-4" />
                  Einstellungen
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  Ausloggen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
