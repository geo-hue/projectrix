import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExternalLink, Sparkles } from "lucide-react";
import RoleSelectionDialog from './RoleSelectionDialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface PublishConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedRole?: string) => void;
  projectTitle: string;
  project: any;
}

const PublishConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  projectTitle,
  project
}: PublishConfirmationDialogProps) => {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  // Check if pricing is enabled from environment variable
  const isPricingEnabled = process.env.NEXT_PUBLIC_PRICING_ENABLED === 'true';
  
  // Only check publishing limits if pricing is enabled
  const canPublish = !isPricingEnabled || user?.plan === 'pro' || (user?.publishedProjectsCount || 0) < 1;
  
  const handleConfirmPublish = () => {
    // If pricing is enabled and user cannot publish (free user who already published a project)
    if (isPricingEnabled && !canPublish) {
      // Close the dialog
      onClose();
      
      // Show upgrade toast message
      toast.error(
        <div className="flex flex-col">
          <span className="font-medium">Publishing limit reached</span>
          <span className="text-sm">Free users can only publish 1 project. Upgrade to Pro for unlimited publishing.</span>
        </div>,
        {
          action: {
            label: 'Upgrade',
            onClick: () => router.push('/pricing')
          },
          duration: 5000
        }
      );
      return;
    }
    
    // Continue with normal flow if can publish
    if (project?.teamStructure?.roles && project.teamStructure.roles.length > 0) {
      setShowRoleSelection(true);
    } else {
      // If no roles defined, just publish without role selection
      onConfirm();
    }
  };

  const handleRoleSelected = async (selectedRole: string) => {
    try {
      await onConfirm(selectedRole);
    } catch (error) {
      toast.error( error.data?.message||'Failed to publish project. Please try again.');
    }
  };

  return (
    <>
      <AlertDialog open={isOpen && !showRoleSelection} onOpenChange={onClose}>
        <AlertDialogContent className="bg-white dark:bg-black border border-black/20 dark:border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Publish Project
            </AlertDialogTitle>
            <AlertDialogDescription>
              {canPublish ? (
                <>
                  Are you sure you want to publish <span className="font-medium text-foreground">{projectTitle}</span>? 
                  <p className="mt-2">
                    Publishing will make this project visible to the public and <span className="font-bold text-foreground">this action cannot be undone</span>.
                  </p>
                </>
              ) : (
                // This pricing UI only shows if pricing is enabled and user hit limits
                <div className="space-y-2">
                  <p className="text-red-500 dark:text-red-400 font-medium">Publishing limit reached</p>
                  <p>
                    Free users can only publish 1 project. Upgrade to Pro for unlimited project publishing 
                    and other premium features.
                  </p>
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-md mt-2 flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Pro plan benefits:</p>
                      <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1 space-y-1">
                        <li>Unlimited published projects</li>
                        <li>Unlimited active collaborations</li>
                        <li>Project editing capabilities</li>
                        <li>Unlimited project ideas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_0_rgba(255,255,255,0.2)] transform transition-all active:translate-y-1 active:shadow-none"
            >
              Cancel
            </AlertDialogCancel>
            {canPublish ? (
              <AlertDialogAction 
                onClick={handleConfirmPublish}
                className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
              >
                Yes, Continue
              </AlertDialogAction>
            ) : (
              <AlertDialogAction 
                onClick={() => {
                  onClose();
                  router.push('/pricing');
                }}
                className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-[0_4px_0_0_rgba(37,99,235,1)] transform transition-all active:translate-y-1 active:shadow-none"
              >
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {project && (
        <RoleSelectionDialog
          isOpen={showRoleSelection}
          onClose={() => {
            setShowRoleSelection(false);
            onClose();
          }}
          onConfirm={handleRoleSelected}
          projectTitle={projectTitle}
          roles={project?.teamStructure?.roles || []}
        />
      )}
    </>
  );
};

export default PublishConfirmationDialog;