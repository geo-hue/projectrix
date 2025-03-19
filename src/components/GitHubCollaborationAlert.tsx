import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Github } from 'lucide-react';

interface GitHubCollaborationAlertProps {
  repoUrl: string;
  isOwner: boolean;
}

const GitHubCollaborationAlert = ({ repoUrl, isOwner }: GitHubCollaborationAlertProps) => {
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    // Only show for non-owners
    if (isOwner) return;
    
    // Check if the alert has been seen before
    const alertKey = `github-alert-seen-${repoUrl}`;
    const hasSeenAlert = localStorage.getItem(alertKey);
    
    if (!hasSeenAlert) {
      setShowAlert(true);
      // Mark alert as seen
      localStorage.setItem(alertKey, 'true');
    }
  }, [isOwner, repoUrl]);
  
  // Don't render if owner or alert already seen
  if (isOwner || !showAlert) return null;
  
  return (
    <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 py-2">
      <Github className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="font-medium text-blue-800 dark:text-blue-300">GitHub Repository Access</AlertTitle>
      <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
        If you were not added automatically by the system, to gain access to this GitHub repository, you need to be added as a collaborator by the project owner.
        Share your GitHub username with the project owner and ask them to add you as a collaborator.
      </AlertDescription>
    </Alert>
  );
};

export default GitHubCollaborationAlert;