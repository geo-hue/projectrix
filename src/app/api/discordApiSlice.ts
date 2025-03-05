// app/api/discordApiSlice.ts
import { apiSlice } from './apiSlice';

export interface DiscordResponse {
  success: boolean;
  message?: string;
  inviteLink: string;
}

export const discordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create Discord channel for a project
    createDiscordChannel: builder.mutation<DiscordResponse, string>({
      query: (projectId) => ({
        url: `/discord/channel/${projectId}`,
        method: 'POST',
      }),
    }),
    
    // Get Discord invite link for a project
    getDiscordInvite: builder.query<DiscordResponse, string>({
      query: (projectId) => ({
        url: `/discord/invite/${projectId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateDiscordChannelMutation,
  useGetDiscordInviteQuery,
} = discordApiSlice;