'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Layers,
  Share2,
  Code2,
  ExternalLink,
  CopyCheck,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '@/app/types/projectTypes';
import { usePublishProjectMutation, useStartProjectMutation } from '@/app/api/projectApiSlice';
import { useRouter } from 'next/navigation';

interface ProjectDetailsProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetails = ({ project, isOpen, onClose }: ProjectDetailsProps) => {
  const router = useRouter();
  const [publishProject, { isLoading: isPublishing }] = usePublishProjectMutation();
  const [startProject, { isLoading: isStarting }] = useStartProjectMutation();
  
  if (!project) return null;
  
  const handleShare = () => {
    // Check if navigator.share is available (mostly on mobile)
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: `${window.location.origin}/projects/${project._id}`,
      })
      .then(() => toast.success('Project shared successfully!'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback to clipboard copy
      navigator.clipboard.writeText(`${window.location.origin}/projects/${project._id}`)
        .then(() => toast.success('Project link copied to clipboard!'))
        .catch((error) => console.error('Error copying to clipboard:', error));
    }
  };
  
  const handlePublish = async () => {
    try {
      await publishProject(project._id).unwrap();
      toast.success('Project published successfully!');
      onClose();
    } catch (error) {
      // Display the error message from the backend
      toast.error(error.data?.message || 'Failed to publish project');
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-background border-2 border-black/10 dark:border-white/10 dark:bg-black dark:bg-opacity-95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
          <DialogDescription>{project.subtitle}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Project Stats */}
          <div className="grid grid-cols-3 gap-4 bg-muted/50 dark:bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.duration.estimate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.teamSize.count}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.complexity.level}</span>
            </div>
          </div>

          {/* Project Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            {project.isPublished ? (
              <Badge variant="default" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                <CheckCircle className="h-3 w-3 mr-1" /> Published
              </Badge>
            ) : project.isSaved ? (
              <Badge variant="default" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                <CopyCheck className="h-3 w-3 mr-1" /> Saved
              </Badge>
            ) : (
              <Badge variant="default" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                Draft
              </Badge>
            )}
          </div>

          {/* Required Technologies */}
          <div>
            <h3 className="text-sm font-medium mb-2">Required Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <Badge key={index}>{tech}</Badge>
              ))}
            </div>
          </div>

          {/* Project Description */}
          <div>
            <h3 className="text-sm font-medium mb-2">Project Description</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          {/* Team Structure */}
          <div>
            <h3 className="text-sm font-medium mb-2">Team Structure</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Required Roles</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {project.teamStructure.roles.map((role, index) => (
                    <li key={index}>{role.title}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Role Responsibilities</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {project.teamStructure.roles.map((role, index) => (
                    <li key={index}>{role.responsibilities[0]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-sm font-medium mb-2">Project Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Core Features</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {project.features.core.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Additional Features</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {project.features.additional.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div>
            <h3 className="text-sm font-medium mb-2">Learning Outcomes</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {project.learningOutcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline"
            className="gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          
          {!project.isPublished && (
            <Button 
              className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              <ExternalLink className="h-4 w-4" />
              {isPublishing ? 'Publishing...' : 'Publish Project'}
            </Button>
          )}
          
        
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetails;