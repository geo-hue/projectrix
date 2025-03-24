'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Add Image import
import { Button } from '@/components/ui/button';
import { X, Github, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserData } from '@/app/context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  currentPath: string;
  user: UserData | null; 
  loading: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  onClose, 
  isAuthenticated, 
  currentPath,
  user,
  loading,
  onLogin,
  onLogout
}: MobileMenuProps) => {
  const navItems = [
    { path: '/ideas', label: 'Project Ideas' },
    { path: '/generate', label: 'Generate' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/about', label: 'About' },
    ...(isAuthenticated ? [
      { path: '/feedback', label:'Feedback'},
      { path: '/collaborations', label: 'My Collaborations' },
      { path: '/profile', label: 'Profile' }
    ] : [])
  ];

  const isActivePage = (path: string) => {
    if (path === '/') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 dark:bg-black/40 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          {/* Menu Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 z-50 h-full w-[300px] bg-background/95 dark:bg-gray-950/95 border-l border-border/40 backdrop-blur-md shadow-xl md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-border/40 bg-background/80 dark:bg-gray-950/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* Add the logo to the mobile menu header */}
                    <div className="mr-2 relative h-6 w-6">
                      <Image 
                        src="/logo.png" 
                        alt="Projectrix Logo" 
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <h2 className="font-orbitron text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                      Menu
                    </h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* User Profile (if authenticated) */}
              {isAuthenticated && user && (
                <div className="p-4 border-b border-border/40 bg-background/80 dark:bg-gray-950/80">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10 ring-2 ring-border/40">
                      <AvatarImage src={user.avatar} alt={user.name} onError={(e) => {
      e.currentTarget.src = `https://avatar.vercel.sh/${user.username || 'user'}`;
    }} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto bg-background/80 dark:bg-gray-950/80">
                <div className="p-4 space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.path}
                        onClick={onClose}
                        className={cn(
                          "flex items-center w-full p-3 rounded-lg transition-colors",
                          isActivePage(item.path)
                            ? "bg-primary/10 dark:bg-primary/20 text-foreground"
                            : "text-foreground/80 hover:bg-accent hover:text-foreground dark:hover:bg-accent/20"
                        )}
                      >
                        <span className="font-medium">{item.label}</span>
                        {isActivePage(item.path) && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-border/40 bg-background/80 dark:bg-gray-950/80">
                {loading ? (
                  <Button disabled className="w-full">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </Button>
                ) : isAuthenticated ? (
                  <Button 
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full gap-2 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 text-white hover:opacity-90 transition-opacity"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      onLogin();
                      onClose();
                    }}
                    className="w-full gap-2 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 text-white hover:opacity-90 transition-opacity"
                  >
                    <Github className="h-4 w-4" />
                    Login with GitHub
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;