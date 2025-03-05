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
  const [createDiscordChannel] = useCreateDiscordChannelMutation();
  const [initDiscordOAuth] = useInitDiscordOAuthMutation();
  const searchParams = useSearchParams();
  
  // Check for Discord callback results
  useEffect(() => {
    const discordStatus = searchParams.get('discord');
    const inviteLink = searchParams.get('invite');
    
    if (discordStatus === 'success') {
      toast.success('Successfully joined Discord channel');
    } else if (discordStatus === 'invite') {
      toast.info('Please use this invite link to join the Discord server first');
      if (inviteLink) {
        window.open(decodeURIComponent(inviteLink), '_blank');
      }
    } else if (discordStatus === 'error') {
      toast.error('Failed to join Discord channel');
    }
    
    // Remove query parameters from URL
    if (discordStatus) {
      const url = new URL(window.location.href);
      url.searchParams.delete('discord');
      url.searchParams.delete('invite');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);
  
  const handleJoinDiscord = async () => {
    if (!projectId) return;
    
    setIsJoining(true);
    try {
      // First, try the normal channel creation/joining
      const result = await createDiscordChannel(projectId).unwrap();
      
      if (result.authUrl) {
        // If we got an authUrl, redirect to Discord OAuth
        window.location.href = result.authUrl;
        return;
      }
      
      if (result.inviteLink) {
        // If we got an invite link directly, open it
        window.open(result.inviteLink, '_blank');
        toast.success('Discord channel joined! If you see "Messages failed to load", please refresh your Discord app.');
      }
    } catch (error) {
      console.error('Error joining Discord channel:', error);
      
      // If direct method fails, try OAuth method
      try {
        const oauthResult = await initDiscordOAuth(projectId).unwrap();
        if (oauthResult.authUrl) {
          window.location.href = oauthResult.authUrl;
        } else {
          toast.error('Failed to join Discord channel');
        }
      } catch (oauthError) {
        console.error('OAuth error:', oauthError);
        toast.error('Failed to join Discord channel');
      }
    } finally {
      setIsJoining(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      className="gap-2"
      onClick={handleJoinDiscord}
      disabled={isJoining}
    >
      {isJoining ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ExternalLink className="h-4 w-4" />
      )}
      Join Discord
    </Button>
  );
};

export default DiscordIntegration;