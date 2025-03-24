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
      <div className="group relative">
        {/* Background shadow element */}
        <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
        
        <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 overflow-hidden">
          {/* Add decorative blue gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-600/5 to-blue-400/5 dark:from-blue-700/5 dark:to-blue-400/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-400/5 to-blue-600/5 dark:from-blue-400/5 dark:to-blue-700/5 rounded-full blur-2xl"></div>
          </div>
          
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 flex items-center justify-center">
                <Github className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">GitHub Integration</CardTitle>
                <CardDescription>
                  Connect your GitHub account to enable repository creation for your projects
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-4 relative z-10">
            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg flex items-center gap-4">
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

          <CardFooter className="relative z-10">
            {isAuthorized ? (
              <Button 
                variant="outline" 
                className="w-full gap-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-white dark:bg-black border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
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
                  className="w-full sm:w-auto gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
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
                  className="w-full sm:w-auto gap-2 bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => window.open('https://github.com/settings/applications', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Manage GitHub Apps
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default GitHubSettingsCard;