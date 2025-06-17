import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useCreateDiscordChannelMutation, useInitDiscordOAuthMutation } from '@/app/api/discordApiSlice';
import { ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

interface DiscordIntegrationProps {
  projectId: string;
}

const DiscordIntegration: React.FC<DiscordIntegrationProps> = ({ projectId }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [createDiscordChannel] = useCreateDiscordChannelMutation();
  const [initDiscordOAuth] = useInitDiscordOAuthMutation();
  const searchParams = useSearchParams();
  
  // Check for Discord callback results
  useEffect(() => {
    const discordStatus = searchParams.get('discord');
    const inviteLink = searchParams.get('invite');
    
    if (discordStatus === 'success') {
      setIsConnected(true);
      toast.success('Successfully connected Discord account');
    } else if (discordStatus === 'invite') {
      setIsConnected(true);
      toast.info('Please use this invite link to join the Discord server first');
      if (inviteLink) {
        window.open(decodeURIComponent(inviteLink), '_blank');
      }
    } else if (discordStatus === 'error') {
      toast.error('Failed to connect Discord account');
    }
    
    // Remove query parameters from URL
    if (discordStatus) {
      const url = new URL(window.location.href);
      url.searchParams.delete('discord');
      url.searchParams.delete('invite');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);
  
  // We can also check if the user already has Discord connected through an API call
  // or localStorage for a more persistent check across page reloads
  useEffect(() => {
    // Check if we have a record of the user connecting Discord before
    const discordConnected = localStorage.getItem(`discord_connected_${projectId}`);
    console.log('Checking localStorage for Discord connection:', `discord_connected_${projectId}`, '=', discordConnected);
    if (discordConnected === 'true') {
      setIsConnected(true);
      console.log('Set isConnected to true from localStorage');
    }
  }, [projectId]);
  
  const handleDiscordAction = async () => {
    if (!projectId) return;
    
    console.log('Discord action started - isConnected:', isConnected, 'projectId:', projectId);
    setIsJoining(true);
    try {
      // Always try to create/join channel first, regardless of isConnected state
      // This handles the case where user is already linked in backend but frontend doesn't know
      console.log('Attempting to create Discord channel for project:', projectId);
      try {
        const result = await createDiscordChannel(projectId).unwrap();
        console.log('Discord channel result:', result);
        
        // Store that the user is connected to Discord for this project
        localStorage.setItem(`discord_connected_${projectId}`, 'true');
        setIsConnected(true);
        
        if (result.inviteLink) {
          // If we got an invite link, open it
          window.open(result.inviteLink, '_blank');
          
          // Check if already linked message
          if (result.message && result.message.includes('already linked')) {
            toast.success('Already connected to Discord! Opening channel...');
          } else {
            toast.success('Discord channel joined! If you see "Messages failed to load", please refresh your Discord app.');
          }
        } else if (result.authUrl) {
          // User needs to authenticate first
          console.log('Need to authenticate, redirecting to:', result.authUrl);
          window.location.href = result.authUrl;
        } else {
          // Handle any other success case
          console.log('No inviteLink or authUrl in result:', result);
          toast.success('Connected to Discord successfully!');
        }
      } catch (channelError: any) {
        console.error('Channel creation error details:', {
          error: channelError,
          status: channelError?.status,
          data: channelError?.data,
          message: channelError?.message
        });
        
        // Check if the error actually contains success data (backend sends success with error status)
        if (channelError?.data?.inviteLink) {
          console.log('Found inviteLink in error data, treating as success');
          localStorage.setItem(`discord_connected_${projectId}`, 'true');
          setIsConnected(true);
          window.open(channelError.data.inviteLink, '_blank');
          
          if (channelError.data.message && channelError.data.message.includes('already linked')) {
            toast.success('Already connected to Discord! Opening channel...');
          } else {
            toast.success('Discord channel joined successfully!');
          }
        } else if (channelError?.data?.authUrl) {
          // Need to authenticate first
          console.log('Need to authenticate, redirecting to:', channelError.data.authUrl);
          window.location.href = channelError.data.authUrl;
        } else {
          // Check if this is an auth error that requires OAuth flow
          console.log('Channel creation failed, trying OAuth flow');
          try {
            const oauthResult = await initDiscordOAuth(projectId).unwrap();
            if (oauthResult.authUrl) {
              console.log('Starting OAuth flow, redirecting to:', oauthResult.authUrl);
              window.location.href = oauthResult.authUrl;
            } else {
              toast.error('Failed to connect Discord account');
            }
          } catch (oauthError) {
            console.error('OAuth error:', oauthError);
            toast.error('Failed to connect Discord account');
          }
        }
      }
    } catch (error) {
      console.error('Error with Discord action:', error);
      toast.error('Error connecting to Discord. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      className="gap-2"
      onClick={handleDiscordAction}
      disabled={isJoining}
    >
      {isJoining ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isConnected ? (
        <>
          <ExternalLink className="h-4 w-4" />
          Join Discord
        </>
      ) : (
        <>
          <ExternalLink className="h-4 w-4" />
          Connect Discord
        </>
      )}
    </Button>
  );
};

export default DiscordIntegration;