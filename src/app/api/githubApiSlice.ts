import { apiSlice } from './apiSlice';
import { GitHubRepository, GitHubRepoPreferences } from '../types/githubType';

export interface GitHubAuthResponse {
  success: boolean;
  redirectUrl?: string;
  message?: string;
}

export interface GitHubRepoResponse {
  success: boolean;
  repository?: GitHubRepository;
  requiresAuth?: boolean;
  hasRepository?: boolean;
  message?: string;
}

export interface GitHubAuthStatusResponse {
  success: boolean;
  isAuthorized: boolean;
}

export interface GitHubRevokeResponse {
  success: boolean;
  message: string;
}

export interface GitHubInvitationStatusResponse {
  success: boolean;
  status: 'none' | 'pending' | 'accepted';
}

export const githubApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Initiate GitHub OAuth flow
    initiateGitHubAuth: builder.query<GitHubAuthResponse, string>({
      query: (projectId) => ({
        url: `/github/auth?projectId=${projectId}`,
        method: 'GET',
      }),
    }),
    
    // Check GitHub auth status
    checkGitHubAuthStatus: builder.query<GitHubAuthStatusResponse, void>({
      query: () => ({
        url: '/github/auth-status',
        method: 'GET',
      }),
    }),
    
    // Revoke GitHub authorization
    revokeGitHubAuth: builder.mutation<GitHubRevokeResponse, void>({
      query: () => ({
        url: '/github/revoke-auth',
        method: 'POST',
      }),
    }),
    
    // Create GitHub repository for a project
    createGitHubRepository: builder.mutation<
      GitHubRepoResponse, 
      { projectId: string; preferences: GitHubRepoPreferences }
    >({
      query: ({ projectId, preferences }) => ({
        url: `/github/repository/${projectId}`,
        method: 'POST',
        body: preferences,
      }),
      invalidatesTags: (result) => 
        result?.success ? [
          'Projects', 
          { type: 'Projects', id: result.repository?.name },
          { type: 'GitHubInvitation', id: 'LIST' }
        ] : [],
    }),
    
    // Get GitHub repository status
    getGitHubRepositoryStatus: builder.query<GitHubRepoResponse, string>({
      query: (projectId) => ({
        url: `/github/repository/${projectId}`,
        method: 'GET',
      }),
      providesTags: (result, error, projectId) => 
        [{ type: 'Projects', id: projectId }],
    }),
    
    // Get GitHub invitation status
    getGitHubInvitationStatus: builder.query<GitHubInvitationStatusResponse, string>({
      query: (projectId) => ({
        url: `/github/invitation-status/${projectId}`,
        method: 'GET',
      }),
      providesTags: (result, error, projectId) => [
        { type: 'GitHubInvitation', id: projectId },
        { type: 'GitHubInvitation', id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useLazyInitiateGitHubAuthQuery,
  useCheckGitHubAuthStatusQuery,
  useRevokeGitHubAuthMutation,
  useCreateGitHubRepositoryMutation,
  useGetGitHubRepositoryStatusQuery,
  useGetGitHubInvitationStatusQuery,
} = githubApiSlice;