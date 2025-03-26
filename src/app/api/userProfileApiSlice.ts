// app/api/userProfileApiSlice.ts
import { apiSlice } from './apiSlice';

export interface UserProfile {
  userId?: string;
  bio: string;
  skills: string[];
  website: string;
  githubProfile: string;
  twitterProfile: string;
  linkedinProfile: string;
  availability: string;
  hoursPerWeek: any;
  preferredTechnologies: string[];
  preferredRoles: string[];
  publicEmail: boolean;
  enhancementsLeft?: number; 
}

export interface PublicProfile {
  user: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
    email?: string;
    createdAt: string;
    enhancementsLeft?: number; 
  };
  profile: Partial<UserProfile>;
  stats: {
    projectsGenerated: number;
    projectsCollaborated: number;
    publishedProjects: number;
  };
  publishedProjects: any[];
}

export const userProfileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user's profile
    getUserProfile: builder.query<{ success: boolean; profile: UserProfile }, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['UserProfile']
    }),
    
    // Update current user's profile
    updateUserProfile: builder.mutation<{ success: boolean; message: string; profile: UserProfile }, Partial<UserProfile>>({
      query: (data) => ({
        url: '/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['UserProfile']
    }),
    
    // Get public profile for any user
    getPublicProfile: builder.query<{ success: boolean; publicProfile: PublicProfile }, string>({
      query: (username) => {
        // console.log('API query called with username:', username);
        // Don't make the request if username is undefined or empty
        if (!username) {
          throw new Error('Username is required');
        }
        return {
          url: `/profile/${encodeURIComponent(username)}`,
          method: 'GET',
        };
      },
      providesTags: ['PublicProfile']
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetPublicProfileQuery,
} = userProfileApiSlice;