import { useState, useEffect } from 'react';
import { 
  useCheckGitHubAuthStatusQuery,
  useRevokeGitHubAuthMutation,
  useLazyInitiateGitHubAuthQuery 
} from '../api/githubApiSlice';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Hook for managing GitHub authorization state and actions
 */
export function useGitHubAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current GitHub auth status
  const { 
    data: authStatus, 
    isLoading: isCheckingAuth,
    refetch: refetchAuthStatus 
  } = useCheckGitHubAuthStatusQuery();
  
  // API hooks
  const [initiateAuth] = useLazyInitiateGitHubAuthQuery();
  const [revokeAuth, { isLoading: isRevoking }] = useRevokeGitHubAuthMutation();
  
  // Determine if user is authorized with GitHub
  const isAuthorized = authStatus?.isAuthorized || false;
  
  // Check for GitHub callback results on component mount
  useEffect(() => {
    const githubStatus = searchParams.get('github');
    
    if (githubStatus === 'success') {
      toast.success('GitHub authorization successful');
      refetchAuthStatus();
      
      // Remove query parameters from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('github');
      router.replace(url.pathname);
    } else if (githubStatus === 'error') {
      toast.error('GitHub authorization failed');
      
      // Remove query parameters from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('github');
      router.replace(url.pathname);
    }
  }, [searchParams, refetchAuthStatus, router]);
  
  /**
   * Initiate GitHub authorization process for a project
   */
  const authorizeGitHub = async (projectId: string) => {
    try {
      setIsAuthenticating(true);
      const result = await initiateAuth(projectId).unwrap();
      
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        toast.error(result.message || 'Failed to initiate GitHub authorization');
      }
    } catch (error) {
      console.error('GitHub authorization error:', error);
      toast.error('Failed to initiate GitHub authorization');
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  /**
   * Revoke GitHub authorization
   */
  const revokeGitHubAuth = async () => {
    try {
      const result = await revokeAuth().unwrap();
      toast.success(result.message || 'GitHub authorization revoked');
      refetchAuthStatus();
    } catch (error) {
      console.error('Error revoking GitHub authorization:', error);
      toast.error('Failed to revoke GitHub authorization');
    }
  };
  
  return {
    isAuthorized,
    isAuthenticating: isAuthenticating || isCheckingAuth,
    isRevoking,
    authorizeGitHub,
    revokeGitHubAuth,
    refetchAuthStatus
  }
}