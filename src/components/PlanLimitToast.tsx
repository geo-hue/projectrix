'use client';

import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Types of limit messages
export enum LimitType {
  PUBLISH = 'publish',
  COLLABORATION_REQUEST = 'collaboration_request',
  ACTIVE_COLLABORATION = 'active_collaboration',
  PROJECT_EDIT = 'project_edit',
  PROJECT_GENERATION = 'project_generation'
}

// Function to handle limit-related errors from API responses
export const handlePlanLimitError = (error: any, type: LimitType) => {
  // Check if it's a limit-related error
  const statusCode = error.status || error.response?.status;
  const errorMessage = error.data?.message || error.message || "An error occurred";
  
  if (statusCode === 403 && (
    errorMessage.includes('limit') || 
    errorMessage.includes('Limit') ||
    errorMessage.includes('upgrade to Pro')
  )) {
    // This is a plan limit error, show special toast
    showPlanLimitToast(errorMessage, type);
    return true;
  }
  
  // Not a plan limit error
  return false;
};

// Function to show the custom toast with upgrade button
export const showPlanLimitToast = (message: string, type: LimitType) => {
  toast.custom((t) => (
    <div className={`${
      t.visible ? 'animate-enter' : 'animate-leave'
    } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-red-100 dark:border-red-900`}>
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Plan Limit Reached
            </p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200 dark:border-gray-700">
        <UpgradeButton type={type} />
      </div>
    </div>
  ), {
    duration: 8000,
    position: 'top-center'
  });
};

// Component for the upgrade button
const UpgradeButton = ({ type }: { type: LimitType }) => {
  const router = useRouter();
  
  // Customize button text based on limit type
  const getButtonText = () => {
    switch (type) {
      case LimitType.PUBLISH:
        return 'Publish More';
      case LimitType.COLLABORATION_REQUEST:
        return 'Unlock Collaborations';
      case LimitType.ACTIVE_COLLABORATION:
        return 'Collaborate More';
      case LimitType.PROJECT_EDIT:
        return 'Enable Editing';
      case LimitType.PROJECT_GENERATION:
        return 'Generate More';
      default:
        return 'Upgrade to Pro';
    }
  };
  
  return (
    <Button
      variant="ghost"
      className="flex text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-4 py-6 items-center justify-center gap-2 cursor-pointer"
      onClick={() => router.push('/pricing')}
    >
      <Sparkles className="h-4 w-4" />
      {getButtonText()}
    </Button>
  );
};