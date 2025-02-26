// components/ProjectDetailsModal.tsx
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Layers,
  Star,
  Code2,
  ExternalLink
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { useSubmitCollaborationRequestMutation } from '@/app/api/collaborationApiSlice';

interface ProjectDetailsModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  const [isApplying, setIsApplying] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState('');
  const { isAuthenticated, login } = useAuth();
  
  const [submitRequest, { isLoading: isSubmitting }] = useSubmitCollaborationRequestMutation();
  
  const availableRoles = project?.teamStructure?.roles?.filter(role => !role.filled) || [];

  const handleApply = async () => {
    if (!isAuthenticated) {
      try {
        await login();
        toast.info('Please try applying after logging in');
      } catch (error) {
        console.error('Login error:', error);
      }
      return;
    }
    
    setIsApplying(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    try {
      await submitRequest({
        projectId: project._id,
        role: selectedRole,
        message
      }).unwrap();
      
      toast.success('Application submitted successfully!');
      setIsApplying(false);
      setSelectedRole('');
      setMessage('');
      onClose();
    } catch (error: any) {
      console.error('Submit application error:', error);
      toast.error(error.data?.message || 'Failed to submit application');
    }
  };

  const handlePublisherClick = () => {
    if (project?.publisher?.username) {
      window.open(`https://github.com/${project.publisher.username}`, '_blank');
    }
  };
  
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white dark:bg-black border-2 border-black/20 dark:border-white/20">
        <DialogHeader className="border-b pb-4 border-black/10 dark:border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
              <DialogDescription className="text-base">{project.subtitle}</DialogDescription>
            </div>
            
            {/* Publisher info */}
            {project.publisher && (
              <div className="flex items-center gap-2 cursor-pointer" onClick={handlePublisherClick}>
                <Avatar className="h-10 w-10 border border-black/10 dark:border-white/10 hover:border-primary/50 transition-colors">
                  <AvatarImage 
                    src={project.publisher.avatar} 
                    alt={project.publisher.name}
                    onError={(e) => {
                      e.currentTarget.src = `https://avatar.vercel.sh/${project.publisher.username || 'user'}`;
                    }}
                  />
                  <AvatarFallback>{project.publisher.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{project.publisher.name}</p>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-xs">Published by</p>
                </div>
              </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Project Stats */}
          <div className="grid grid-cols-3 gap-4 bg-muted/50 dark:bg-black/30 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.duration?.estimate || "2-3 months"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.teamSize?.count || "3-4 members"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.complexity?.level || "Intermediate"}</span>
            </div>
          </div>

          {/* Required Technologies */}
          <div className="bg-muted/20 dark:bg-black/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Required Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, index) => (
                <Badge key={index}>{tech}</Badge>
              ))}
            </div>
          </div>

          {/* Project Description */}
          <div className="bg-muted/20 dark:bg-black/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Project Description</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          {/* Team Structure */}
          <div className="bg-muted/20 dark:bg-black/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Team Structure</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Required Roles</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {project.teamStructure?.roles?.map((role, index) => (
                    <li key={index} className={role.filled ? "opacity-50" : ""}>
                      {role.title} {role.filled && "(Filled)"}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Role Responsibilities</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {project.teamStructure?.roles?.slice(0, 4).map((role, index) => (
                    <li key={index}>
                      {role.title}: {role.responsibilities?.[0] || "Project responsibilities"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-muted/20 dark:bg-black/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Project Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Core Features</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {project.features?.core?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Additional Features</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {project.features?.additional?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="bg-muted/20 dark:bg-black/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Learning Outcomes</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {project.learningOutcomes?.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-black/10 dark:border-white/10">
          {!isApplying ? (
            <>
              <Button 
                variant="outline"
                className="gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5"
                onClick={handleApply}
                disabled={!availableRoles.length}
              >
                <Star className="h-4 w-4" />
                {availableRoles.length ? "Apply to Collaborate" : "All Roles Filled"}
              </Button>
              <Button 
                variant="ghost"
                onClick={onClose}
              >
                Close
              </Button>
            </>
          ) : (
            <div className="w-full space-y-4">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role to apply for" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role, index) => (
                    <SelectItem key={index} value={role.title}>
                      {role.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <textarea
                className="w-full p-3 border border-black/10 dark:border-white/10 rounded-md bg-transparent resize-none"
                rows={3}
                placeholder="Why do you want to join this project? (Optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting}
                >
                  <Code2 className="h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
                <Button 
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setIsApplying(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;