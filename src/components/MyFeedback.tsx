'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bug,
  Lightbulb,
  ArrowUp,
  Star,
  Loader2,
  PlusCircle,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { useGetMyFeedbackQuery } from '@/app/api/feedbackApiSlice';
import { useRouter } from 'next/navigation';

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Category icon mapping
const categoryIcons = {
  bug: <Bug className="h-4 w-4 text-red-500" />,
  feature: <Lightbulb className="h-4 w-4 text-yellow-500" />,
  improvement: <ArrowUp className="h-4 w-4 text-green-500" />,
  general: <Star className="h-4 w-4 text-blue-500" />
};

// Status badge mapping
const statusBadges = {
  pending: <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>,
  'under-review': <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Under Review</Badge>,
  implemented: <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Implemented</Badge>,
  declined: <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Declined</Badge>
};

const MyFeedback: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, error } = useGetMyFeedbackQuery();
  
  // Navigate to feedback submission page
  const navigateToSubmit = () => {
    router.push('/feedback/submit');
  };
  
  // Navigate to all feedback page
  const navigateToAllFeedback = () => {
    router.push('/feedback');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>My Feedback</CardTitle>
              <CardDescription>
                Track the status of your submitted feedback
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="gap-2"
                onClick={navigateToAllFeedback}
              >
                View All Feedback
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                onClick={navigateToSubmit}
                className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
              >
                <PlusCircle className="h-4 w-4" />
                New Feedback
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-red-500">Error loading your feedback. Please try again.</p>
            </div>
          ) : !data?.feedback || data.feedback.length === 0 ? (
            <Card className="bg-muted/50 border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Feedback Submitted Yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  You haven&apos;t submitted any feedback yet. Share your thoughts to help us improve Projectrix!
                </p>
                <Button 
                  onClick={navigateToSubmit}
                  className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                >
                  <PlusCircle className="h-4 w-4" />
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {data.feedback.map((feedback, index) => (
                <motion.div
                  key={feedback._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative group"
                >
                  {/* Background shadow */}
                  <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                  
                  <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header: Title and metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="text-lg font-bold">{feedback.title}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {categoryIcons[feedback.category as keyof typeof categoryIcons]}
                              <span className="text-sm capitalize">{feedback.category}</span>
                            </div>
                            {statusBadges[feedback.status as keyof typeof statusBadges]}
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-muted-foreground">{feedback.description}</p>
                        
                        {/* Footer: Upvotes and date */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              <span className="text-primary font-medium">{feedback.upvotes.length}</span> upvotes
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">Submitted on {formatDate(feedback.createdAt)}</span>
                        </div>
                        
                        {/* Tags - if exists */}
                        {feedback.tags && feedback.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {feedback.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyFeedback;