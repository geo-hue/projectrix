import { apiSlice } from './apiSlice';
import { Message, Conversation } from '../types/messageTypes';

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Send a message to another user
    sendMessage: builder.mutation<{ success: boolean; message: string; data: Message }, { receiverId: string; content: string }>({
      query: (data) => ({
        url: '/message/send',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Conversation', id: arg.receiverId },
        'Conversations'
      ]
    }),
    
    // Get conversation with a specific user
    getConversation: builder.query<{ success: boolean; messages: Message[] }, string>({
      query: (userId) => ({
        url: `/message/conversation/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, userId) => [{ type: 'Conversation', id: userId }]
    }),
    
    // Get all conversations for the current user
    getConversations: builder.query<{ success: boolean; conversations: Conversation[] }, void>({
      query: () => ({
        url: '/message/conversations',
        method: 'GET',
      }),
      providesTags: ['Conversations']
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetConversationQuery,
  useGetConversationsQuery,
} = messageApiSlice;
