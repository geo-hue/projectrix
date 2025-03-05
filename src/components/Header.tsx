'use client';

import React, { useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, Github, LogOut, Users, User } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/app/context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Use the new auth context
  const { user, loading, login, logout } = useAuth();
  const router = useRouter();
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Navigation items - Updated with auth awareness
  const navItems = [
    { path: '/ideas', label: 'Project Ideas' },
    { path: '/generate', label: 'Generate' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/about', label: 'About' },
    ...(user ? [
      { path: '/feedback', label: 'Feedback' },
      { path: '/collaborations', label: 'My Collaborations' },
      { path: '/profile', label: 'Profile' }
    ] : [])
  ];

  const headerClasses = cn(
    "fixed top-0 z-50 w-full",
    "transition-all duration-200",
    "border-b border-border/40",
    isScrolled 
      ? "bg-background/80 backdrop-blur-xl backdrop-saturate-150"
      : "bg-background/40 backdrop-blur-sm",
    "supports-[backdrop-filter]:bg-background/60"
  );

  // Handle login click
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Handle logout click
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className={headerClasses}>
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
            
            <div className="flex items-center gap-4">
            {user && <NotificationDropdown />}
              <ThemeToggle />
              
              {loading ? (
                <Button disabled variant="outline" size="sm">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </Button>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-64 bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-lg rounded-xl overflow-hidden p-2"
                    align="end" 
                    forceMount
                  >
                    <DropdownMenuLabel className="pb-2 border-b border-black/10 dark:border-white/10">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border-2 border-black/10 dark:border-white/10">
                          <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    
                    <div className="py-2">
                      <DropdownMenuItem 
                        onClick={() => router.push('/profile')}
                        className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors duration-200 ease-in-out focus:bg-black/5 dark:focus:bg-white/10"
                      >
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => router.push('/collaborations')}
                        className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors duration-200 ease-in-out focus:bg-black/5 dark:focus:bg-white/10"
                      >
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>My Collaborations</span>
                      </DropdownMenuItem>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-300 rounded-md transition-colors duration-200 ease-in-out focus:bg-red-50 dark:focus:bg-red-950"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={handleLogin}
                  variant="outline" 
                  size="sm"
                  className="relative overflow-hidden group gap-2"
                >
                  <Github className="h-4 w-4" />
                  <span className="relative z-10">Login with GitHub</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-2">
          {user && <NotificationDropdown />} 
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

      {/* Mobile Menu - You'll need to update MobileMenu component too */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={!!user}
        currentPath={pathname}
        user={user}
        loading={loading}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </>
  );
}
  export default Header;