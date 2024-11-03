'use client'

import { Search, User, ShoppingCart, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const SearchBar = ({ toggleDarkMode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
    window.location.reload();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    {user?.role === 'admin' ? (
                      <Link href="/admin/dashboard">
                        <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Dashboard
                        </span>
                      </Link>
                    ) : null}
                    <Link href="/profile">
                      <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Profile
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="ghost" size="sm">Register</Button>
                </Link>
              </div>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>   
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SearchBar; 