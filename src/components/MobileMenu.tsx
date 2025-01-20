'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  currentPath: string;
}

const MobileMenu = ({ isOpen, onClose, isAuthenticated, currentPath }: MobileMenuProps) => {
  const navItems = [
    { path: '/ideas', label: 'Project Ideas' },
    { path: '/generate', label: 'Generate' },
    ...(isAuthenticated ? [
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
            className="fixed right-0 top-0 z-50 h-full w-[300px] bg-background border-l border-border/40 md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <h2 className="font-orbitron text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                    Menu
                  </h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto">
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
                            ? "bg-primary/10 text-foreground"
                            : "text-foreground/80 hover:bg-accent hover:text-foreground"
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
              {!isAuthenticated && (
                <div className="p-4 border-t border-border/40">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 text-white hover:opacity-90 transition-opacity"
                    onClick={onClose}
                  >
                    Log in with GitHub
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;