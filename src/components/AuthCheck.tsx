// src/components/AuthCheck.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

interface AuthCheckProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  showLoginButton?: boolean;
  redirectPath?: string;
}

/**
 * A component that conditionally renders content based on authentication status
 * with an enhanced, interactive authentication card
 * 
 * @param children - The content to display if the user is authenticated
 * @param fallbackMessage - Custom message to display if user is not authenticated
 * @param showLoginButton - Whether to display a login button (default: true)
 * @param redirectPath - Path to redirect after login (default: current page)
 */
const AuthCheck: React.FC<AuthCheckProps> = ({
  children,
  fallbackMessage = "You need to be logged in to view this content",
  showLoginButton = true,
  redirectPath
}) => {
  const { isAuthenticated, loading, login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login();
      // After login is successful, redirect if a path is provided
      if (redirectPath) {
        router.push(redirectPath);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div 
          className="h-16 w-16 animate-spin rounded-full border-4 border-current border-t-transparent text-primary"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        className="flex justify-center items-center min-h-[55vh] p-4"
      >
        <Card className="w-full max-w-md overflow-hidden shadow-2xl border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-tr-full transform translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
          
          <CardContent className="relative z-10 flex flex-col items-center justify-center p-8 space-y-6">
            {/* Animated Icon Container */}
            <motion.div 
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
              transition={{ 
                type: "spring", 
                stiffness: 300 
              }}
            >
              <Lock className="h-10 w-10 text-primary/80" />
            </motion.div>

            {/* Header and Description */}
            <div className="text-center space-y-3">
              <motion.h2 
                className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Secure Access Required
              </motion.h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                {fallbackMessage}
              </p>
            </div>
            
            {/* Login/Navigation Buttons */}
            <div className="w-full space-y-4">
              {showLoginButton ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleLogin}
                    className="w-full group relative overflow-hidden"
                    variant="outline"
                  >
                    <span className="absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <Github className="mr-2 h-5 w-5" />
                    Login with GitHub
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => router.push('/')}
                    className="w-full group relative overflow-hidden"
                    variant="outline"
                  >
                    <span className="absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Return to Home
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Additional Context */}
            <div className="flex items-center text-xs text-muted-foreground space-x-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Secure authentication powered by GitHub</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return <>{children}</>;
};

export default AuthCheck;