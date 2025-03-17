import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Github, Loader2, UserPlus, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useGitHubAuth } from '@/app/hooks/useGitHubAuth';
import { 
  useCreateGitHubRepositoryMutation,
  useGetGitHubRepositoryStatusQuery,
  useGetGitHubInvitationStatusQuery
} from '@/app/api/githubApiSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GitHubIntegrationProps {
  projectId: string;
  isOwner: boolean;
}

const GitHubIntegration = ({ projectId, isOwner }: GitHubIntegrationProps) => {
  const [repoCreationStep, setRepoCreationStep] = useState<'initial' | 'confirm' | 'creating'>('initial');
  const [joinRepoDialog, setJoinRepoDialog] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const { isAuthorized, authorizeGitHub, isAuthenticating } = useGitHubAuth();
  
  // API Hooks
  const [createRepository, { isLoading: isCreating }] = useCreateGitHubRepositoryMutation();
  const { 
    data: repoStatus, 
    isLoading: isCheckingRepo, 
    refetch: refetchRepoStatus 
  } = useGetGitHubRepositoryStatusQuery(projectId, { refetchOnMountOrArgChange: true });
  
  const { 
    data: invitationStatus, 
    isLoading: isCheckingInvitation 
  } = useGetGitHubInvitationStatusQuery(projectId, { 
    skip: !repoStatus?.hasRepository || isOwner 
  });
  
  // Refresh repo status when component mounts or authorization changes
  useEffect(() => {
    if (isAuthorized && projectId) {
      refetchRepoStatus();
    }
  }, [isAuthorized, projectId, refetchRepoStatus]);
  
  // Button states for better UX
  const isLoading = isAuthenticating || isCreating || isCheckingRepo || isCheckingInvitation;
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
          useOrganization: false, // Always use personal account
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
        toast.success('GitHub repository created successfully!');
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
  
  // Handle invitation page open
  const handleOpenInvitations = () => {
    window.open('https://github.com/settings/organizations', '_blank', 'noopener,noreferrer');
  };

  // Handle manual join of repository
  const handleSubmitJoinRepo = () => {
    if (!githubUsername.trim()) {
      toast.error("Please enter your GitHub username");
      return;
    }

    const repoUrl = repoStatus?.repository?.html_url;
    if (!repoUrl) {
      toast.error("Repository URL not found");
      return;
    }

    // Open the repository's fork/contribute page
    window.open(`${repoUrl}`, '_blank', 'noopener,noreferrer');

    toast.success(`Please request to be added as a collaborator using your GitHub username: ${githubUsername}`);
    setJoinRepoDialog(false);
  };
  
  // Determine button state and text
  const getButtonState = () => {
    // Not owner - show invitation status
    if (!isOwner) {
      if (!repoStatus?.hasRepository) {
        return { text: 'No GitHub Repository', disabled: true };
      }
      
      if (isCheckingInvitation) {
        return { text: 'Checking GitHub Access...', disabled: true };
      }
      
      if (invitationStatus?.status === 'pending') {
        return { text: 'Accept GitHub Invitation', disabled: false, action: 'invitation' };
      }
      
      if (invitationStatus?.status === 'accepted') {
        return { text: 'View GitHub Repository', disabled: false, action: 'view' };
      }
      
      // NEW: Join Repository option as a fallback
      return { text: 'Join GitHub Repository', disabled: false, action: 'join' };
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
    } else if (buttonState.action === 'invitation') {
      handleOpenInvitations();
    } else if (buttonState.action === 'join') {
      setJoinRepoDialog(true);
    }
  };
  
  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        disabled={buttonState.disabled || isLoading}
        onClick={handleButtonClick}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : buttonState.action === 'join' ? (
          <UserPlus className="h-4 w-4" />
        ) : (
          <Github className="h-4 w-4" />
        )}
        {buttonState.text}
      </Button>

      {/* Dialog for manual GitHub repository joining */}
      <Dialog open={joinRepoDialog} onOpenChange={setJoinRepoDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join GitHub Repository</DialogTitle>
            <DialogDescription>
              Enter your GitHub username to request access to this repository.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="github-username">GitHub Username</Label>
              <Input 
                id="github-username" 
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. octocat"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              After submission, you will be redirected to the repository where you can request collaborator access.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJoinRepoDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitJoinRepo}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Go to Repository
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GitHubIntegration;