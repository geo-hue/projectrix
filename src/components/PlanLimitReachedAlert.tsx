import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface PlanLimitReachedAlertProps {
  title?: string;
  description: string;
  showUpgradeButton?: boolean;
}

const PlanLimitReachedAlert: React.FC<PlanLimitReachedAlertProps> = ({
  title = "Free Plan Limit Reached",
  description,
  showUpgradeButton = true
}) => {
  const router = useRouter();

  return (
    <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400">
      <AlertCircle className="h-4 w-4" />
      <div className="flex-1 ml-2">
        <AlertTitle className="mb-1">{title}</AlertTitle>
        <AlertDescription className="text-sm">
          {description}
        </AlertDescription>
        {showUpgradeButton && (
          <Button 
            size="sm" 
            onClick={() => router.push('/pricing')}
            className="mt-3 gap-1 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Upgrade to Pro
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default PlanLimitReachedAlert;