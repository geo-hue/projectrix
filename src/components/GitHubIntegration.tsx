import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  useCreateGitHubRepositoryMutation, 
  useGetGitHubRepositoryStatusQuery
} from '@/app/api/githubApiSlice';
import { Github, Loader2, Code } from 'lucide-react';
import { toast } from 'sonner';
import { useGitHubAuth } from '@/app/hooks/useGitHubAuth';

// Import dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GitHubIntegrationProps {
  projectId: string;
  isOwner?: boolean;
}

const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({ projectId, isOwner = false }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [useOrganization, setUseOrganization] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // API hooks
  const { isAuthorized, isAuthenticating, authorizeGitHub } = useGitHubAuth();
  const [createGitHubRepository, { isLoading: isCreatingRepo }] = useCreateGitHubRepositoryMutation();
  const { 
    data: repoStatus, 
    isLoading: isLoadingStatus, 
    refetch: refetchStatus 
  } = useGetGitHubRepositoryStatusQuery(projectId, { skip: !projectId });
  
  // Refresh repo status when component mounts or authorization changes
  useEffect(() => {
    if (isAuthorized && projectId) {
      refetchStatus();
    }
  }, [isAuthorized, projectId, refetchStatus]);
  
  const handleCreateRepository = async () => {
    setIsCreating(true);
    try {
      const preferences = {
        useOrganization,
        isPrivate
      };
      
      const result = await createGitHubRepository({ projectId, preferences }).unwrap();
      
      if (result.requiresAuth) {
        // Need GitHub authorization first
        authorizeGitHub(projectId);
        return;
      }
      
      if (result.success) {
        toast.success(result.message || 'Repository created successfully');
        setIsDialogOpen(false);
        refetchStatus();
      } else {
        toast.error(result.message || 'Failed to create repository');
      }
    } catch (error) {
      console.error('Error creating GitHub repository:', error);
      toast.error('Failed to create GitHub repository');
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleOpenRepo = () => {
    // Make sure we have a URL to open
    const repoUrl = repoStatus?.repository?.url || repoStatus?.repository?.html_url;
    console.log("Trying to open repository URL:", repoUrl);
    
    if (!repoUrl) {
      console.error("No repository URL found in:", repoStatus);
      toast.error("Repository URL not found");
      return;
    }
    
    // Try to open in a new window with required attributes for security
    const newWindow = window.open(repoUrl, '_blank');
    
    // If window.open failed or was blocked, try a different approach
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      console.log("window.open failed, trying location.href");
      // Create a temporary anchor element as a fallback
      const link = document.createElement('a');
      link.href = repoUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // If repository exists but data is still loading, show loading state
  if (isLoadingStatus) {
    return (
      <Button 
        variant="outline" 
        className="gap-2"
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }
  
  // If the repository already exists, show the "View on GitHub" button
  if (repoStatus?.hasRepository && (repoStatus?.repository?.url || repoStatus?.repository?.html_url)) {
    return (
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpenRepo();
        }}
      >
        <Github className="h-4 w-4" />
        View on GitHub
      </Button>
    );
  }
  
  // Only project owners can create repositories
  if (!isOwner) {
    return null;
  }
  
  return (
    <>
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={() => setIsDialogOpen(true)}
        disabled={isLoadingStatus || isAuthenticating}
      >
        {isLoadingStatus || isAuthenticating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Github className="h-4 w-4" />
        )}
        Set Up GitHub
      </Button>
      
      {/* GitHub repository creation dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create GitHub Repository</DialogTitle>
            <DialogDescription>
              Set up a GitHub repository for your project with initial structure and documentation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="private-repo" 
                checked={isPrivate} 
                onCheckedChange={(checked) => setIsPrivate(checked as boolean)} 
              />
              <Label htmlFor="private-repo">Private repository (recommended)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="use-org" 
                checked={useOrganization} 
                onCheckedChange={(checked) => setUseOrganization(checked as boolean)} 
              />
              <Label htmlFor="use-org">Create under Projectrix organization</Label>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-md text-sm">
              <p className="font-medium mb-2">This will create:</p>
              <ul className="space-y-1 list-disc pl-4">
                <li>Repository with project README</li>
                <li>Detailed role documentation</li>
                <li>Project board with issues</li>
                <li>Basic branch protection</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRepository}
              disabled={isCreating || isCreatingRepo}
              className="gap-2"
            >
              {isCreating || isCreatingRepo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Code className="h-4 w-4" />
              )}
              Create Repository
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GitHubIntegration;