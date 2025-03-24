import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProPlanBenefitsProps {
  className?: string;
}

const ProPlanBenefits = ({ className }: ProPlanBenefitsProps) => {
  const router = useRouter();

  return (
    <div className={className}>
      <div className="group relative">
        <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
        
        <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
          <CardHeader>
            <CardTitle className="text-lg">Pro Plan Benefits</CardTitle>
            <CardDescription>Upgrade to unlock all these features</CardDescription>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>10 project ideas generation</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Unlimited published projects</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Unlimited collaboration requests</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Advanced AI project enhancements</span>
              </li>
            </ul>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={() => router.push('/pricing')}
              className="w-full gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProPlanBenefits;