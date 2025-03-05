'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardFooter, 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
  User,
  CheckCheck,
  MessageSquare,
  Clock,
  Loader2,
  BarChart4,
  Filter,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserActivitiesQuery, useMarkActivityAsReadMutation, useDeleteActivityMutation, useClearAllActivitiesMutation } from '@/app/api/activityApiSlice';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import ConfirmationDialog from './DeleteConfirmationDialog';

// Define activity filters for dropdown
const activityFilters = [
  { label: 'All Activities', value: '' },
  { label: 'Project Generated', value: 'project_generated' },
  { label: 'Project Published', value: 'project_published' },
  { label: 'Project Saved', value: 'project_saved' },
  { label: 'Collaboration Requests', value: 'collaboration_request' },
  { label: 'Accepted Collaborations', value: 'collaboration_accepted' },
  { label: 'Rejected Collaborations', value: 'collaboration_rejected' },
  { label: 'Feedback Responses', value: 'feedback_response' },
  { label: 'Profile Updates', value: 'profile_updated' }
];

const EnhancedActivityFeed = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  
  // Get paginated activities
  const { 
    data: activitiesData, 
    isLoading, 
    isFetching,
    refetch 
  } = useGetUserActivitiesQuery({
    page,
    limit: 10,
    filter: filter || undefined
  });
  
  // Mutations
  const [markAsRead] = useMarkActivityAsReadMutation();
  const [deleteActivity, { isLoading: isDeleting }] = useDeleteActivityMutation();
  const [clearAllActivities, { isLoading: isClearing }] = useClearAllActivitiesMutation();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  
  // Calculate total pages
  const totalPages = activitiesData?.pagination?.pages || 1;
  
  // Handle page navigation
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleClearAll = () => {
    setConfirmClearOpen(true);
  };
  
  const confirmClear = async () => {
    try {
      await clearAllActivities().unwrap();
      refetch(); // Refresh the list
      toast.success('All notifications cleared');
      setConfirmClearOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  

  // Handle filter change
  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1); // Reset to first page on filter change
  };
  
  // Handle activity click
  const handleActivityClick = async (activity) => {
    // Mark as read if not already
    if (!activity.read) {
      try {
        await markAsRead(activity._id).unwrap();
      } catch (error) {
        console.error('Error marking activity as read:', error);
      }
    }
    
    // Navigate based on activity type and entity
    if (activity.entityType === 'GeneratedProject' && activity.entityId) {
      router.push(`/projects/${activity.entityId}`);
    } else if (activity.type === 'collaboration_request' || 
              activity.type === 'collaboration_accepted' ||
              activity.type === 'collaboration_rejected') {
      router.push('/collaborations');
    } else if (activity.type === 'feedback_response') {
      router.push('/feedback');
    }
  };
  
  // Handle deleting an activity
  const handleDeleteActivity = async (e, activityId) => {
    e.stopPropagation(); // Prevent activity click handler
    
    try {
      await deleteActivity(activityId).unwrap();
      toast.success('Activity deleted');
      refetch(); // Refresh list
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };
  
  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'project_generated':
        return <Sparkles className="h-5 w-5 text-blue-500" />;
      case 'project_saved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'project_published':
        return <ExternalLink className="h-5 w-5 text-purple-500" />;
      case 'collaboration_request':
        return <User className="h-5 w-5 text-amber-500" />;
      case 'collaboration_accepted':
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case 'collaboration_rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'feedback_response':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'profile_updated':
        return <User className="h-5 w-5 text-indigo-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Function to format date
  const formatActivityDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  // Get activity type label
  const getActivityTypeLabel = (type) => {
    const filter = activityFilters.find(f => f.value === type);
    return filter ? filter.label : 'Activity';
  };
  
  return (
    <div className="space-y-6">
      {/* Header and Filtering */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <BarChart4 className="h-6 w-6 mr-2 text-primary" /> 
            Activity History
          </h2>
          <p className="text-muted-foreground">Track all your actions and interactions</p>
        </div>
        
        <div className="flex gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {filter && <Badge variant="secondary" className="ml-1 text-xs px-1">1</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
  className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg" 
  align="end"
>
              <DropdownMenuLabel>Filter Activities</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="max-h-60 overflow-y-auto">
                {activityFilters.map((item) => (
                  <DropdownMenuItem 
                    key={item.value} 
                    onClick={() => handleFilterChange(item.value)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{item.label}</span>
                      {filter === item.value && <CheckCheck className="h-4 w-4 text-primary" />}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              {filter && (
    <div className="p-2 border-t">
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-center text-xs"
        onClick={() => handleFilterChange('')}
      >
        <X className="h-3 w-3 mr-1" /> Clear Filter
      </Button>
    </div>
  )}
</DropdownMenuContent>
          </DropdownMenu>

          {activitiesData && activitiesData.activities.length > 0 && (
            <Button 
              variant="outline" 
              className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleClearAll}
              disabled={isClearing}
            >
              {isClearing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Clear All
            </Button>
          )}

        </div>
      </div>
      
      {/* Activity Cards */}
      <div className="space-y-4">
        <div className="group relative mb-6">
          <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
          <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
            <CardContent className="p-0">
              {/* Blue gradient background effect */}
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-blue-400/10 dark:from-blue-700/10 dark:to-blue-400/10 rounded-full blur-xl"></div>
              </div>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                  <p className="text-muted-foreground">Loading activity history...</p>
                </div>
              ) : !activitiesData || activitiesData.activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-primary/70" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Activities Found</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-md">
                    {filter 
                      ? `No ${getActivityTypeLabel(filter).toLowerCase()} activities found.`
                      : 'Your activity history will appear here as you use the platform.'}
                  </p>
                  {filter && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleFilterChange('')}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear Filter
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {activitiesData.activities.map((activity) => (
                    <motion.div
                      key={activity._id}
                      className={`p-4 sm:p-6 transition-colors cursor-pointer hover:bg-primary/5 ${!activity.read ? 'bg-primary/5' : ''}`}
                      onClick={() => handleActivityClick(activity)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className={`text-base ${!activity.read ? 'font-semibold' : ''}`}>
                                {activity.message}
                              </p>
                              <div className="flex items-center mt-1 gap-4">
                                <span className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatActivityDate(activity.createdAt)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {getActivityTypeLabel(activity.type)}
                                </Badge>
                              </div>
                            </div>
                        
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
            
            {/* Pagination */}
            {activitiesData && activitiesData.activities.length > 0 && (
              <CardFooter className="border-t border-black/10 dark:border-white/10 py-3 px-6">
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={page === 1 || isFetching}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={page >= totalPages || isFetching}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
      <ConfirmationDialog
  isOpen={confirmClearOpen}
  onClose={() => setConfirmClearOpen(false)}
  onConfirm={confirmClear}
  title="Clear Activity History"
  description="Are you sure you want to delete all notifications and activity history? This action will permanently remove all records from your user database and cannot be undone."
  confirmText="Yes, Clear Everything"
  cancelText="Cancel"
  isLoading={isClearing}
  variant="destructive"
/>
    </div>
  );
};

export default EnhancedActivityFeed;