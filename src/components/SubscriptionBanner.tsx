import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SubscriptionBannerProps {
  type: 'projects' | 'collaborations' | 'publishing';
  limit: number;
  used: number;
  className?: string;
}

const SubscriptionBanner = ({ type, limit, used, className = '' }: SubscriptionBannerProps) => {
  const router = useRouter();
  const percentageUsed = Math.min((used / limit) * 100, 100);
  const isWarning = percentageUsed >= 66;
  const isMaxed = used >= limit;
  
  let message = '';
  
  if (type === 'projects') {
    message = `${used}/${limit} project ideas used`;
  } else if (type === 'collaborations') {
    message = `${used}/${limit} collaboration requests used`;
  } else if (type === 'publishing') {
    message = `${used}/${limit} projects published`;
  }
  
  // If they've hit the limit, show a different message
  if (isMaxed) {
    if (type === 'projects') {
      message = 'Project idea limit reached';
    } else if (type === 'collaborations') {
      message = 'Collaboration request limit reached';
    } else if (type === 'publishing') {
      message = 'Project publishing limit reached';
    }
  }
  
  return (
    <Card className={`border-2 overflow-hidden ${isMaxed ? 'border-red-500/20 dark:border-red-400/30' : isWarning ? 'border-yellow-500/20 dark:border-yellow-400/30' : 'border-blue-600/20 dark:border-blue-400/30'} ${className}`}>
      <div className={`h-1 w-full ${isMaxed ? 'bg-red-500 dark:bg-red-400' : isWarning ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-blue-600 dark:bg-blue-400'}`}>
        <div 
          className="h-full bg-background dark:bg-background transition-all duration-300"
          style={{ width: `${100 - percentageUsed}%`, float: 'right' }}
        />
      </div>
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isMaxed ? (
              <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0" />
            ) : isWarning ? (
              <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
            ) : (
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => router.push('/pricing')}
            className={`text-xs px-3 py-1 h-8 gap-1 transform transition-all ${
              isMaxed 
                ? "bg-white dark:bg-black text-red-500 dark:text-red-400 border-2 border-red-500 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 shadow-[0_2px_0_0_rgba(220,38,38,0.8)] dark:shadow-[0_2px_0_0_rgba(248,113,113,0.8)] active:translate-y-1 active:shadow-none" 
                : "bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_2px_0_0_rgba(0,0,0,1)] dark:shadow-[0_2px_0_0_rgba(255,255,255,1)] active:translate-y-1 active:shadow-none"
            }`}
          >
            <Rocket className="h-3 w-3" />
            Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionBanner;