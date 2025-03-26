"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import {
  useGetPublicFeedbackQuery,
  useUpvoteFeedbackMutation,
} from "@/app/api/feedbackApiSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Category icon mapping
const categoryIcons = {
  bug: <Bug className="h-4 w-4 text-red-500" />,
  feature: <Lightbulb className="h-4 w-4 text-yellow-500" />,
  improvement: <ArrowUp className="h-4 w-4 text-green-500" />,
  general: <Star className="h-4 w-4 text-blue-500" />,
};

// Status badge mapping
const statusBadges = {
  pending: (
    <Badge
      variant="outline"
      className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    >
      Pending
    </Badge>
  ),
  "under-review": (
    <Badge
      variant="outline"
      className="bg-blue-500/10 text-blue-500 border-blue-500/20"
    >
      Under Review
    </Badge>
  ),
  implemented: (
    <Badge
      variant="outline"
      className="bg-green-500/10 text-green-500 border-green-500/20"
    >
      Implemented
    </Badge>
  ),
  declined: (
    <Badge
      variant="outline"
      className="bg-red-500/10 text-red-500 border-red-500/20"
    >
      Declined
    </Badge>
  ),
};

const FeedbackList: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

 // Filter states
 const [category, setCategory] = useState<string>('all');
 const [status, setStatus] = useState<string>('all');
 const [sort, setSort] = useState<string>("createdAt");
 
 // Pagination states
 const [page, setPage] = useState<number>(1);
 const [pageSize, setPageSize] = useState<number>(10);

 // Fetch feedback data with pagination
 const { data, isLoading, error } = useGetPublicFeedbackQuery({
   category: category === 'all' ? '' : category,
   status: status === 'all' ? '' : status,
   sort,
   order: 'desc',
   page,
   pageSize,
 },{
   refetchOnMountOrArgChange: true 
 });


  // Upvote mutation
  const [upvoteFeedback, { isLoading: isUpvoting }] =
    useUpvoteFeedbackMutation();

  // Handle upvote
  const handleUpvote = async (feedbackId: string) => {
    if (!isAuthenticated) {
      try {
        await login();
        toast.info("Please login to upvote feedback");
      } catch (error) {
        console.error("Login error:", error);
      }
      return;
    }

    try {
      await upvoteFeedback(feedbackId).unwrap();
    } catch (error) {
      console.error("Upvote error:", error);
      toast.error("Failed to upvote feedback");
    }
  };

  // Navigate to feedback submission page
  const navigateToSubmit = () => {
    router.push("/feedback/submit");
  };

    // Handle page change
    const handlePageChange = (newPage: number) => {
      if (newPage > 0 && (!data?.totalPages || newPage <= data.totalPages)) {
        setPage(newPage);
        // Scroll to top of the list
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
  
            {/* Category filter */}
            <Select value={category} onValueChange={(value) => { setCategory(value); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bug">Bug Reports</SelectItem>
                <SelectItem value="feature">Feature Requests</SelectItem>
                <SelectItem value="improvement">Improvements</SelectItem>
                <SelectItem value="general">General Feedback</SelectItem>
              </SelectContent>
            </Select>
  
            {/* Status filter */}
            <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
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
            <Select value={sort} onValueChange={(value) => { setSort(value); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upvotes">Most Upvoted</SelectItem>
                <SelectItem value="createdAt">Most Recent</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Page size selector */}
            <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(parseInt(value)); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
          <Button
            onClick={navigateToSubmit}
            className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
          >
            <PlusCircle className="h-4 w-4" />
            Submit Feedback
          </Button>
        </div>
  
        {/* Feedback Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500">
              Error loading feedback. Please try again.
            </p>
          </div>
        ) : !data?.feedback || data.feedback.length === 0 ? (
          <Card className="bg-muted/50 border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Feedback Yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Be the first to share your thoughts or suggestions about the
                platform!
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
          <>
            <div className="grid gap-6">
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
                      <div className="flex gap-6">
                        {/* Upvote button */}
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpvote(feedback._id)}
                            disabled={isUpvoting}
                            className="px-3"
                          >
                            <ThumbsUp className="h-5 w-5" />
                          </Button>
                          <span className="text-sm font-medium">
                            {feedback.upvotes.length}
                          </span>
                        </div>
  
                        {/* Main content */}
                        <div className="flex-1">
                          {/* Title and metadata */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h3 className="text-lg font-bold">{feedback.title}</h3>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {
                                  categoryIcons[
                                    feedback.category as keyof typeof categoryIcons
                                  ]
                                }
                                <span className="text-sm capitalize">
                                  {feedback.category}
                                </span>
                              </div>
                              {
                                statusBadges[
                                  feedback.status as keyof typeof statusBadges
                                ]
                              }
                            </div>
                          </div>
  
                          {/* Description */}
                          <p className="text-muted-foreground mb-4">
                            {feedback.description}
                          </p>
  
                          {/* Footer: User info and date */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={feedback.userId?.avatar}
                                  alt={feedback.userId?.name}
                                  onError={(e) => {
                                    e.currentTarget.src = `https://avatar.vercel.sh/${feedback.userId.username}`;
                                  }}
                                />
                                <AvatarFallback>
                                  {feedback.userId?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {feedback.userId?.name}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(feedback.createdAt)}
                            </span>
                          </div>
  
                          {/* Tags - if exists */}
                          {feedback.tags && feedback.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {feedback.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
          {/* Pagination Controls */}
{data.totalPages > 1 && (
  <div className="mt-8">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => handlePageChange(page - 1)}
            className={`cursor-pointer ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          />
        </PaginationItem>
        
        {/* First page */}
        {page > 2 && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => handlePageChange(1)}
              className="cursor-pointer"
            >1</PaginationLink>
          </PaginationItem>
        )}
        
        {/* Ellipsis if needed */}
        {page > 3 && (
          <PaginationItem>
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        )}
        
        {/* Previous page if not on first page */}
        {page > 1 && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => handlePageChange(page - 1)}
              className="cursor-pointer"
            >
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        
        {/* Current page */}
        <PaginationItem>
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>
        
        {/* Next page if not on last page */}
        {page < data.totalPages && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => handlePageChange(page + 1)}
              className="cursor-pointer"
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        
        {/* Ellipsis if needed */}
        {page < data.totalPages - 2 && (
          <PaginationItem>
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        )}
        
        {/* Last page */}
        {page < data.totalPages - 1 && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => handlePageChange(data.totalPages)}
              className="cursor-pointer"
            >
              {data.totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => handlePageChange(page + 1)}
            className={`cursor-pointer ${page >= data.totalPages ? "pointer-events-none opacity-50" : ""}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    
    <div className="text-center text-sm text-muted-foreground mt-2">
      Showing {data.feedback.length} of {data.totalCount} items • Page {page} of {data.totalPages}
    </div>
  </div>
)}
          </>
        )}
      </div>
    );
  };
  
  export default FeedbackList;
