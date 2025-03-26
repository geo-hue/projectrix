import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Github, Info, X } from 'lucide-react';

interface GitHubCollaborationAlertProps {
  repoUrl: string;
  isOwner: boolean;
}

const GitHubCollaborationAlert = ({ repoUrl, isOwner }: GitHubCollaborationAlertProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
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
    <>
      {/* Mobile view - collapsed/expandable alert */}
      <div className="md:hidden mb-4">
        {!expanded ? (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                GitHub Repository Access
              </span>
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full"
              aria-label="Show details"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 py-2 pr-8 relative">
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-2 right-2 p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full"
              aria-label="Close alert"
            >
              <X className="h-4 w-4" />
            </button>
            <Github className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="font-medium text-blue-800 dark:text-blue-300">GitHub Repository Access</AlertTitle>
            <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
              If you were not added automatically by the system, to gain access to this GitHub repository, you need to be added as a collaborator by the project owner.
              Share your GitHub username with the project owner and ask them to add you as a collaborator.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Desktop view - regular alert */}
      <Alert className="hidden md:flex mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 py-2">
        <Github className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="font-medium text-blue-800 dark:text-blue-300">GitHub Repository Access</AlertTitle>
        <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
          If you were not added automatically by the system, to gain access to this GitHub repository, you need to be added as a collaborator by the project owner.
          Share your GitHub username with the project owner and ask them to add you as a collaborator.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default GitHubCollaborationAlert;