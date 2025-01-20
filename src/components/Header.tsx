'use client';

import React, { useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';

// This would normally come from your auth state management
const isAuthenticated = true;

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Base classes for nav links
  const baseNavLinkClasses = "relative font-medium transition-colors";
  
  // Function to determine if a link is active
  const isActivePage = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Function to get link classes based on active state
  const getNavLinkClasses = (path: string) => {
    return cn(
      baseNavLinkClasses,
      "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-blue-900 after:to-blue-600 dark:after:from-blue-700 dark:after:to-blue-400 after:transition-all after:duration-300 hover:after:w-full",
      isActivePage(path) 
        ? "text-foreground after:w-full" 
        : "text-foreground/80 hover:text-foreground"
    );
  };

  // Navigation items
  const navItems = [
    { path: '/ideas', label: 'Project Ideas' },
    { path: '/generate', label: 'Generate' },
    ...(isAuthenticated ? [
      { path: '/collaborations', label: 'My Collaborations' },
      { path: '/profile', label: 'Profile' }
    ] : [])
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group">
              <h1 className="font-orbitron text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent tracking-wider relative">
                PROJECTRIX
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                href={item.path} 
                className={getNavLinkClasses(item.path)}
              >
                {item.label}
              </Link>
            ))}
            
            {!isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10">Log in with GitHub</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Button>
              </div>
            )}

            {/* Desktop Theme Toggle */}
            <div className="hidden md:flex items-center">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="ml-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        currentPath={pathname}
      />
    </>
  );
};

export default Header;