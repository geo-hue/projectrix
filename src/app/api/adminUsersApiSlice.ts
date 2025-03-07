// src/app/api/adminUsersApiSlice.ts
import { apiSlice } from './apiSlice';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  githubId: string;
  username: string;
  role: string;
  plan: string;
  skills: string[];
  projectsGenerated: number;
  projectsCollaborated: number;
  publishedProjectsCount: number;
  projectIdeasLeft: number;
  collaborationRequestsLeft: number;
  planExpiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  totalUsers: number;
  count: number;
  totalPages: number;
  currentPage: number;
  users: User[];
}

export interface UserResponse {
  success: boolean;
  user: User;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface UserRoleUpdate {
  userId: string;
  role: 'user' | 'admin';
}

export interface UserPlanUpdate {
  userId: string;
  plan: 'free' | 'pro';
}

export const adminUsersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with filtering, sorting, and pagination
    getUsers: builder.query<
      UsersResponse,
      {
        search?: string;
        role?: string;
        plan?: string;
        sort?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => {
        // Build query string
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.role) queryParams.append('role', params.role);
        if (params.plan) queryParams.append('plan', params.plan);
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        return {
          url: `/admin/users?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['AdminUsers'],
    }),

    // Get user by ID
    getUserById: builder.query<UserResponse, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'AdminUsers', id }],
    }),

    // Update user role
    updateUserRole: builder.mutation<UserResponse, UserRoleUpdate>({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['AdminUsers'],
    }),

    // Update user plan
    updateUserPlan: builder.mutation<UserResponse, UserPlanUpdate>({
      query: ({ userId, plan }) => ({
        url: `/admin/users/${userId}/plan`,
        method: 'PATCH',
        body: { plan },
      }),
      invalidatesTags: ['AdminUsers'],
    }),

    // Delete user
    deleteUser: builder.mutation<MessageResponse, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers'],
    }),

    // Refresh user limits
    refreshUserLimits: builder.mutation<UserResponse, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}/refresh-limits`,
        method: 'POST',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useUpdateUserPlanMutation,
  useDeleteUserMutation,
  useRefreshUserLimitsMutation,
} = adminUsersApiSlice;