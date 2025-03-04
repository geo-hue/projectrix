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
import { ExternalLink } from "lucide-react";
import RoleSelectionDialog from './RoleSelectionDialog';

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
  
  const handleConfirmPublish = () => {
    if (project?.teamStructure?.roles && project.teamStructure.roles.length > 0) {
      setShowRoleSelection(true);
    } else {
      // If no roles defined, just publish without role selection
      onConfirm();
    }
  };

  const handleRoleSelected = async (selectedRole: string) => {
    onConfirm(selectedRole);
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
              Are you sure you want to publish <span className="font-medium text-foreground">{projectTitle}</span>? 
              <p className="mt-2">
                Publishing will make this project visible to the public and <span className="font-bold text-foreground">this action cannot be undone</span>.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_0_rgba(255,255,255,0.2)] transform transition-all active:translate-y-1 active:shadow-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmPublish}
              className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
            >
              Yes, Continue
            </AlertDialogAction>
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