// components/ProjectCard.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Layers,
  ChevronRight,
  Code2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSubmitCollaborationRequestMutation } from '@/app/api/collaborationApiSlice';
import ProjectDetailsModal from './ProjectDetailsModal';

interface ProjectCardProps {
  project: any;
  height?: number;
}

const ProjectCard = ({ project, height = 300 }: ProjectCardProps) => {
  const [isApplying, setIsApplying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  
  const [submitRequest, { isLoading: isSubmitting }] = useSubmitCollaborationRequestMutation();
  
  const availableRoles = project.teamStructure?.roles?.filter(role => !role.filled) || [];

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
        message: ""
      }).unwrap();
      
      toast.success('Application submitted successfully!');
      setIsApplying(false);
      setSelectedRole('');
    } catch (error: any) {
      console.error('Submit application error:', error);
      toast.error(error.data?.message || 'Failed to submit application');
    }
  };
  

  const handlePublisherClick = (e) => {
    e.stopPropagation(); // Prevent any parent click handlers from firing
    if (project.publisher?.username) {
      // Navigate to internal profile page instead of GitHub
      router.push(`/profile/${project.publisher.username}`);
    }
  };

  return (
    <>
      <div className="group relative">
        {/* Tilted blue gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg transform rotate-2 transition-transform duration-300 group-hover:rotate-1"></div>
        
        {/* Shadow element */}
        <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2"></div>
        
        {/* Main card content */}
        <Card 
          className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 flex flex-col overflow-hidden"
          style={{ height: `${height}px` }}
        >
          {/* Blue gradient effects inside card */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-600/5 to-blue-400/5 dark:from-blue-700/5 dark:to-blue-400/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-400/5 to-blue-600/5 dark:from-blue-400/5 dark:to-blue-700/5 rounded-full blur-2xl"></div>
          </div>
          
          <CardHeader className="space-y-2 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl line-clamp-1">{project.title}</CardTitle>
                <CardDescription className="line-clamp-1">{project.subtitle || project.description}</CardDescription>
              </div>
              
              {/* Publisher avatar */}
              {project.publisher && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-pointer" onClick={handlePublisherClick}>
                        <Avatar className="h-8 w-8 border border-black/10 dark:border-white/10 hover:border-primary/50 transition-colors">
                          <AvatarImage 
                            src={project.publisher.avatar} 
                            alt={project.publisher.name}
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://avatar.vercel.sh/${project.publisher.username || 'user'}`;
                            }} 
                          />
                          <AvatarFallback className="bg-primary/10">
                            {project.publisher.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{project.publisher.name}</p>
                      <p className="text-xs text-muted-foreground">@{project.publisher.username}</p>
                      <p className="text-xs text-primary">Click to view GitHub profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </CardHeader>
          
          <div className="flex-1 overflow-auto">
            <CardContent className="space-y-4">
              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.duration?.estimate || "2-3 months"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.teamSize?.count || "3-4 members"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.complexity?.level || "Intermediate"}</span>
                </div>
              </div>

              {/* Required Technologies */}
              <div>
                <h3 className="text-sm font-medium mb-1">Technologies</h3>
                <div className="flex flex-wrap gap-1">
                  {project.technologies?.slice(0, 5).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{tech}</Badge>
                  ))}
                  {project.technologies?.length > 5 && 
                    <Badge variant="outline" className="text-xs">+{project.technologies.length - 5}</Badge>
                  }
                </div>
              </div>

              {/* Available Roles */}
              <div>
                <h3 className="text-sm font-medium mb-1">Available Roles</h3>
                <div className="flex flex-wrap gap-1">
                  {project.teamStructure?.roles?.map((role, index) => (
                    <Badge 
                      key={index}
                      variant={role.filled ? "secondary" : "default"}
                      className={`text-xs ${role.filled ? "opacity-50" : ""}`}
                    >
                      {role.title} {role.filled && "(Filled)"}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </div>

          <CardFooter className="mt-auto pt-6 border-t">
            <div className="w-full flex flex-col gap-2">
              {!isApplying ? (
                <>
                  <Button 
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                    onClick={handleApply}
                    disabled={!availableRoles.length}
                  >
                    {availableRoles.length ? "Apply to Collaborate" : "All Roles Filled"}
                  </Button>
                  <Button 
                    className="w-full bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                    onClick={() => setShowDetails(true)}
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
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
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                      onClick={handleSubmitApplication}
                      disabled={isSubmitting}
                    >
                      <Code2 className="h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Apply"}
                    </Button>
                    <Button 
                      className="flex-1 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                      onClick={() => setIsApplying(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      <ProjectDetailsModal 
        project={project}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
};

export default ProjectCard;