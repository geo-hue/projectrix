'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { usePayment } from '@/app/hooks/usePayment';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, HomeIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import TechBackground from '@/components/TechBackground';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUserData } = useAuth();
  const { verifyFlutterwavePayment } = usePayment();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your payment...');
  
  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get query parameters
        const transactionId = searchParams.get('transaction_id');
        const status = searchParams.get('status');
        
        // Handle Flutterwave callback
        if (transactionId && status === 'successful') {
          // Verify the payment with the backend
          await verifyFlutterwavePayment(transactionId);
          
          // Refresh user data to update subscription status
          await refreshUserData();
          
          // Show success state
          setStatus('success');
          setMessage('Payment successful! Your account has been upgraded to Pro.');
        } else if (status === 'cancelled') {
          // Handle cancelled payment
          setStatus('error');
          setMessage('Payment was cancelled. Please try again if you wish to upgrade.');
        } else {
          // Handle other errors
          setStatus('error');
          setMessage('Payment verification failed. Please contact support if funds were deducted.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your payment. Please contact support.');
      }
    };
    
    processCallback();
  }, [searchParams, verifyFlutterwavePayment, refreshUserData]);
  
  // Redirect to home after a delay on success
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.push('/profile');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [status, router]);
  
  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative">
        <TechBackground />
        
        <div className="container px-4 mx-auto flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-md w-full bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-xl p-8 shadow-lg">
            <div className="text-center space-y-6">
              {/* Status Icon */}
              <div className="flex justify-center">
                {status === 'loading' && (
                  <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                  </div>
                )}
                
                {status === 'success' && (
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-red-500" />
                  </div>
                )}
              </div>
              
              {/* Status Message */}
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {status === 'loading' && 'Processing Payment'}
                  {status === 'success' && 'Payment Successful!'}
                  {status === 'error' && 'Payment Failed'}
                </h1>
                
                <p className="text-muted-foreground">
                  {message}
                </p>
                
                {status === 'success' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Redirecting you to your profile in a few seconds...
                  </p>
                )}
              </div>
              
              {/* Actions */}
              <div className="pt-4">
                {status !== 'loading' && (
                  <Button
                    onClick={() => router.push('/profile')}
                    className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                  >
                    <HomeIcon className="h-4 w-4" />
                    Go to Profile
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