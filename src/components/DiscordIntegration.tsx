import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useCreateDiscordChannelMutation, useInitDiscordOAuthMutation, useGetDiscordInviteQuery } from '@/app/api/discordApiSlice';
import { ExternalLink, Loader2, Check } from 'lucide-react';
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
    if (discordConnected === 'true') {
      setIsConnected(true);
    }
  }, [projectId]);
  
  const handleDiscordAction = async () => {
    if (!projectId) return;
    
    setIsJoining(true);
    try {
      if (!isConnected) {
        // First, initiate OAuth flow to connect Discord account
        try {
          const oauthResult = await initDiscordOAuth(projectId).unwrap();
          if (oauthResult.authUrl) {
            window.location.href = oauthResult.authUrl;
          } else {
            toast.error('Failed to connect Discord account');
          }
        } catch (oauthError) {
          console.error('OAuth error:', oauthError);
          toast.error('Failed to connect Discord account');
        }
      } else {
        // User is already connected, try to join the channel
        const result = await createDiscordChannel(projectId).unwrap();
        
        if (result.inviteLink) {
          // Store that the user is connected to Discord for this project
          localStorage.setItem(`discord_connected_${projectId}`, 'true');
          
          // If we got an invite link directly, open it
          window.open(result.inviteLink, '_blank');
          toast.success('Discord channel joined! If you see "Messages failed to load", please refresh your Discord app.');
        } else if (result.authUrl) {
          // This shouldn't happen if isConnected is true, but just in case
          window.location.href = result.authUrl;
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