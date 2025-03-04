// app/api/collaborationApiSlice.ts
import { apiSlice } from './apiSlice';
import { CollaborationRequest, CollaborationResponse, UpdateRequestResponse } from '../types/collaborationTypes';

export const collaborationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit a new collaboration request
    submitCollaborationRequest: builder.mutation<CollaborationResponse, { projectId: string; role: string; message?: string }>({
      query: (data) => ({
        url: '/collaboration/request',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyRequests', 'PublishedProjects','IncomingRequests']
    }),
    
    // Get all requests made by the current user
    getMyCollaborationRequests: builder.query<{ success: boolean; requests: CollaborationRequest[] }, void>({
      query: () => ({
        url: '/my-requests',
        method: 'GET',
      }),
      providesTags: ['MyRequests']
    }),
    
    // Get all collaboration requests received for projects owned by the current user
    getIncomingCollaborationRequests: builder.query<{ success: boolean; requests: CollaborationRequest[] }, void>({
      query: () => ({
        url: '/incoming-requests',
        method: 'GET',
      }),
      providesTags: ['IncomingRequests']
    }),
    
    // Update the status of a collaboration request (accept/reject)
    updateCollaborationRequestStatus: builder.mutation<UpdateRequestResponse, { requestId: string; status: 'accepted' | 'rejected' }>({
      query: ({ requestId, status }) => ({
        url: `/request/${requestId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['IncomingRequests', 'MyRequests', 'MyProjects', 'PublishedProjects']
    }),
    
    // Get all projects the current user is collaborating on
    getMyCollaborations: builder.query<{ success: boolean; collaborations: any[] }, void>({
      query: () => ({
        url: '/my-collaborations',
        method: 'GET',
      }),
      providesTags: ['MyCollaborations']
    }),
  }),
});

export const {
  useSubmitCollaborationRequestMutation,
  useGetMyCollaborationRequestsQuery,
  useGetIncomingCollaborationRequestsQuery,
  useUpdateCollaborationRequestStatusMutation,
  useGetMyCollaborationsQuery,
} = collaborationApiSlice;