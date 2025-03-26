'use client';

import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardDescription, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ArrowRight,
  Sparkles,
  BookOpen,
  Loader2
} from "lucide-react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import TechBackground from '@/components/TechBackground';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import IncomingRequestsManager from '@/components/IncomingRequestsManager';
import MyRequestsManager from '@/components/MyRequestsManager';
import { useGetMyCollaborationsQuery } from '@/app/api/collaborationApiSlice';
import DiscordIntegration from '@/components/DiscordIntegration';
import GitHubIntegration from '@/components/GitHubIntegration';

const CollaborationsPage = () => {
  const router = useRouter();
  
  
  // Get actual collaboration data
  const { 
    data: myCollaborationsData, 
    isLoading: myCollaborationsLoading,
    error: myCollaborationsError
  } = useGetMyCollaborationsQuery();
  //  custom CSS for the blue background patterns and effects
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .tech-grid-bg {
        background-image: linear-gradient(to right, rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      
      .blue-glow {
        background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const getStatusBadge = (status: any) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border-yellow-500/20">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 dark:text-green-400 border-green-500/20">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20">Rejected</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20">Active</Badge>;
      default:
        return null;
    }
  };

  const handleMemberProfileClick = (username: string) => {
    if (username) {
      router.push(`/profile/${username}`);
    }
  };

  // const formatDate = (dateString) => {
  //   if (!dateString) return 'N/A';
    
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', { 
  //     year: 'numeric', 
  //     month: 'long', 
  //     day: 'numeric' 
  //   });
  // };

  // Extract all unique projects from collaborations data
  const getMyProjects = () => {
    if (!myCollaborationsData?.collaborations) return [];
    
    // const projects = [];
    
    // Add projects where user is owner
    const ownedProjects = myCollaborationsData.collaborations
      .filter(collab => collab.type === 'owner' && collab.project)
      .map(collab => ({
        ...collab.project,
        role: 'Project Owner',
        status: 'active'
      }));
    
    // Add projects where user is a collaborator
    const collaborativeProjects = myCollaborationsData.collaborations
      .filter(collab => collab.type === 'member' && collab.project)
      .map(collab => ({
        ...collab.project,
        role: collab.role,
        status: 'active',
        joinedAt: collab.joinedAt
      }));
    
    return [...ownedProjects, ...collaborativeProjects];
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-background tech-grid-bg relative overflow-hidden">
        <Header />
        <TechBackground />
        
        {/* Subtle blue glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blue-glow -z-10 opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blue-glow -z-10 opacity-60"></div>
        
        <div className="container px-4 mx-auto py-8">
          <div className="space-y-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-20 font-orbitron relative inline-block">
                <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                  My
                </span>{" "}
                <span className="text-black dark:text-white">
                  Collaborations
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/50"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Track and manage all your project collaborations in one place
              </p>
            </motion.div>

            <Tabs defaultValue="my-requests" className="space-y-6">
              <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto p-1">
                <TabsTrigger value="my-requests" className="py-2.5">
                  My Requests
                </TabsTrigger>
                <TabsTrigger value="incoming-requests" className="py-2.5">
                  Incoming Requests
                </TabsTrigger>
                <TabsTrigger value="my-projects" className="py-2.5">
                  My Projects
                </TabsTrigger>
              </TabsList>

              {/* My Requests Tab */}
              <TabsContent value="my-requests">
                <MyRequestsManager />
              </TabsContent>

              {/* Incoming Requests Tab */}
              <TabsContent value="incoming-requests">
                <IncomingRequestsManager />
              </TabsContent>

             {/* My Projects Tab */}
<TabsContent value="my-projects">
  {myCollaborationsLoading ? (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ) : myCollaborationsError ? (
    <div className="text-center py-10">
      <p className="text-red-500 mb-4">Error loading collaborations</p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  ) : getMyProjects().length > 0 ? (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      {getMyProjects().map((project) => (
        <motion.div 
          key={project._id} 
          className="group relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg transform rotate-1 transition-transform duration-300 group-hover:rotate-0"></div>
          <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
          <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div>
                  <CardTitle className="text-lg sm:text-xl break-words">{project.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Your role: {project.role}
                  </CardDescription>
                </div>
                {getStatusBadge(project.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech:any, index:number) => (
                    <Badge key={index} variant="outline" className="mb-1">{tech}</Badge>
                  ))}
                </div>
                
                {/* Team Members */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Team Members</h4>
                  <div className="flex flex-wrap gap-4">
                    {project.teamMembers?.length > 0 ? (
                      project.teamMembers.map((member:any, index:number) => {
                        // Handle different data structures that might come from API
                        const userId = member.userId;
                        const memberName = userId?.name || "Team Member";
                        const memberUsername = userId?.username || "user";
                        const memberAvatar = userId?.avatar || `https://avatar.vercel.sh/${memberUsername}`;
                        const memberRole = member.role || "Collaborator";
                        
                        return (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <Avatar 
  className="h-8 w-8 cursor-pointer" 
  onClick={() => handleMemberProfileClick(memberUsername)}
>
                              <AvatarImage 
                                src={memberAvatar}
                                alt={memberName}
                                onError={(e) => {
                                  e.currentTarget.src = `https://avatar.vercel.sh/${memberUsername}`;
                                }}
                              />
                              <AvatarFallback>{memberName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                            <p 
    className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
    onClick={() => handleMemberProfileClick(memberUsername)}
  >
    {memberName}
  </p>
  <p className="text-xs text-muted-foreground">{memberRole}</p>
</div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No team members yet</p>
                    )}
                  </div>
                </div>

                {/* Open Roles */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Open Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.teamStructure?.roles
                      ?.filter((role:any) => !role.filled)
                      .map((role:any, index:number) => (
                        <Badge key={index} variant="outline" className="mb-1">{role.title}</Badge>
                      ))
                    }
                    {!project.teamStructure?.roles || 
                     project.teamStructure.roles.filter((role:any) => !role.filled).length === 0 && (
                      <span className="text-sm text-muted-foreground">All roles filled</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-end gap-2">
              <DiscordIntegration projectId={project._id} />
              <GitHubIntegration 
                projectId={project._id} 
                isOwner={project.role === 'Project Owner'} 
              />
              <Button 
                className="gap-2 mt-2 sm:mt-0 w-full sm:w-auto"
                onClick={() => router.push(`/projects/${project._id}`)}
              >
                View Project <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  ): (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-4 sm:p-10 rounded-lg border border-black/10 dark:border-white/10 text-center"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <BookOpen className="h-8 w-8 text-primary/70" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Active Projects</h3>
      <p className="text-muted-foreground mb-6">
        You don&apos;t have any active projects yet. Create a project or join an existing one to get started.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button variant="outline" className="gap-2" onClick={() => router.push("/ideas")}>
          <Users className="h-4 w-4" />
          Browse Projects
        </Button>
        <Button
          className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
          onClick={() => router.push("/generate")}
        >
          <Sparkles className="h-4 w-4" />
          Create a Project
        </Button>
      </div>
    </motion.div>
  )}
</TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Footer />
      </main>
    </PageTransition>
  );
};

export default CollaborationsPage;