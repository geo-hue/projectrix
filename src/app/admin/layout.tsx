// src/app/admin/layout.tsx
"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  BarChart4,
  Users,
  Code2,
  Settings,
  MessageSquare,
  ChevronLeft,
  LogOut,
  Menu,
  X,
  Shield,
  Home
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define sidebar navigation items
  const navItems = [
    {
      title: 'Dashboard',
      description: 'Analytics overview and key metrics',
      icon: BarChart4,
      href: '/admin',
      color: 'blue'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts, roles and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'green'
    },
    {
      title: 'Project Management',
      description: 'Review and moderate published projects',
      icon: Code2,
      href: '/admin/projects',
      color: 'purple'
    },
    {
      title: 'Feedback Management',
      description: 'Manage user feedback and feature requests',
      icon: MessageSquare,
      href: '/admin/feedback',
      color: 'amber'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings and parameters',
      icon: Settings,
      href: '/admin/settings',
      color: 'slate'
    }
  ];

  // Redirect if not admin
  if (!loading && isAuthenticated && user?.role !== 'admin') {
    toast.error('Access denied. Admin privileges required.');
    router.push('/');
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated && !loading) {
    toast.error('Please login to access admin panel');
    router.push('/');
    return null;
  }

  // Handle navigation
  const navigateTo = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row bg-muted/30">
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-full flex-col overflow-y-auto bg-background pb-12">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">Admin Panel</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1 px-4 py-6">
              <div className="flex flex-col gap-6">
                {navItems.map((item, index) => (
                  <button
                    key={item.href}
                    onClick={() => navigateTo(item.href)}
                    className={`flex items-start gap-4 px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.href 
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className={`rounded-lg p-2 shrink-0 bg-${item.color}-100 dark:bg-${item.color}-900/20`}>
                      <item.icon className={`h-5 w-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{item.title}</div>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t px-4 py-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => router.push('/')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to App
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col border-r bg-background ${
        sidebarOpen ? 'w-80' : 'w-20'
      } transition-all duration-200`}>
        <div className={`flex h-14 items-center px-4 py-4 border-b ${
          sidebarOpen ? 'justify-between' : 'justify-center'
        }`}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-bold">Admin Panel</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
        <ScrollArea className="flex-1 py-4">
          <div className="flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => navigateTo(item.href)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === item.href 
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                } ${!sidebarOpen ? 'justify-center p-2' : ''}`}
                title={!sidebarOpen ? item.title : undefined}
              >
                <div className={`rounded-lg p-1 ${sidebarOpen ? 'shrink-0' : ''} ${
                  pathname === item.href 
                    ? `bg-${item.color}-100 dark:bg-${item.color}-900/20`
                    : ''
                }`}>
                  <item.icon className={`h-5 w-5 ${
                    pathname === item.href 
                      ? `text-${item.color}-600 dark:text-${item.color}-400`
                      : 'text-muted-foreground'
                  }`} />
                </div>
                {sidebarOpen && (
                  <span className={pathname === item.href ? 'font-medium' : ''}>{item.title}</span>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className={`border-t p-4 ${sidebarOpen ? '' : 'flex justify-center'}`}>
          {sidebarOpen ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => router.push('/')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to App
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;