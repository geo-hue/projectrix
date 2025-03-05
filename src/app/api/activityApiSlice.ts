import { apiSlice } from './apiSlice';

export interface Activity {
  _id: string;
  userId: string;
  type: string;
  message: string;
  entityId?: string;
  entityType?: string;
  entityName?: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityListResponse {
  success: boolean;
  activities: Activity[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  unreadCount: number;
}

export interface MarkReadResponse {
  success: boolean;
  message: string;
}

export const activityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user activities with optional filtering and pagination
    getUserActivities: builder.query<
      ActivityListResponse,
      { page?: number; limit?: number; filter?: string }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.filter) queryParams.append('filter', params.filter);
        
        return {
          url: `/activities?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Activities'],
    }),
    
    // Get unread notifications count
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: '/activities/unread-count',
        method: 'GET',
      }),
      providesTags: ['UnreadCount'],
    }),
    
    // Mark a specific activity as read
    markActivityAsRead: builder.mutation<MarkReadResponse, string>({
      query: (activityId) => ({
        url: `/activities/${activityId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Activities', 'UnreadCount'],
    }),
    
    // Mark all activities as read
    markAllAsRead: builder.mutation<MarkReadResponse, void>({
      query: () => ({
        url: '/activities/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Activities', 'UnreadCount'],
    }),
    
    // Delete an activity
    deleteActivity: builder.mutation<MarkReadResponse, string>({
      query: (activityId) => ({
        url: `/activities/${activityId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Activities'],
    }),
  }),
});

export const {
  useGetUserActivitiesQuery,
  useGetUnreadCountQuery,
  useMarkActivityAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteActivityMutation,
} = activityApiSlice;