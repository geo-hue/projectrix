'use client';

import React, { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bug,
  Lightbulb,
  ArrowUp,
  Star,
  ThumbsUp,
  Filter,
  Loader2,
  MessageSquare,
  CheckCircle2,
  TimerReset,
  ShieldAlert,
  RefreshCw,
  XCircle,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllFeedbackQuery, useUpdateFeedbackStatusMutation } from '@/app/api/feedbackApiSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

// Status badges with icons
const statusInfo = {
  pending: {
    badge: <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>,
    icon: <TimerReset className="h-4 w-4" />,
    text: 'Mark as Pending'
  },
  'under-review': {
    badge: <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Under Review</Badge>,
    icon: <RefreshCw className="h-4 w-4" />,
    text: 'Mark as Under Review'
  },
  implemented: {
    badge: <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Implemented</Badge>,
    icon: <CheckCircle2 className="h-4 w-4" />,
    text: 'Mark as Implemented'
  },
  declined: {
    badge: <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Declined</Badge>,
    icon: <XCircle className="h-4 w-4" />,
    text: 'Mark as Declined'
  }
};

const AdminFeedbackManagement: React.FC = () => {
  // Filter states
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [sort, setSort] = useState<string>('upvotes');
  
  // Fetch feedback data
  const { data, isLoading, error, refetch } = useGetAllFeedbackQuery({
    category: category === 'all' ? '' : category,
    status: status === 'all' ? '' : status,
    sort,
    order: 'desc'
  });
  
  // Status update mutation
  const [updateStatus, { isLoading: isUpdating }] = useUpdateFeedbackStatusMutation();
  
  // Handle status update
  const handleStatusUpdate = async (feedbackId: string, newStatus: 'pending' | 'under-review' | 'implemented' | 'declined') => {
    try {
      await updateStatus({ feedbackId, status: newStatus }).unwrap();
      toast.success(`Feedback status updated to ${newStatus}`);
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update feedback status');
    }
  };
  
  // Stats calculation
  const calculateStats = () => {
    if (!data?.feedback) return {
      total: 0,
      pending: 0,
      underReview: 0,
      implemented: 0,
      declined: 0,
      bugs: 0,
      features: 0,
      improvements: 0,
      general: 0
    };
    
    return {
      total: data.feedback.length,
      pending: data.feedback.filter(f => f.status === 'pending').length,
      underReview: data.feedback.filter(f => f.status === 'under-review').length,
      implemented: data.feedback.filter(f => f.status === 'implemented').length,
      declined: data.feedback.filter(f => f.status === 'declined').length,
      bugs: data.feedback.filter(f => f.category === 'bug').length,
      features: data.feedback.filter(f => f.category === 'feature').length,
      improvements: data.feedback.filter(f => f.category === 'improvement').length,
      general: data.feedback.filter(f => f.category === 'general').length
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="space-y-8">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-black border border-black/20 dark:border-white/20">
          <CardHeader>
            <CardTitle>Feedback Status</CardTitle>
            <CardDescription>Overview of feedback by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10">
                <TimerReset className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10">
                <RefreshCw className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Under Review</p>
                  <p className="text-2xl font-bold">{stats.underReview}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Implemented</p>
                  <p className="text-2xl font-bold">{stats.implemented}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Declined</p>
                  <p className="text-2xl font-bold">{stats.declined}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-black border border-black/20 dark:border-white/20">
          <CardHeader>
            <CardTitle>Feedback Categories</CardTitle>
            <CardDescription>Breakdown by category type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10">
                <Bug className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Bugs</p>
                  <p className="text-2xl font-bold">{stats.bugs}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Features</p>
                  <p className="text-2xl font-bold">{stats.features}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
                <ArrowUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Improvements</p>
                  <p className="text-2xl font-bold">{stats.improvements}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10">
                <Star className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">General</p>
                  <p className="text-2xl font-bold">{stats.general}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          
          {/* Category filter */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="feature">Feature Request</SelectItem>
              <SelectItem value="improvement">Improvement</SelectItem>
              <SelectItem value="general">General Feedback</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Status filter */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="implemented">Implemented</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sorting */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upvotes">Most Upvoted</SelectItem>
              <SelectItem value="createdAt">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={() => refetch()}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      {/* Feedback Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <p className="text-red-500">Error loading feedback. Please try again.</p>
          <Button onClick={() => refetch()} variant="outline">Retry</Button>
        </div>
      ) : !data?.feedback || data.feedback.length === 0 ? (
        <Card className="bg-muted/50 border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Feedback Found</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              There is no feedback matching your filter criteria.
            </p>
            <Button 
              onClick={() => {
                setCategory('all');
                setStatus('all');
                setSort('upvotes');
              }}
              variant="outline"
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {data.feedback.map((feedback) => (
            <AccordionItem
              key={feedback._id}
              value={feedback._id}
              className="border border-black/20 dark:border-white/20 rounded-lg overflow-hidden bg-white dark:bg-black"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 text-left">
                  <div className="flex items-center gap-2">
                    {categoryIcons[feedback.category as keyof typeof categoryIcons]}
                    <h3 className="font-semibold">{feedback.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {statusInfo[feedback.status as keyof typeof statusInfo].badge}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {feedback.upvotes.length}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(feedback.createdAt)}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  {/* Submitter info */}
                  <div className="flex items-center gap-2 my-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={feedback.userId?.avatar} 
                        alt={feedback.userId?.name}
                        onError={(e) => {
                          e.currentTarget.src = `https://avatar.vercel.sh/${feedback.userId.username}`;
                        }}
                      />
                      <AvatarFallback>{feedback.userId?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{feedback.userId?.name}</span>
                    <span className="text-xs text-muted-foreground">@{feedback.userId?.username}</span>
                  </div>
                  
                  {/* Description */}
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-muted-foreground whitespace-pre-line">{feedback.description}</p>
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
                  
                  {/* Status Action Buttons */}
                  <div className="flex flex-wrap justify-end gap-2 mt-4 pt-4 border-t border-border/50">
                    {/* Status dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline"
                          className="gap-2"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShieldAlert className="h-4 w-4" />
                          )}
                          Update Status
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(feedback._id, 'pending')}
                          disabled={feedback.status === 'pending'}
                          className="gap-2"
                        >
                          {statusInfo.pending.icon}
                          {statusInfo.pending.text}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(feedback._id, 'under-review')}
                          disabled={feedback.status === 'under-review'}
                          className="gap-2"
                        >
                          {statusInfo['under-review'].icon}
                          {statusInfo['under-review'].text}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(feedback._id, 'implemented')}
                          disabled={feedback.status === 'implemented'}
                          className="gap-2"
                        >
                          {statusInfo.implemented.icon}
                          {statusInfo.implemented.text}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(feedback._id, 'declined')}
                          disabled={feedback.status === 'declined'}
                          className="gap-2"
                        >
                          {statusInfo.declined.icon}
                          {statusInfo.declined.text}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default AdminFeedbackManagement;