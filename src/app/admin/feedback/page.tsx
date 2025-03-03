'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechBackground from '@/components/TechBackground';
import PageTransition from '@/components/PageTransition';
import AdminFeedbackManagement from '@/components/AdminFeedbackManagement';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminFeedbackPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative">
        <TechBackground />
        <Header />
        
        <section className="pt-32 pb-20">
          <div className="container px-4 mx-auto">
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={() => router.push('/admin')}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            
            <motion.div 
              className="max-w-5xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
                <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                  Feedback
                </span>{" "}
                <span className="text-black dark:text-white">
                  Management
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Manage and respond to user feedback to improve the platform
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
                className="max-w-6xl mx-auto"
              >
                <AdminFeedbackManagement />
              </motion.div>
            )}
          </div>
        </section>
        
        <Footer />
      </main>
    </PageTransition>
  );
}