// components/ProjectDetailsModal.tsx
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Layers,
  ExternalLink
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RoleApplication from './RoleApplication';
import { useRouter } from 'next/navigation';

interface ProjectDetailsModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
const router = useRouter();

 const handlePublisherClick = (e) => {
    e.stopPropagation(); // Prevent any parent click handlers from firing
    if (project.publisher?.username) {
      // Navigate to internal profile page 
      router.push(`/profile/${project.publisher.username}`);
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

        <div className="mt-4">
  <RoleApplication 
    projectId={project._id}
    roles={project.teamStructure?.roles || []}
    publisherId={project.publisher?._id}
    onSuccess={() => {
      // Optionally refresh project data or close modal
      // refreshProjectData();
      // onClose();
    }}
  />
</div>

      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;