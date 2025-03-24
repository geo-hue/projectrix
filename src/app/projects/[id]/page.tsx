'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechBackground from '@/components/TechBackground';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Clock,
  Users,
  Layers,
  ChevronLeft,
  User,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { useGetPublishedProjectQuery } from '@/app/api/publishedProjectsApiSlice';
import { useGetProjectQuery } from '@/app/api/projectApiSlice';
import { toast } from 'sonner';
import RoleApplication from '@/components/RoleApplication';
import DiscordIntegration from '@/components/DiscordIntegration';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [isCollaborator, setIsCollaborator] = useState(false);
  
  // Try to get project from both endpoints (published and user's own)
  const { 
    data: publishedProjectData, 
    isLoading: publishedLoading,
    error: publishedError
  } = useGetPublishedProjectQuery(id as string, {
    skip: !id
  });
  
  const { 
    data: userProjectData, 
    isLoading: userProjectLoading,
    error: userProjectError
  } = useGetProjectQuery(id as string, {
    skip: !id || !isAuthenticated
  });
  
  
  // Merge data from both sources (prefer user's own project data if available)
  const projectData = userProjectData?.project || publishedProjectData?.project;
  const isLoading = (publishedLoading && userProjectLoading) || (!projectData && !publishedError && !userProjectError);
  const hasError = (!projectData && (publishedError || userProjectError));
  
  // Check if user is owner or collaborator
  useEffect(() => {
    if (projectData && user) {
      // Check if user is owner
      setIsOwner(projectData.userId?._id === user._id || projectData.userId === user._id);
      
      // Check if user is collaborator
      const isCollab = projectData.teamMembers?.some(
        member => member.userId === user._id || member.userId?._id === user._id
      );
      setIsCollaborator(isCollab);
    }
  }, [projectData, user]);
  
  
  // Function to get the roles that are already filled
  const getFilledRoles = () => {
    if (!projectData?.teamStructure?.roles) return [];
    return projectData.teamStructure.roles.filter(role => role.filled);
  };
  
  // Function to get the roles that are still available
  const getAvailableRoles = () => {
    if (!projectData?.teamStructure?.roles) return [];
    return projectData.teamStructure.roles.filter(role => !role.filled);
  };
  
  // Check if a user can apply for roles
  const canApplyForRoles = isAuthenticated && !isOwner && getAvailableRoles().length > 0;
  
  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative overflow-hidden">
        <Header />
        <TechBackground />
        
        {/* Subtle blue glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 -z-10 opacity-60 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-400/10 -z-10 opacity-60 blur-3xl"></div>
        
        <div className="container px-4 mx-auto py-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mt-20 mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="ml-2 text-xl">Loading project details...</span>
            </div>
          ) : hasError ? (
            <div className="text-center py-20">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
              </p>
              <Button onClick={() => router.push('/ideas')}>
                Browse Projects
              </Button>
            </div>
          ) : projectData && (
            <div className="space-y-8">
              {/* Project Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-xl transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
                
                <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 overflow-hidden">
                  {/* Blue gradient background effect */}
                  <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/10 to-blue-400/10 dark:from-blue-700/10 dark:to-blue-400/10 rounded-full blur-3xl"></div>
                  
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                          {projectData.title}
                        </CardTitle>
                        <CardDescription className="text-lg mt-1">
                          {projectData.subtitle}
                        </CardDescription>
                      </div>
                      
                      {/* Project Owner */}
                      {projectData.userId && (
                        <div className="flex items-center bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage 
                              src={projectData.publisher?.avatar || projectData.userId.avatar} 
                              alt="Project Owner"
                              onError={(e) => {
                                e.currentTarget.src = `https://avatar.vercel.sh/user`;
                              }}
                            />
                            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">
                              {projectData.publisher?.name || projectData.userId.name || "Project Owner"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Created this project
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Project Stats */}
                    <div className="grid grid-cols-3 gap-4 bg-muted/20 p-4 rounded-lg mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{projectData.duration?.estimate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{projectData.teamSize?.count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{projectData.complexity?.level}</span>
                      </div>
                    </div>
                    
                    {/* Project Description */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Project Description</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {projectData.description}
                      </p>
                    </div>
                    
                    {/* Technologies */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {projectData.technologies?.map((tech, index) => (
                          <Badge key={index} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <DiscordIntegration projectId={projectData._id} />
                  </CardContent>
                </Card>
              </motion.div>
              
          {/* Project Team - Updated Code */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
>
  <h2 className="text-2xl font-bold mb-4">Project Team</h2>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Filled Roles */}
    {getFilledRoles().map((role, index) => {
      // Find team member with this role
      const teamMember = projectData.teamMembers?.find(m => m.role === role.title);
      
      // Access userId properly considering it might be a populated object or an ID
      const memberUserId = teamMember?.userId || {};
      const memberName = typeof memberUserId === 'object' && memberUserId.name 
        ? memberUserId.name 
        : "Team Member";
      const memberUsername = typeof memberUserId === 'object' && memberUserId.username 
        ? memberUserId.username 
        : `user-${index}`;
      const memberAvatar = typeof memberUserId === 'object' && memberUserId.avatar 
        ? memberUserId.avatar 
        : `https://avatar.vercel.sh/${memberUsername}`;
        
      return (
        <Card 
          key={`filled-${index}`} 
          className="bg-white dark:bg-black border border-black/20 dark:border-white/20"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-lg">{role.title}</CardTitle>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Filled
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {teamMember && (
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={memberAvatar} 
                    alt={memberName}
                    onError={(e) => {
                      e.currentTarget.src = `https://avatar.vercel.sh/${memberUsername}`;
                    }}
                  />
                  <AvatarFallback>{memberName.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">
                    {memberName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Joined {new Date(teamMember.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium mb-1">Skills:</div>
                <div className="flex flex-wrap gap-1">
                  {role.skills?.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Responsibilities:</div>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {role.responsibilities?.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
</motion.div>
              
              {/* Available Roles and Application */}
              {getAvailableRoles().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold mb-4">Available Roles</h2>
                  
                  {canApplyForRoles ? (
                    <RoleApplication 
                      projectId={projectData._id}
                      roles={projectData.teamStructure?.roles || []}
                      publisherId={projectData.userId?._id || projectData.userId}
                      onSuccess={() => router.refresh()}
                    />
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getAvailableRoles().map((role, index) => (
                        <Card 
                          key={`available-${index}`} 
                          className="bg-white dark:bg-black border border-black/20 dark:border-white/20"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{role.title}</CardTitle>
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                                Available
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <div className="text-sm font-medium mb-1">Skills:</div>
                                <div className="flex flex-wrap gap-1">
                                  {role.skills?.map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium mb-1">Responsibilities:</div>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                  {role.responsibilities?.map((resp, idx) => (
                                    <li key={idx}>{resp}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            {isAuthenticated ? (
                              <Button 
                                className="w-full"
                                onClick={() => toast.info('Please apply for roles in the application form above')}
                              >
                                Apply For Role
                              </Button>
                            ) : (
                             <Button 
                             className="w-full"
                             onClick={() => toast.info('Please log in to apply for this role')}
                           >
                             Login to Apply
                           </Button>
                         )}
                       </CardFooter>
                     </Card>
                   ))}
                 </div>
               )}
             </motion.div>
           )}
           
           {/* Project Details */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
           >
             <div className="grid md:grid-cols-2 gap-8">
               {/* Features */}
               <div>
                 <h2 className="text-2xl font-bold mb-4">Features</h2>
                 <Card className="bg-white dark:bg-black border border-black/20 dark:border-white/20">
                   <CardContent className="pt-6">
                     <div className="space-y-4">
                       <div>
                         <h3 className="text-lg font-semibold mb-2">Core Features</h3>
                         <ul className="list-disc list-inside text-muted-foreground space-y-1">
                           {projectData.features?.core.map((feature, index) => (
                             <li key={index}>{feature}</li>
                           ))}
                         </ul>
                       </div>
                       
                       <div>
                         <h3 className="text-lg font-semibold mb-2">Additional Features</h3>
                         <ul className="list-disc list-inside text-muted-foreground space-y-1">
                           {projectData.features?.additional.map((feature, index) => (
                             <li key={index}>{feature}</li>
                           ))}
                         </ul>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </div>
               
               {/* Learning Outcomes */}
               <div>
                 <h2 className="text-2xl font-bold mb-4">Learning Outcomes</h2>
                 <Card className="bg-white dark:bg-black border border-black/20 dark:border-white/20">
                   <CardContent className="pt-6">
                     <ul className="list-disc list-inside text-muted-foreground space-y-2">
                       {projectData.learningOutcomes?.map((outcome, index) => (
                         <li key={index}>{outcome}</li>
                       ))}
                     </ul>
                   </CardContent>
                 </Card>
               </div>
             </div>
           </motion.div>
         </div>
       )}
     </div>
     <Footer />
   </main>
 </PageTransition>
);
};

export default ProjectDetailsPage;