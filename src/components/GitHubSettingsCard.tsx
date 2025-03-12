import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Github, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  Unlock, 
  ExternalLink 
} from 'lucide-react';
import { useGitHubAuth } from '@/app/hooks/useGitHubAuth';
import { motion } from 'framer-motion';

interface GitHubSettingsCardProps {
  className?: string;
}

const GitHubSettingsCard: React.FC<GitHubSettingsCardProps> = ({ className }) => {
  const {
    isAuthorized,
    isAuthenticating,
    isRevoking,
    authorizeGitHub,
    revokeGitHubAuth
  } = useGitHubAuth();

  // Handle GitHub authorization
  const handleAuthorize = () => {
    // Using 'settings' as a marker to identify it's coming from settings page
    authorizeGitHub('settings');
  };

  // Handle GitHub authorization revocation
  const handleRevoke = () => {
    revokeGitHubAuth();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">GitHub Integration</CardTitle>
          </div>
          <CardDescription>
            Connect your GitHub account to enable repository creation for your projects
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="bg-muted/30 p-4 rounded-md flex items-center gap-4">
            {isAuthorized ? (
              <>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-green-500 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    GitHub Connected
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your GitHub account is connected and ready to use with Projectrix
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="font-medium text-yellow-500 flex items-center gap-2">
                    <Unlock className="h-4 w-4" />
                    Not Connected
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect your GitHub account to create repositories and collaborate
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Create project repositories automatically
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Generate role-specific documentation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Set up project boards and issues
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Invite collaborators with proper permissions
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter>
          {isAuthorized ? (
            <Button 
              variant="outline" 
              className="w-full gap-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              onClick={handleRevoke}
              disabled={isRevoking}
            >
              {isRevoking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Github className="h-4 w-4" />
              )}
              Disconnect GitHub
            </Button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <Button 
                className="w-full sm:w-auto gap-2 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                onClick={handleAuthorize}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                Connect with GitHub
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto gap-2"
                onClick={() => window.open('https://github.com/settings/applications', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Manage GitHub Apps
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default GitHubSettingsCard;