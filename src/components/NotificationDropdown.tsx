"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  XCircle,
  ChevronRight,
  CheckCheck,
  Loader2,
  Sparkles,
  ExternalLink,
  User,
  MessageSquare,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSocket } from "@/app/context/SocketContext";
import {
  useGetUnreadCountQuery,
  useMarkActivityAsReadMutation,
  useMarkAllAsReadMutation,
  useGetUserActivitiesQuery,
  Activity,
} from "@/app/api/activityApiSlice";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

const NotificationDropdown = () => {
  const router = useRouter();
  const { activities: socketActivities, clearNewActivities } = useSocket();
  const [isOpen, setIsOpen] = useState(false);

  // Get unread count from API
  const {
    data: unreadCountData,
    refetch: refetchUnreadCount,
    isLoading: isUnreadCountLoading,
  } = useGetUnreadCountQuery();

  // Get recent notifications (limit to 5)
  const {
    data: recentActivitiesData,
    refetch: refetchActivities,
    isLoading: isActivitiesLoading,
  } = useGetUserActivitiesQuery({ limit: 5 });

  // Mark as read mutations
  const [markAsRead] = useMarkActivityAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAllRead }] =
    useMarkAllAsReadMutation();

  // Count unread notifications (API + socket)
  const unreadCount =
    (unreadCountData?.unreadCount || 0) + socketActivities.length;

  // Combine API activities and socket activities
  const allActivities = [
    ...socketActivities,
    ...(recentActivitiesData?.activities || []),
  ].slice(0, 5); // Limit to 5 total

  // Handle viewing activity details
  const handleViewActivity = (activity: Activity) => {
    // Mark as read first
    if (!activity.read) {
      markAsRead(activity._id)
        .unwrap()
        .catch((error) => {
          console.error("Error marking activity as read:", error);
        });
    }

    // Navigate based on activity type
    if (activity.entityType === "GeneratedProject" && activity.entityId) {
      router.push(`/projects/${activity.entityId}`);
    } else if (
      activity.type === "collaboration_request" ||
      activity.type === "collaboration_accepted" ||
      activity.type === "collaboration_rejected"
    ) {
      router.push("/collaborations");
    } else if (activity.type === "feedback_response") {
      router.push("/feedback");
    } else {
      // Default to activity tab in profile
      router.push("/profile?tab=activity");
    }

    // Close dropdown
    setIsOpen(false);
  };

  // Handle marking all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      clearNewActivities(); // Clear socket activities
      refetchUnreadCount(); // Refresh unread count
      refetchActivities(); // Refresh activities list
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  // View all activities
  const handleViewAll = () => {
    router.push("/profile?tab=activity");
    setIsOpen(false);
  };

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project_generated":
        return <Sparkles className="h-4 w-4 text-blue-500" />;
      case "project_saved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "project_published":
        return <ExternalLink className="h-4 w-4 text-purple-500" />;
      case "collaboration_request":
        return <User className="h-4 w-4 text-amber-500" />;
      case "collaboration_accepted":
        return <CheckCheck className="h-4 w-4 text-green-500" />;
      case "collaboration_rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "feedback_response":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "profile_updated":
        return <User className="h-4 w-4 text-indigo-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Format date for activity
  const formatActivityDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const now = new Date();

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a");
    }

    // If within last 7 days, show relative time
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    // Otherwise show date
    return format(date, "MMM d, yyyy");
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative"
            size="icon"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />

            {/* Notification badge */}
            {isUnreadCountLoading ? (
              <motion.div
                className="absolute -top-1 -right-1 bg-primary/30 text-primary-foreground text-xs rounded-full w-[18px] h-[18px] flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Loader2 className="h-3 w-3 animate-spin" />
              </motion.div>
            ) : (
              unreadCount > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-[5px]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.div>
              )
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-lg rounded-xl overflow-hidden p-0"
          align="end"
          sideOffset={8}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
            <DropdownMenuLabel className="font-semibold text-base m-0">
              Notifications
            </DropdownMenuLabel>

            {unreadCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={handleMarkAllAsRead}
                      disabled={isMarkingAllRead}
                    >
                      {isMarkingAllRead ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCheck className="h-3.5 w-3.5" />
                      )}
                      <span className="ml-1">Mark all read</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark all notifications as read</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-[350px] overflow-y-auto">
            {isActivitiesLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">
                  Loading notifications...
                </p>
              </div>
            ) : allActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-primary/70" />
                </div>
                <p className="text-center text-muted-foreground">
                  No notifications yet
                </p>
                <p className="text-center text-xs text-muted-foreground mt-1">
                  We&apos;ll notify you about important updates and events.
                </p>
              </div>
            ) : (
              <DropdownMenuGroup>
                {allActivities.map((activity, index) => (
                  <React.Fragment key={activity._id || `socket-${index}`}>
                    <DropdownMenuItem
                      className={`px-4 py-3 cursor-pointer focus:bg-primary/5 ${
                        !activity.read ? "bg-primary/5" : ""
                      }`}
                      onClick={() => handleViewActivity(activity)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm line-clamp-2 ${
                              !activity.read ? "font-semibold" : ""
                            }`}
                          >
                            {activity.message}
                          </p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">
                              {formatActivityDate(activity.createdAt)}
                            </span>
                          </div>
                        </div>
                        {!activity.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </DropdownMenuItem>
                    {index < allActivities.length - 1 && (
                      <DropdownMenuSeparator className="my-0 mx-4" />
                    )}
                  </React.Fragment>
                ))}
              </DropdownMenuGroup>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-black/10 dark:border-white/10 p-2">
            <Button
              variant="ghost"
              className="w-full justify-center text-sm"
              onClick={handleViewAll}
            >
              View All Notifications{" "}
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default NotificationDropdown;
