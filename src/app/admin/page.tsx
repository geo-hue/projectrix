'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechBackground from '@/components/TechBackground';
import PageTransition from '@/components/PageTransition';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
  ShieldAlert, 
  MessageSquare, 
  Users, 
  BarChart4, 
  Settings, 
  Code2,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Admin modules
  const adminModules = [
    {
      title: 'Feedback Management',
      description: 'Review and respond to user feedback and feature requests',
      icon: MessageSquare,
      href: '/admin/feedback',
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
      title: 'Analytics Dashboard',
      description: 'View platform usage metrics and statistics',
      icon: BarChart4,
      href: '/admin/analytics',
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
  
  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative">
        <TechBackground />
        <Header />
        
        <section className="pt-32 pb-20">
          <div className="container px-4 mx-auto">
            <motion.div 
              className="max-w-5xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
                <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                  Admin
                </span>{" "}
                <span className="text-black dark:text-white">
                  Dashboard
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Manage and monitor all aspects of the Projectrix platform
              </p>
            </motion.div>
            
            {!isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-md mx-auto"
              >
                <Card className="border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <ShieldAlert className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                    <p className="text-muted-foreground mb-6 text-center">
                      Please login to access the admin dashboard.
                    </p>
                    <Button 
                      onClick={() => router.push('/')}
                      className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                    >
                      Return to Home
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : !isAdmin ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-md mx-auto"
              >
                <Card className="border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <ShieldAlert className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
                    <p className="text-muted-foreground mb-6 text-center">
                      You do not have permission to access the admin dashboard.
                    </p>
                    <Button 
                      onClick={() => router.push('/')}
                      className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                    >
                      Return to Home
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-5xl mx-auto"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminModules.map((module, index) => (
                    <motion.div
                      key={module.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                      className="group relative"
                    >
                      {/* Background shadow */}
                      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                      
                      <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 h-full flex flex-col">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${module.color}-100 dark:bg-${module.color}-900/20`}>
                              <module.icon className={`h-5 w-5 text-${module.color}-500`} />
                            </div>
                            <CardTitle>{module.title}</CardTitle>
                          </div>
                          <CardDescription>{module.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto pt-6">
                          <Button 
                            className="w-full gap-2 justify-between bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                            onClick={() => router.push(module.href)}
                          >
                            <span>Access Module</span> 
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
        
        <Footer />
      </main>
    </PageTransition>
  );
}