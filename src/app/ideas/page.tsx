'use client'
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';

// Example project data (this would come from your API)
const exampleProjects = [
  {
    id: 1,
    title: "AI-Powered Chat Application",
    description: "A real-time chat platform with AI capabilities",
    duration: "2-3 months",
    teamSize: "3-4 members",
    level: "Intermediate",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "OpenAI API"],
    roles: [
      { title: "Frontend Lead", filled: false },
      { title: "Frontend Developer", filled: true },
      { title: "Backend Developer", filled: false },
      { title: "AI/ML Integration Specialist", filled: false }
    ],
    projectDescription: "Build a modern chat application that incorporates AI capabilities for enhanced user interaction. The application will feature real-time messaging, AI-powered message suggestions, and automated responses."
  },
  {
    id: 2,
    title: "E-Learning Platform",
    description: "Interactive learning platform with course management",
    duration: "3-4 months",
    teamSize: "4-5 members",
    level: "Advanced",
    technologies: ["Next.js", "Django", "PostgreSQL", "AWS"],
    roles: [
      { title: "Frontend Developer", filled: false },
      { title: "UI/UX Designer", filled: false },
      { title: "Backend Developer", filled: true },
      { title: "DevOps Engineer", filled: false }
    ],
    projectDescription: "Develop a comprehensive e-learning platform with features like course creation, progress tracking, interactive assessments, and real-time collaboration tools."
  },
  {
    id: 3,
    title: "Fitness Tracking App",
    description: "Mobile-first fitness tracking application",
    duration: "2 months",
    teamSize: "2-3 members",
    level: "Intermediate",
    technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
    roles: [
      { title: "Mobile Developer", filled: false },
      { title: "Backend Developer", filled: false },
      { title: "UI Designer", filled: true }
    ],
    projectDescription: "Create a fitness tracking application with workout planning, progress monitoring, and social features for sharing achievements."
  }
];

const ProjectDetailsModal = ({ project, isOpen, onClose }) => {
    const [isApplying, setIsApplying] = useState(false);
    const availableRoles = project.roles.filter(role => !role.filled);
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border-2 dark:border-zinc-800">
          <DialogHeader className="border-b pb-4 dark:border-zinc-800">
            <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
            <DialogDescription>{project.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Project Stats */}
            <div className="grid grid-cols-3 gap-4 bg-muted/50 dark:bg-zinc-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.teamSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.level}</span>
              </div>
            </div>
  
            {/* Required Technologies */}
            <div className="bg-muted/20 dark:bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Required Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index}>{tech}</Badge>
                ))}
              </div>
            </div>
  
            {/* Project Description */}
            <div className="bg-muted/20 dark:bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Project Description</h3>
              <p className="text-muted-foreground">{project.projectDescription}</p>
            </div>
  
            {/* Team Structure */}
            <div className="bg-muted/20 dark:bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Team Structure</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Required Roles</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {project.roles.map((role, index) => (
                      <li key={index} className={role.filled ? "opacity-50" : ""}>
                        {role.title} {role.filled && "(Filled)"}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Role Responsibilities</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Frontend: UI components, real-time updates</li>
                    <li>UI/UX: Design system, user experience</li>
                    <li>Backend: API, database, WebSocket server</li>
                    <li>AI: ML models, OpenAI integration</li>
                  </ul>
                </div>
              </div>
            </div>
  
            {/* Features */}
            <div className="bg-muted/20 dark:bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Project Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Core Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Real-time messaging system</li>
                    <li>User authentication</li>
                    <li>Message history & search</li>
                    <li>File sharing capabilities</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Advanced Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Smart message suggestions</li>
                    <li>Automated responses</li>
                    <li>Sentiment analysis</li>
                    <li>Language translation</li>
                  </ul>
                </div>
              </div>
            </div>
  
            {/* Learning Outcomes */}
            <div className="bg-muted/20 dark:bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Learning Outcomes</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Real-time application architecture</li>
                <li>AI/ML integration in web applications</li>
                <li>State management in real-time systems</li>
                <li>WebSocket implementation</li>
              </ul>
            </div>
          </div>
  
          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t dark:border-zinc-800">
            {!isApplying ? (
              <>
                <Button 
                  variant="outline"
                  onClick={() => setIsApplying(true)}
                >
                  Apply to Collaborate
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
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role to apply for" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role, index) => (
                      <SelectItem key={index} value={role.title.toLowerCase()}>
                        {role.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
                  >
                    <Code2 className="h-4 w-4" />
                    Submit Application
                  </Button>
                  <Button 
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setIsApplying(false)}
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
  const ProjectCard = ({ project }) => {
    const [isApplying, setIsApplying] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const availableRoles = project.roles.filter(role => !role.filled);
  
    return (
      <>
        <div className="group relative">
          {/* Background shadow element */}
          <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
          
          {/* Main card content */}
          <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 flex flex-col h-full">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            
            <div className="flex-grow">
              <CardContent className="space-y-4">
                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.teamSize}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.level}</span>
                  </div>
                </div>
  
                {/* Required Technologies */}
                <div>
                  <h3 className="text-sm font-medium mb-1">Technologies</h3>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                </div>
  
                {/* Available Roles */}
                <div>
                  <h3 className="text-sm font-medium mb-1">Available Roles</h3>
                  <div className="flex flex-wrap gap-1">
                    {project.roles.map((role, index) => (
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
                      size="lg"
                      onClick={() => setIsApplying(true)}
                    >
                      Apply to Collaborate
                    </Button>
                    <Button 
                      className="w-full bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                      size="lg"
                      onClick={() => setShowDetails(true)}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role to apply for" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role, index) => (
                          <SelectItem key={index} value={role.title.toLowerCase()}>
                            {role.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                        size="lg"
                      >
                        <Code2 className="h-4 w-4" />
                        Apply
                      </Button>
                      <Button 
                        className="flex-1 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                        size="lg"
                        onClick={() => setIsApplying(false)}
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


const ProjectIdeasPage = () => {
    return (
      <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <div className="container px-4 mx-auto py-8">
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent font-orbitron">
                  Available Projects
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Browse through available projects and find opportunities to collaborate with other developers.
                </p>
              </div>
  
              {/* Projects Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {exampleProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
    </div>
    </PageTransition>
  );
};

export default ProjectIdeasPage;