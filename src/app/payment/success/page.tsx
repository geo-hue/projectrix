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
  const { refreshUserData } = useAuth();
  
  const [message, setMessage] = useState('Processing your payment...');
  
  useEffect(() => {
    const processSuccess = async () => {
      try {
        // Get session ID
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          setMessage('Missing session information. Please contact support if your account is not updated.');
          return;
        }
        
        // No need to verify here, the webhook should handle it
        
        // Refresh user data to update subscription status
        await refreshUserData();
        
        // Show success message
        setMessage('Payment successful! Your account has been upgraded to Pro.');
        
        // Redirect after a delay
        setTimeout(() => {
          router.push('/profile');
        }, 3000);
      } catch (error) {
        console.error('Error processing success:', error);
        setMessage('There was an issue verifying your payment. Please contact support if your account is not updated.');
      }
    };
    
    processSuccess();
  }, [searchParams, refreshUserData, router]);
  
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
                <p className="text-sm text-muted-foreground mt-2">
                  Redirecting you to your profile in a few seconds...
                </p>
              </div>
              
              <Button
                onClick={() => router.push('/profile')}
                className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
              >
                <HomeIcon className="h-4 w-4" />
                Go to Profile
              </Button>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}