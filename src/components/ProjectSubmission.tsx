import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Code2, Clock, Users, Layers } from 'lucide-react';
import { TechSelect } from '@/components/TechSelect';

interface ProjectData {
    title: string;
    description: string;
    technologies: string[];
    status: string;
    teamSize: string;
    duration: string;
    complexity: number;
  }

  
  interface Metrics {
    duration: {
      [key: string]: string;
    };
    teamSize: {
      [key: string]: string;
    };
  }

// Helper function to format the text with basic markdown
const formatDescription = (text: string) => {
    if (!text) return '';
    
    // Split into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph: string, index: number) => {
      // Check if the paragraph starts with "- " or "* " for bullet points
      if (paragraph.trim().match(/^[-*]\s/)) {
        return (
          <li key={index} className="ml-6 text-muted-foreground">
            {paragraph.trim().substring(2)}
          </li>
        );
      }
      // Regular paragraph
      return (
        <p key={index} className="text-muted-foreground mb-4">
          {paragraph}
        </p>
      );
    });
  };

// Helper function to format duration and team size
const formatMetric = (value: string, type: 'duration' | 'teamSize') => {
    const metrics: Metrics = {
      duration: {
        '1-2': '1-2 months',
        '3-6': '3-6 months',
        '6+': '6+ months'
      },
      teamSize: {
        '2-3': '2-3 members',
        '4-6': '4-6 members',
        '6+': '6+ members'
      }
    };
    
    return metrics[type]?.[value] || value;
  };

  const ProjectSubmission = () => {
    const [hasStartedTyping, setHasStartedTyping] = useState(false);
    const [projectData, setProjectData] = useState<ProjectData>({
      title: "",
      description: "",
      technologies: [],
      status: "",
      teamSize: "",
      duration: "",
      complexity: 50
    });
  
    const handleInputChange = (field: keyof ProjectData, value: ProjectData[keyof ProjectData]) => {
      if (!hasStartedTyping) setHasStartedTyping(true);
      setProjectData(prev => ({ ...prev, [field]: value }));
    };
  
    const getComplexityLabel = (value: number): string => {
      if (value <= 33) return "Beginner";
      if (value <= 66) return "Intermediate";
      return "Advanced";
    };

  return (
    <section className="container px-4 mx-auto pt-8 pb-8">
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent font-orbitron"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Have a Project Idea?
        </motion.h2>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Share your existing project idea and find collaborators to help bring it to life.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
    <motion.div className="lg:col-span-2" layout>
      <div className="group relative">
        {/* Background shadow element */}
        <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
        
        {/* Main card */}
        <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Share your project information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Project Title</Label>
                <Input 
                  placeholder="Enter project title"
                  value={projectData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Project Description</Label>
                <div className="space-y-2">
                  <textarea 
                    placeholder="Describe your project idea...
- Use new lines for paragraphs
- Start lines with - or * for bullet points"
                    className="w-full min-h-32 p-3 rounded-md border bg-background text-sm"
                    value={projectData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use new lines for paragraphs. Start lines with - or * for bullet points.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Technologies</Label>
                <TechSelect
                  onSelect={(techs) => handleInputChange('technologies', techs)}
                />
              </div>

              <div className="space-y-2">
                <Label>Project Status</Label>
                <Select onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning Phase</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Team Size</Label>
                  <Select onValueChange={(value) => handleInputChange('teamSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-3">2-3 Members</SelectItem>
                      <SelectItem value="4-6">4-6 Members</SelectItem>
                      <SelectItem value="6+">6+ Members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select onValueChange={(value) => handleInputChange('duration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 months</SelectItem>
                      <SelectItem value="3-6">3-6 months</SelectItem>
                      <SelectItem value="6+">6+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Project Complexity</Label>
                <Slider
                  value={[projectData.complexity]}
                  onValueChange={(value) => handleInputChange('complexity', value[0])}
                  max={100}
                  step={1}
                  className="slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
            <Button 
  className="w-full gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
>
  <Code2 className="h-4 w-4" />
  Submit Project
</Button>
            </CardFooter>
          </Card>
          </div>
        </motion.div>

        {hasStartedTyping && (
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
             <div className="group relative">
          {/* Background shadow element */}
          <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
          
          {/* Main card */}
          <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
              <CardHeader>
                <CardTitle>{projectData.title || "Project Title"}</CardTitle>
                <CardDescription>Project Preview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatMetric(projectData.duration, 'duration') || "Duration"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatMetric(projectData.teamSize, 'teamSize') || "Team Size"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{getComplexityLabel(projectData.complexity)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Required Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {projectData.technologies.map(tech => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Project Description</h3>
                  <div className="space-y-2">
                    {projectData.description ? 
                      formatDescription(projectData.description) : 
                      <p className="text-muted-foreground">Add a description to see it here...</p>
                    }
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Project Status</h3>
                  <Badge variant="outline">{projectData.status || "Not specified"}</Badge>
                </div>
              </CardContent>
            </Card>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectSubmission;