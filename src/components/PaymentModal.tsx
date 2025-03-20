'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePayment } from '@/app/hooks/usePayment';
import { Loader2, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const { 
    formattedPrice, 
    countryCode,
    isLoading, 
    processPayment 
  } = usePayment();
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber('');
      setPhoneError(null);
    }
  }, [isOpen]);
  
  // Validate phone number for all payments (now required for both NGN and USD)
  const validatePhoneNumber = (): boolean => {
    if (!phoneNumber.trim()) {
      setPhoneError('Phone number is required for payment processing');
      return false;
    }
    
    // Nigerian phone validation
    if (countryCode === 'NG') {
      if (!/^(0|\+?234)[789][01]\d{8}$/.test(phoneNumber.trim())) {
        setPhoneError('Please enter a valid Nigerian phone number');
        return false;
      }
    } else {
      // Simple international phone validation (must be at least 10 digits)
      if (!/^\+?[0-9]{10,15}$/.test(phoneNumber.trim().replace(/\s+/g, ''))) {
        setPhoneError('Please enter a valid phone number with country code');
        return false;
      }
    }
    
    setPhoneError(null);
    return true;
  };
  
  // Handle payment
  const handlePayment = async () => {
    if (!validatePhoneNumber()) {
      return;
    }
    
    await processPayment(phoneNumber);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-black border border-black/20 dark:border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            Unlock unlimited access to all premium features.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{formattedPrice}</div>
            <p className="text-sm text-muted-foreground">
              Monthly subscription • Cancel anytime
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Pro Plan Includes:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>10 project ideas</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Unlimited published projects</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Unlimited collaboration requests</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Advanced AI project enhancements</span>
              </li>
            </ul>
          </div>
          
          {/* Phone number field - required for all payments now */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number {countryCode === 'NG' ? '(Nigerian format)' : '(with country code)'}</Label>
            <Input
              id="phone"
              placeholder={countryCode === 'NG' ? 'e.g., 08012345678' : 'e.g., +1 234 567 8901'}
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (phoneError) setPhoneError(null);
              }}
            />
            {phoneError && (
              <p className="text-sm text-red-500">{phoneError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Required for payment verification
            </p>
          </div>
          
          {/* Payment method info */}
          <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              Payment will be processed via Flutterwave. {
                countryCode === 'NG' 
                  ? 'Pay with bank transfer, card, or USSD.'
                  : 'International payments supported with cards.'
              }
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Subscribe Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}