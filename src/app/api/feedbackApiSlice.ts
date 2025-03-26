// src/app/api/feedbackApiSlice.ts
import { apiSlice } from './apiSlice';

export interface FeedbackItem {
  _id: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
  };
  category: 'bug' | 'feature' | 'improvement' | 'general';
  title: string;
  description: string;
  rating: number;
  status: 'pending' | 'under-review' | 'implemented' | 'declined';
  upvotes: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackSubmitRequest {
  category: 'bug' | 'feature' | 'improvement' | 'general';
  title: string;
  description: string;
  rating?: number;
  tags?: string[];
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  feedback: FeedbackItem;
}

export interface FeedbackListResponse {
  success: boolean;
  count: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  feedback: FeedbackItem[];
}

export interface UpvoteResponse {
  success: boolean;
  message: string;
  upvoteCount: number;
  isUpvoted: boolean;
}

export const feedbackApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit new feedback
    submitFeedback: builder.mutation<FeedbackResponse, FeedbackSubmitRequest>({
      query: (data) => ({
        url: '/feedback/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyFeedback'],
    }),

    // Get my feedback
    getMyFeedback: builder.query<FeedbackListResponse, void>({
      query: () => ({
        url: '/feedback/my-feedback',
        method: 'GET',
      }),
      providesTags: ['MyFeedback'],
    }),

    // Get public feedback with optional filtering
    getPublicFeedback: builder.query<
  FeedbackListResponse,
  {
    category?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }
>({
  query: (params) => {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    return {
      url: `/feedback/public?${queryParams.toString()}`,
      method: 'GET',
    };
  },
  providesTags: ['PublicFeedback'],
}),

    // Upvote feedback
    upvoteFeedback: builder.mutation<UpvoteResponse, string>({
      query: (feedbackId) => ({
        url: `/feedback/${feedbackId}/upvote`,
        method: 'POST',
      }),
      // Optimistic update for upvote
      async onQueryStarted(feedbackId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Update public feedback cache
          dispatch(
            feedbackApiSlice.util.updateQueryData(
              'getPublicFeedback',
              {},
              (draft) => {
                const feedback = draft.feedback.find((f) => f._id === feedbackId);
                if (feedback) {
                  if (data.isUpvoted) {
                    // Add upvote
                    if (!feedback.upvotes.includes(feedbackId)) {
                      feedback.upvotes.push(feedbackId);
                    }
                  } else {
                    // Remove upvote
                    feedback.upvotes = feedback.upvotes.filter(
                      (id) => id !== feedbackId
                    );
                  }
                }
              }
            )
          );
        } catch {}
      },
      invalidatesTags: ['PublicFeedback', 'MyFeedback'],
    }),

    // Admin endpoints
    getAllFeedback: builder.query<
      FeedbackListResponse,
      {
        category?: string;
        status?: string;
        sort?: string;
        order?: 'asc' | 'desc';
      }
    >({
      query: (params) => {
        // Build query string
        const queryParams = new URLSearchParams();
        if (params.category) queryParams.append('category', params.category);
        if (params.status) queryParams.append('status', params.status);
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.order) queryParams.append('order', params.order);

        return {
          url: `/feedback/admin/all?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['AdminFeedback'],
    }),

    // Update feedback status (admin only)
    updateFeedbackStatus: builder.mutation<
      FeedbackResponse,
      { feedbackId: string; status: 'pending' | 'under-review' | 'implemented' | 'declined' }
    >({
      query: ({ feedbackId, status }) => ({
        url: `/feedback/admin/${feedbackId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['AdminFeedback', 'PublicFeedback', 'MyFeedback'],
    }),
  }),
});

export const {
  useSubmitFeedbackMutation,
  useGetMyFeedbackQuery,
  useGetPublicFeedbackQuery,
  useUpvoteFeedbackMutation,
  useGetAllFeedbackQuery,
  useUpdateFeedbackStatusMutation,
} = feedbackApiSlice;