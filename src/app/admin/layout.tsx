// src/app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Code2, 
  Database, 
  MessageSquare, 
  Settings, 
  BarChart, 
  CreditCard, 
  LogOut,
  ChevronDown,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/app/context/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUnreadCountQuery } from '@/app/api/activityApiSlice';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get notifications count
  const { data: unreadCountData } = useGetUnreadCountQuery();
  const unreadCount = unreadCountData?.unreadCount || 0;
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
      toast.error('Please log in to access this page');
    } else if (!loading && isAuthenticated && !isAdmin) {
      router.push('/profile');
      toast.error('You do not have permission to access the admin area');
    }
  }, [loading, isAuthenticated, isAdmin, router]);
  
  // If still checking authentication, show loading
  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/5 dark:bg-white/5">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-current border-t-transparent text-primary"></div>
      </div>
    );
  }
  
  // Admin navigation items
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Projects', href: '/admin/projects', icon: Code2 },
    { name: 'Collaborations', href: '/admin/collaborations', icon: Database },
    { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    { name: 'Revenue', href: '/admin/revenue', icon: CreditCard },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];
  
  // Check if a link is active
  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900/50">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white dark:bg-black p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="font-bold text-xl tracking-tight font-orbitron bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
            Projectrix Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="relative" size="icon">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0] || 'A'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div 
        className={cn(
          "lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm dark:bg-black/50",
          isMobileMenuOpen ? "block" : "hidden"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      <div 
        className={cn(
          "lg:hidden fixed top-0 left-0 z-30 w-64 h-full bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="font-bold text-xl tracking-tight font-orbitron bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
              Projectrix Admin
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md my-1",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                  setIsMobileMenuOpen(false);
                }}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </a>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:dark:border-gray-800 lg:bg-white lg:dark:bg-black">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="font-bold text-xl tracking-tight font-orbitron bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
              Projectrix Admin
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md my-1",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </a>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center mb-4">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Desktop header */}
        <header className="hidden lg:flex sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 h-16 items-center justify-end px-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.[0] || 'A'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/')}>
                  Back to App
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;