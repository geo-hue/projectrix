'use client';

import React, { useState, useEffect } from 'react';
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
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MessageCircle,
  UserCircle,
  Sparkles,
  BookOpen,
  ExternalLink,
  Loader2
} from "lucide-react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import TechBackground from '@/components/TechBackground';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from 'framer-motion';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import IncomingRequestsManager from '@/components/IncomingRequestsManager';
import MyRequestsManager from '@/components/MyRequestsManager';
import { useCreateDiscordChannelMutation } from '@/app/api/discordApiSlice';

const ProfileDialog = ({ isOpen, onClose, username }) => {
  const router = useRouter();
  
  const handleViewFullProfile = () => {
    router.push(`/profile/${username}`);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-black border-2 border-black/20 dark:border-white/20">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            View quick information or go to full profile
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6">
          {/* This would be populated with user profile data in a real implementation */}
          <Avatar className="h-20 w-20 mb-4 border-2 border-primary">
            <AvatarImage src={`https://avatar.vercel.sh/${username}`} />
            <AvatarFallback>{username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-bold mb-1">{username}</h3>
          <p className="text-sm text-muted-foreground mb-4">@{username}</p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge>React</Badge>
            <Badge>Node.js</Badge>
            <Badge>TypeScript</Badge>
          </div>
          
          <div className="text-center max-w-xs mb-6">
            <p className="text-sm text-muted-foreground">
              Frontend developer with 3 years of experience. Passionate about React and modern web technologies.
            </p>
          </div>
          
          <div className="space-x-3">
            <Button variant="outline" className="gap-2" onClick={() => window.open(`https://github.com/${username}`, '_blank')}>
              <ExternalLink className="h-4 w-4" />
              GitHub Profile
            </Button>
            <Button onClick={handleViewFullProfile}>
              View Full Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};



const CollaborationsPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  // Profile and messaging dialog states
  const [viewingProfile, setViewingProfile] = useState(null);
  const [messagingUser, setMessagingUser] = useState(null);
  
  const [createDiscordChannel, { isLoading: isDiscordLoading }] = useCreateDiscordChannelMutation();
const [isJoiningDiscord, setIsJoiningDiscord] = useState<string | null>(null);

const handleJoinDiscord = async (projectId: string) => {
  setIsJoiningDiscord(projectId);
  try {
    const result = await createDiscordChannel(projectId).unwrap();
    if (result.inviteLink) {
      window.open(result.inviteLink, '_blank');
    }
  } catch (error) {
    console.error('Error joining Discord channel:', error);
    toast.error('Failed to join Discord channel');
  } finally {
    setIsJoiningDiscord(null);
  }
};

  // API hooks - not actually connected for demo
  // const { data: myRequestsData, isLoading: myRequestsLoading } = { data: null, isLoading: true }; // useGetMyCollaborationRequestsQuery();
  // const { data: incomingRequestsData, isLoading: incomingRequestsLoading } = { data: null, isLoading: true }; // useGetIncomingCollaborationRequestsQuery();
  // const { data: myCollaborationsData, isLoading: myCollaborationsLoading } = { data: null, isLoading: true }; // useGetMyCollaborationsQuery();
  // const [updateRequestStatus, { isLoading: isUpdatingStatus }] = [() => {}, { isLoading: false }]; // useUpdateCollaborationRequestStatusMutation();

  // Add custom CSS for the blue background patterns and effects
  useEffect(() => {
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


  const exampleMyProjects = [
    {
      _id: "myproj1",
      title: "Task Management System",
      status: "active",
      technologies: ["React", "TypeScript", "Express", "MongoDB"],
      teamMembers: [
        { userId: "currentuser", role: "Project Owner", name: "You", avatar: "https://avatars.githubusercontent.com/u/67890" },
        { userId: "user6", role: "Frontend Lead", name: "Alex Brown", avatar: "https://avatars.githubusercontent.com/u/45678" }
      ],
      teamStructure: {
        roles: [
          { title: "Frontend Lead", filled: true },
          { title: "Backend Developer", filled: false },
          { title: "UI/UX Designer", filled: false },
          { title: "DevOps Engineer", filled: false }
        ]
      },
      lastActivity: "2025-01-20T11:30:00.000Z"
    }
  ];

  // Set loading and data states with example data
  useEffect(() => {
    setTimeout(() => {
      
      setMyCollaborations(exampleMyProjects);
      setMyCollaborationsLoading(false);
    }, 1000);
  }, []);

  // State management for simulating API data
  const [myCollaborationsLoading, setMyCollaborationsLoading] = useState(true);
  const [myCollaborations, setMyCollaborations] = useState([]);

  const getStatusBadge = (status) => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mt-20 mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                My Collaborations
              </h1>
              <p className="text-muted-foreground">
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
                ) : myCollaborations.length > 0 ? (
                  <div className="grid gap-6">
                    {myCollaborations.map((project) => (
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="mt-1">
                  Last activity: {formatDate(project.lastActivity)}
                </CardDescription>
              </div>
              {getStatusBadge(project.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline">{tech}</Badge>
                ))}
              </div>
              
                             {/* Team Members */}
              <div>
                <h4 className="text-sm font-medium mb-2">Team Members</h4>
                <div className="flex flex-wrap gap-4">
                  {project.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={member.avatar} 
                          alt={member.name}
                          onError={(e) => {
                            e.currentTarget.src = `https://avatar.vercel.sh/${member.name}`;
                          }}
                        />
                        <AvatarFallback>{member.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Roles */}
              <div>
                <h4 className="text-sm font-medium mb-2">Open Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {project.teamStructure?.roles
                    .filter(role => !role.filled)
                    .map((role, index) => (
                      <Badge key={index} variant="outline">{role.title}</Badge>
                    ))
                  }
                  {project.teamStructure?.roles.filter(role => !role.filled).length === 0 && (
                    <span className="text-sm text-muted-foreground">All roles filled</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {/* Replace Team Messages with Discord Join */}
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleJoinDiscord(project._id)}
              disabled={isJoiningDiscord === project._id}
            >
              {isJoiningDiscord === project._id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Join Discord
            </Button>
            <Button 
              className="gap-2"
              onClick={() => router.push(`/projects/${project._id}`)}
            >
              View Project <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-10 rounded-lg border border-black/10 dark:border-white/10 text-center"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="h-8 w-8 text-primary/70" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Active Projects</h3>
                    <p className="text-muted-foreground mb-6">
                      You don't have any active projects yet. Create a project or join an existing one to get started.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <Button 
                        variant="outline"
                        className="gap-2"
                        onClick={() => router.push('/ideas')}
                      >
                        <Users className="h-4 w-4" />
                        Browse Projects
                      </Button>
                      <Button 
                        className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                        onClick={() => router.push('/generate')}
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
        
        <ProfileDialog 
          isOpen={!!viewingProfile} 
          onClose={() => setViewingProfile(null)} 
          username={viewingProfile?.username}
        />
        

        
        <Footer />
      </main>
    </PageTransition>
  );
};

export default CollaborationsPage;