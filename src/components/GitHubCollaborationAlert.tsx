// src/components/GitHubCollaborationAlert.tsx
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Github, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface GitHubCollaborationAlertProps {
  projectOwner: string;
  repoUrl: string;
  isOwner: boolean;
}

const GitHubCollaborationAlert = ({ projectOwner, repoUrl, isOwner }: GitHubCollaborationAlertProps) => {
  // Only show this alert if the user is not the owner
  if (isOwner) return null;
  
  const handleCopyUsername = () => {
    navigator.clipboard.writeText(projectOwner);
    toast.success('Username copied to clipboard');
  };
  
  return (
    <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <Github className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="font-medium text-blue-800 dark:text-blue-300">GitHub Repository Access</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          To gain access to this GitHub repository, you need to be added as a collaborator by the project owner.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
            onClick={handleCopyUsername}
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Owner Username
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
            onClick={() => window.open(repoUrl, '_blank', 'noopener,noreferrer')}
          >
            <Github className="h-3.5 w-3.5" />
            Visit Repository
          </Button>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
          Share your GitHub username with the project owner and ask them to add you as a collaborator.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default GitHubCollaborationAlert;