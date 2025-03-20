import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  X, 
  Loader2, 
  ChevronRight,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useGetMyCollaborationRequestsQuery, useSubmitCollaborationRequestMutation } from '@/app/api/collaborationApiSlice';

interface Role {
  title: string;
  skills: string[];
  responsibilities: string[];
  filled: boolean;
}

interface CompactRoleApplicationProps {
  projectId: string;
  roles: Role[];
  publisherId: string;
  onSuccess?: () => void;
  onViewDetails?: () => void;
}

const CompactRoleApplication = ({ projectId, roles, publisherId, onSuccess, onViewDetails }: CompactRoleApplicationProps) => {
  const { user, isAuthenticated, login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitRequest, { isLoading: isSubmitting }] = useSubmitCollaborationRequestMutation();
  const { data: myRequestsData } = useGetMyCollaborationRequestsQuery();

  const [appliedRoles, setAppliedRoles] = useState<string[]>([]);

  // Get roles user hasn't applied for yet
  const availableRoles = roles.filter(
    role => !role.filled && !appliedRoles.includes(role.title)
  );

  useEffect(() => {
    if (myRequestsData?.requests && projectId) {
      // Extract roles user has already applied for in this project
      const applied = myRequestsData.requests
        .filter(request => request.projectId._id === projectId)
        .map(request => request.role);
      
      setAppliedRoles(applied);
    }
  }, [myRequestsData, projectId]);

  // Check if current user is the publisher
  const isPublisher = user?._id === publisherId;

  // Handle role selection
  const handleRoleSelect = (role: string) => {
    if (!isAuthenticated) {
      login().catch(error => console.error('Login error:', error));
      return;
    }

    // Don't allow selection if user is the publisher
    if (isPublisher) {
      toast.info("This is your project. You already have a role assigned!");
      return;
    }

    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  // Submit application
  const handleSubmitApplication = async () => {
    if (!selectedRole) return;
    
    try {
      await submitRequest({
        projectId,
        role: selectedRole,
        message: applicationMessage.trim()
      }).unwrap();
      
      toast.success('Application submitted successfully!');
      setIsDialogOpen(false);
      setApplicationMessage('');
      
      // Update local state
      setAppliedRoles(prev => [...prev, selectedRole]);
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.data?.message || 'Failed to submit application');
    }
  };

  return (
    <>
      <div className="space-y-4 relative z-30">
        {/* Header with slight shadow to separate from card content */}
        <div className="border-b pb-2">
          <h3 className="text-base font-medium flex items-center">
            <Users className="mr-2 h-4 w-4 text-primary" />
            Select a Role
          </h3>
          <p className="text-xs text-muted-foreground">
            Choose a role that matches your skills
          </p>
        </div>

        {/* Compact role list with hover states */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {availableRoles.length > 0 ? (
            availableRoles.map((role) => (
              <div 
                key={role.title}
                className="border rounded-md p-2 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer relative z-30"
                onClick={() => handleRoleSelect(role.title)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{role.title}</span>
                  <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    Apply
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {role.skills.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                  {role.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{role.skills.length - 3}</Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 border border-dashed rounded-md">
              <p className="text-muted-foreground text-sm">
                {roles.every(role => role.filled) 
                  ? "All roles are currently filled" 
                  : "You've applied to all available roles"}
              </p>
            </div>
          )}
        </div>
        
        {/* View details button */}
        <div className="pt-2 border-t">
          <Button 
            variant="outline" 
            className="w-full text-sm"
            onClick={onViewDetails}
          >
            View Full Project Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px] bg-white dark:bg-black border border-black/20 dark:border-white/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Apply for {selectedRole}</DialogTitle>
            <DialogDescription>
              Share why you&apos;re interested in this role and what skills you bring to the project.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <Textarea
              placeholder="Tell the project owner why you're a good fit for this role..."
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              className="h-32 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Your message is optional but helps the project owner understand your interest and qualifications.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
              className="gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompactRoleApplication;