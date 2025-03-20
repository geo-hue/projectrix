import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  AlertCircle,
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

interface RoleApplicationProps {
  projectId: string;
  roles: Role[];
  publisherId: string;
  onSuccess?: () => void;
}

const RoleApplication = ({ projectId, roles, publisherId, onSuccess }: RoleApplicationProps) => {
  const { user, isAuthenticated, login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitRequest, { isLoading: isSubmitting }] = useSubmitCollaborationRequestMutation();
  const { data: myRequestsData } = useGetMyCollaborationRequestsQuery();

  const [appliedRoles, setAppliedRoles] = useState<string[]>([]);

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
      // Check if user has already applied for this role
      const result = await submitRequest({
        projectId,
        role: selectedRole,
        message: applicationMessage.trim()
      }).unwrap();
      console.log(result)
      toast.success('Application submitted successfully!');
      setIsDialogOpen(false);
      setApplicationMessage('');
      
      // Update local state if needed
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      // Display specific error message from API if available
      toast.error(error.data?.message || 'Failed to submit application');
    }
  };


  return (
    <>
      <Card className="bg-white dark:bg-black border border-black/20 dark:border-white/20 mb-6">
        <CardContent className="p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Available Roles
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select a role to apply for this project collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
          {roles.map((role) => (
  <div 
    key={role.title}
    className={`border rounded-lg p-4 transition-colors 
      ${role.filled 
        ? 'bg-muted/20 border-muted/30' 
        : appliedRoles.includes(role.title)
          ? 'bg-blue-500/10 border-blue-500/20'
          : 'border-black/20 dark:border-white/20 hover:bg-primary/5'
      }
    `}
  >
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-medium">{role.title}</h4>
      {role.filled ? (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Filled
        </Badge>
      ) : appliedRoles.includes(role.title) ? (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
          Applied
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
          Available
        </Badge>
      )}
    </div>     
                <div className="text-sm text-muted-foreground mb-3">
                  <strong>Responsibilities:</strong>
                  <ul className="ml-5 mt-1 list-disc space-y-1">
                    {role.responsibilities.slice(0, 2).map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {role.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>
                
                <Button
      className="w-full text-center text-sm mt-2"
      variant={role.filled || appliedRoles.includes(role.title) ? "outline" : "default"}
      disabled={role.filled || isPublisher || appliedRoles.includes(role.title)}
      onClick={() => handleRoleSelect(role.title)}
    >
      {role.filled 
        ? 'Role Filled' 
        : isPublisher 
          ? 'Your Project'
          : appliedRoles.includes(role.title)
            ? 'Application Submitted'
            : 'Apply for Role'
      }
    </Button>
  </div>
))}
          </div>

          {roles.length === 0 && (
            <div className="p-6 text-center border border-dashed rounded-lg">
              <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No roles defined for this project</p>
            </div>
          )}
        </CardContent>
      </Card>

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

export default RoleApplication;