'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { UserCircle, ChevronRight, X } from 'lucide-react';
import { useGetUserProfileQuery } from '@/app/api/userProfileApiSlice';
import { useAuth } from '@/app/context/AuthContext';

// Define types for user and profile, matching the ProfileCompletionCard
interface User {
  avatar?: string;
}

interface Profile {
  bio?: string;
  skills?: any;
  website?: string;
  githubProfile?: string;
  twitterProfile?: string;
  linkedinProfile?: string;
  availability?: string;
  hoursPerWeek?: number;
  preferredTechnologies?: any;
  preferredRoles?: any;
}

interface ProfileCompletionResult {
  percentage: number;
  missingFields: string[];
}

// This calculates profile completion percentage based on fields filled out
// Exactly matching the logic from ProfileCompletionCard
const calculateProfileCompletion = (user: User, profile: Profile): ProfileCompletionResult => {
  if (!user || !profile) return { percentage: 0, missingFields: [] };
  
  const fields = [
    { name: 'Avatar', value: user.avatar },
    { name: 'Bio', value: profile.bio },
    { name: 'Skills', value: profile.skills?.length > 0 },
    { name: 'Website', value: profile.website },
    { name: 'GitHub Profile', value: profile.githubProfile },
    { name: 'Twitter Profile', value: profile.twitterProfile },
    { name: 'LinkedIn Profile', value: profile.linkedinProfile },
    { name: 'Availability', value: profile.availability },
    { name: 'Hours Per Week', value: profile.hoursPerWeek },
    { name: 'Preferred Technologies', value: profile.preferredTechnologies?.length > 0 },
    { name: 'Preferred Roles', value: profile.preferredRoles?.length > 0 },
  ];
  
  const completedFields = fields.filter(field => field.value).length;
  const percentage = Math.round((completedFields / fields.length) * 100);
  
  const missingFields = fields
    .filter(field => !field.value)
    .map(field => field.name);
  
  return { percentage, missingFields };
};

const ProfileCompletionBanner: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [dismissed, setDismissed] = React.useState(false);
  
  // Get user profile data
  const { data: profileData, isLoading } = useGetUserProfileQuery(undefined, {
    skip: !user // Only fetch if logged in
  });

  // Calculate profile completion using the same logic as ProfileCompletionCard
  const getProfileCompletion = (): ProfileCompletionResult => {
    if (!user || !profileData?.profile) {
      return { percentage: 0, missingFields: [] };
    }
    
    return calculateProfileCompletion(user, profileData.profile);
  };

  const { percentage } = getProfileCompletion();

  // Skip rendering if loading, dismissed, not logged in, or profile is at least 75% complete
  if (isLoading || dismissed || !user || percentage >= 75) {
    return null;
  }

  return (
    <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 relative">
      <button 
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </button>
      
      <UserCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="font-medium text-blue-800 dark:text-blue-300">
        Complete Your Profile
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          Project owners review applicant profiles before accepting collaboration requests. 
          A complete profile significantly increases your chances of being selected.
        </p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-blue-700 dark:text-blue-300">
              {percentage}% complete
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
            onClick={() => router.push('/profile')}
          >
            Complete Profile
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileCompletionBanner;