'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, HomeIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import TechBackground from '@/components/TechBackground';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUserData } = useAuth();
  
  const [message, setMessage] = useState('Processing your payment...');
  const [retryCount, setRetryCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const processSuccess = async () => {
      try {
        // Get session ID
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          setMessage('Missing session information. Please contact support if your account is not updated.');
          return;
        }
        
        // Check if already upgraded
        if (user?.plan === 'pro') {
          setMessage('Your account has been upgraded to Pro!');
          setIsComplete(true);
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push('/profile');
          }, 3000);
          return;
        }
        
        // Track if we've already been through multiple retries
        let retryAttempt = retryCount;
        
        // Refresh user data with retry logic
        const refreshWithRetry = async () => {
          // Stop if we've hit the limit or if we've completed
          if (retryAttempt >= 5 || isComplete) {
            return;
          }
          
          console.log(`Refreshing user data (attempt ${retryAttempt + 1})...`);
          await refreshUserData();
          retryAttempt++;
          setRetryCount(retryAttempt);
          
          // Check if user is now pro after refresh
          if (user?.plan === 'pro') {
            setMessage('Your account has been upgraded to Pro!');
            setIsComplete(true);
            
            // Redirect after a short delay
            setTimeout(() => {
              router.push('/profile');
            }, 3000);
            return;
          }
          
          // If we're at max retries, stop but don't redirect automatically
          if (retryAttempt >= 5) {
            setMessage('Payment processed! Your profile may take a minute to update.');
            return;
          }
          
          // Wait and try again with increasing delay
          setTimeout(refreshWithRetry, 1500 * retryAttempt);
        };
        
        // Start the refresh cycle
        refreshWithRetry();
      } catch (error) {
        console.error('Error processing success:', error);
        setMessage('There was an issue verifying your payment. Please try refreshing.');
      }
    };
    
    processSuccess();
  }, [searchParams, refreshUserData, router, user, retryCount, isComplete]);
  
  const handleManualRefresh = async () => {
    setMessage('Refreshing your account status...');
    await refreshUserData();
    
    if (user?.plan === 'pro') {
      setMessage('Your account has been upgraded to Pro!');
      setIsComplete(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } else {
      setMessage('Your account status hasn\'t updated yet. Please try again in a moment.');
    }
  };
  
  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative">
        <TechBackground />
        
        <div className="container px-4 mx-auto flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-md w-full bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-xl p-8 shadow-lg">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground">
                  {message}
                </p>
                {retryCount > 0 && retryCount < 5 && !isComplete && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Syncing account data ({retryCount}/5)...
                  </p>
                )}
                {(isComplete || retryCount >= 5) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Redirecting to your profile shortly...
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push('/profile')}
                  className="flex-1 gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                >
                  <HomeIcon className="h-4 w-4" />
                  Go to Profile
                </Button>
                
                {!isComplete && retryCount > 0 && (
                  <Button
                    onClick={handleManualRefresh}
                    variant="outline"
                    className="flex-1"
                  >
                    Refresh Status
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}