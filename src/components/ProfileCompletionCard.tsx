'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

// Define types for user and profile
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

// Result of profile completion calculation
interface ProfileCompletionResult {
  percentage: number;
  missingFields: string[];
}

// This calculates profile completion percentage based on fields filled out
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

interface ProfileCompletionCardProps {
  user: User;
  profile: Profile;
  onStartEdit: () => void;
}


const ProfileCompletionCard = ({ 
  user, 
  profile, 
  onStartEdit 
}: ProfileCompletionCardProps) => {
  const { percentage, missingFields } = calculateProfileCompletion(user, profile);
  
  // Determine status message and color based on completion percentage
  let statusMessage = '';
  let statusColor = '';
  
  if (percentage === 100) {
    statusMessage = 'Your profile is complete! 🎉';
    statusColor = 'text-green-600 dark:text-green-400';
  } else if (percentage >= 75) {
    statusMessage = 'Almost there!';
    statusColor = 'text-blue-600 dark:text-blue-400';
  } else if (percentage >= 50) {
    statusMessage = 'Making good progress';
    statusColor = 'text-amber-600 dark:text-amber-400';
  } else {
    statusMessage = 'Let\'s complete your profile';
    statusColor = 'text-red-600 dark:text-red-400';
  }
  
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
      
      <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            {percentage === 100 ? 
              <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
              <AlertCircle className="h-5 w-5 text-amber-500" />
            }
            Profile Completion
          </CardTitle>
          <CardDescription>Enhance your visibility to potential collaborators</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{percentage}% complete</span>
              <span className={`text-sm font-medium animate-bounce ${statusColor}`}>{statusMessage} </span>
            </div>
            
            {/* Enhanced progress indicator */}
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
              <div 
                className={`h-full bg-blue-500 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            
            {/* Milestone markers with proper positioning */}
            <div className="relative w-full h-4 mt-1">
              {/* Marker for 0% */}
              <div className="absolute left-0 top-0 flex flex-col items-center">
                <div className="h-1 w-1 bg-gray-400 rounded-full mb-1"></div>
                <span className="text-xs text-gray-500">0%</span>
              </div>
              
              {/* Marker for 25% */}
              <div className="absolute left-1/4 top-0 flex flex-col items-center -ml-1">
                <div className={`h-1 w-1 ${percentage >= 25 ? 'bg-blue-500' : 'bg-gray-400'} rounded-full mb-1`}></div>
                <span className={`text-xs ${percentage >= 25 ? statusColor : 'text-gray-500'}`}>25%</span>
              </div>
              
              {/* Marker for 50% */}
              <div className="absolute left-1/2 top-0 flex flex-col items-center -ml-1">
                <div className={`h-1 w-1 ${percentage >= 50 ? 'bg-blue-500' : 'bg-gray-400'} rounded-full mb-1`}></div>
                <span className={`text-xs ${percentage >= 50 ? statusColor : 'text-gray-500'}`}>50%</span>
              </div>
              
              {/* Marker for 75% */}
              <div className="absolute left-3/4 top-0 flex flex-col items-center -ml-1">
                <div className={`h-1 w-1 ${percentage >= 75 ? 'bg-blue-500' : 'bg-gray-400'} rounded-full mb-1`}></div>
                <span className={`text-xs ${percentage >= 75 ? statusColor : 'text-gray-500'}`}>75%</span>
              </div>
              
              {/* Marker for 100% */}
              <div className="absolute right-0 top-0 flex flex-col items-center">
                <div className={`h-1 w-1 ${percentage >= 100 ? 'bg-blue-500' : 'bg-gray-400'} rounded-full mb-1`}></div>
                <span className={`text-xs ${percentage >= 100 ? statusColor : 'text-gray-500'}`}>100%</span>
              </div>
            </div>
          </div>
          
          {missingFields.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Missing information:</h4>
              <ul className="space-y-1">
                {missingFields.slice(0, 3).map((field, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70"></div>
                    {field}
                  </li>
                ))}
                {missingFields.length > 3 && (
                  <li className="text-sm text-muted-foreground">
                    And {missingFields.length - 3} more...
                  </li>
                )}
              </ul>
              
              <Button 
                onClick={onStartEdit} 
                className="w-full mt-2 gap-1 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transform transition-all"
              >
                Complete Your Profile <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletionCard;