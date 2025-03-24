'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRedeemPromoCodeMutation } from '@/app/api/promoCodeApiSlice';
import { toast } from 'sonner';
import { Gift, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';

export default function RedeemPromoCode() {
  const [promoCode, setPromoCode] = useState('');
  const [redeemPromoCode, { isLoading }] = useRedeemPromoCodeMutation();
  const { user, refreshUserData } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    
    try {
      const result = await redeemPromoCode({ code: promoCode }).unwrap();
      
      // Show success toast
      toast.success(result.message);
      
      // Clear input
      setPromoCode('');
      
      // Refresh user data to update UI with new plan
      await refreshUserData();
      
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to redeem promo code');
    }
  };

  // Don't show for Pro users
  if (user?.plan === 'pro') {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="group relative">
        {/* Background shadow element */}
        <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
        
        <Card className="relative overflow-hidden bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
          {/* Add decorative blue gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-600/5 to-blue-400/5 dark:from-blue-700/5 dark:to-blue-400/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-400/5 to-blue-600/5 dark:from-blue-400/5 dark:to-blue-700/5 rounded-full blur-2xl"></div>
          </div>
          
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Redeem Promo Code</CardTitle>
                <CardDescription>
                  Enter your promo code to unlock Pro features
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promo-code" className="text-sm font-medium">
                  Promo Code
                </Label>
                <div className="relative">
                  <Input
                    id="promo-code"
                    placeholder="Enter your promo code (e.g., LAUNCH-ABC123)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="pr-10 border-2 border-black/10 dark:border-white/10 bg-transparent focus-visible:ring-primary"
                    disabled={isLoading}
                  />
                  <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/50" />
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none relative z-10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redeeming...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Unlock Pro Access
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground px-4">
              Promo codes are case-insensitive and typically follow the format LAUNCH-XXXXXX
            </p>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}