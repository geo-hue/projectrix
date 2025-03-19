import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Github, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGitHubAuth } from '@/app/hooks/useGitHubAuth';
import { 
  useCreateGitHubRepositoryMutation,
  useGetGitHubRepositoryStatusQuery
} from '@/app/api/githubApiSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import GitHubCollaborationAlert from './GitHubCollaborationAlert';

interface GitHubIntegrationProps {
  projectId: string;
  isOwner: boolean;
  projectOwnerName?: string; // Add project owner name
}

const GitHubIntegration = ({ projectId, isOwner, projectOwnerName = '' }: GitHubIntegrationProps) => {
  const [repoCreationStep, setRepoCreationStep] = useState<'initial' | 'confirm' | 'creating'>('initial');
  const { isAuthorized, authorizeGitHub, isAuthenticating } = useGitHubAuth();
  
  // API Hooks
  const [createRepository, { isLoading: isCreating }] = useCreateGitHubRepositoryMutation();
  const { 
    data: repoStatus, 
    isLoading: isCheckingRepo, 
    refetch: refetchRepoStatus 
  } = useGetGitHubRepositoryStatusQuery(projectId, { refetchOnMountOrArgChange: true });
  
  // Refresh repo status when component mounts or authorization changes
  useEffect(() => {
    if (isAuthorized && projectId) {
      refetchRepoStatus();
    }
  }, [isAuthorized, projectId, refetchRepoStatus]);
  
  // Button states for better UX
  const isLoading = isAuthenticating || isCreating || isCheckingRepo;
  const hasRepository = repoStatus?.hasRepository;
  
  // Handle GitHub authentication
  const handleGitHubAuth = async () => {
    try {
      await authorizeGitHub(projectId);
    } catch (error) {
      console.error('GitHub auth error:', error);
      toast.error('Failed to authorize with GitHub');
    }
  };
  
  // Handle repository creation
  const handleCreateRepository = async () => {
    try {
      setRepoCreationStep('creating');
      
      // Always create public repositories
      const result = await createRepository({ 
        projectId,
        preferences: {
          useOrganization: false, // Set to false to use personal account
          isPrivate: false // Always create public repos
        }
      }).unwrap();
      
      if (result.requiresAuth) {
        // Need GitHub authorization first
        handleGitHubAuth();
        setRepoCreationStep('initial');
        return;
      }
      
      if (result.success) {
        toast.success(`GitHub repository created successfully!`);
        refetchRepoStatus();
      } else {
        toast.error(result.message || 'Failed to create repository');
      }
      
      setRepoCreationStep('initial');
    } catch (error) {
      console.error('Repo creation error:', error);
      toast.error('Failed to create GitHub repository');
      setRepoCreationStep('initial');
    }
  };
  
  // Handle repository link click
  const handleRepoClick = () => {
    const repoUrl = repoStatus?.repository?.html_url;
    if (!repoUrl) {
      toast.error("Repository URL not found");
      return;
    }
    
    window.open(repoUrl, '_blank', 'noopener,noreferrer');
  };

  // Determine button state and text
  const getButtonState = () => {
    // Not owner - show view button if repo exists
    if (!isOwner) {
      if (!repoStatus?.hasRepository) {
        return { text: 'No GitHub Repository', disabled: true };
      }
      
      return { text: 'View GitHub Repository', disabled: false, action: 'view' };
    }
    
    // Owner - show setup/creation options
    if (!isAuthorized) {
      return { text: 'Connect GitHub', disabled: false, action: 'auth' };
    }
    
    if (hasRepository) {
      return { text: 'View GitHub Repository', disabled: false, action: 'view' };
    }
    
    if (repoCreationStep === 'confirm') {
      return { text: 'Confirm Repository Creation', disabled: false, action: 'confirm' };
    }
    
    return { text: 'Set Up GitHub Repository', disabled: false, action: 'setup' };
  };
  
  const buttonState = getButtonState();
  
  // Handle button click based on state
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (buttonState.action === 'auth') {
      handleGitHubAuth();
    } else if (buttonState.action === 'setup') {
      setRepoCreationStep('confirm');
    } else if (buttonState.action === 'confirm') {
      handleCreateRepository();
    } else if (buttonState.action === 'view') {
      handleRepoClick();
    }
  };
  
  return (
    <>
      {/* Show collaboration alert for non-owners when repository exists */}
      {!isOwner && hasRepository && (
        <GitHubCollaborationAlert 
          projectOwner={projectOwnerName}
          repoUrl={repoStatus?.repository?.html_url || ''}
          isOwner={isOwner}
        />
      )}
      
      <Button
        variant="outline"
        className="gap-2"
        disabled={buttonState.disabled || isLoading}
        onClick={handleButtonClick}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Github className="h-4 w-4" />
        )}
        {buttonState.text}
      </Button>

      {/* Dialog for GitHub repository creation confirmation */}
      <Dialog open={repoCreationStep === 'confirm'} onOpenChange={(open) => {
        if (!open) setRepoCreationStep('initial');
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create GitHub Repository</DialogTitle>
            <DialogDescription>
              A public GitHub repository will be created for this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-sm text-muted-foreground">
              <p>This will create a repository with:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>README with project details</li>
                <li>Appropriate .gitignore file</li>
                <li>CONTRIBUTING.md guidelines</li>
              </ul>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              <p className="font-medium text-foreground">Note about collaborators:</p>
              <p className="mt-1">You will need to manually add team members as collaborators to your GitHub repository.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRepoCreationStep('initial')}>
              Cancel
            </Button>
            <Button onClick={handleCreateRepository} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4 mr-2" />
                  Create Repository
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GitHubIntegration;