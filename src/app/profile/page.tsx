'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { 
  Github, 
  Mail,
  Clock,
  Sparkles,
  Users,
  ArrowRight,
  Filter,
  Plus,
  ExternalLink,
  Code2,
  Loader2,
  MessageSquare,
  PlusCircle,
  EditIcon,
  LinkIcon,
  Calendar,
  Star,
  BarChart4,
  Settings,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Save,
  Globe,
  Linkedin,
  Twitter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PageTransition from '@/components/PageTransition';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { motion } from "framer-motion";
import TechBackground from '@/components/TechBackground';
import { useGetSavedProjectsQuery, useGetProjectsQuery, usePublishProjectMutation } from '../api/projectApiSlice';
import { Project } from '../types/projectTypes';
import ProjectDetails from '@/components/ProjectDetails';
import ProjectEditDialog from '@/components/ProjectEditDialog';
import PublishConfirmationDialog from '@/components/PublishConfirmationDialog';
import ProfileCompletionCard from '@/components/ProfileCompletionCard';
import ProfileEditForm from '@/components/ProfileEditForm';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../api/userProfileApiSlice';
import MyFeedback from '@/components/MyFeedback';

const ProfileSkeleton = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row gap-6">
      <Skeleton className="w-32 h-32 rounded-full" />
      <div className="space-y-4 flex-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  </div>
);

const ProjectCard = ({ project, onView, onPublish, onEdit }) => {
  const statusColors = {
    draft: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    published: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    saved: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
  };
  
  // Determine status based on project properties
  const getStatus = () => {
    if (project.isPublished) return "published";
    if (project.isSaved) return "saved";
    return "draft";
  };
  
  const status = getStatus();

  return (
    <div className="group relative">
      {/* Background shadow element */}
      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
      
      <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="line-clamp-1">{project.title}</CardTitle>
              <CardDescription className="line-clamp-1">{project.subtitle}</CardDescription>
            </div>
            <Badge 
              className={`uppercase text-xs ${statusColors[status]}`}
              variant="outline"
            >
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="mb-2">
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {project.technologies.slice(0, 3).map((tech, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">{tech}</Badge>
            ))}
            {project.technologies.length > 3 && <Badge variant="outline" className="text-xs">+{project.technologies.length - 3}</Badge>}
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{project.duration.estimate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{project.teamSize.count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Code2 className="h-3 w-3" />
              <span>{project.complexity.level}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 gap-1"
              onClick={() => onView(project._id)}
            >
              <ArrowRight className="h-3 w-3" /> View
            </Button>
            {/* Edit button - only show for saved projects */}
            {project.isSaved && !project.isPublished && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 gap-1"
                onClick={() => onEdit(project)}
              >
                <EditIcon className="h-3 w-3" /> Edit
              </Button>
            )}
            {/* Publish button - only show for unpublished projects */}
            {!project.isPublished && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 gap-1"
                onClick={() => onPublish(project._id)}
              >
                <ExternalLink className="h-3 w-3" /> Publish
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const ActivityItem = ({ date, title, description, icon: Icon }) => (
  <div className="flex gap-4 py-3">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground mt-1">{date}</p>
    </div>
  </div>
);

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { data: savedProjects, isLoading: savedProjectsLoading } = useGetSavedProjectsQuery();
  const { data: allProjects, isLoading: allProjectsLoading } = useGetProjectsQuery();
  const { data: userProfileData, isLoading: userProfileLoading, refetch: refetchUserProfile } = useGetUserProfileQuery();
  const [publishProject, { isLoading: publishing }] = usePublishProjectMutation();
  
  // Project details modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [projectToPublish, setProjectToPublish] = useState(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('projects');
  const [activeProjectsTab, setActiveProjectsTab] = useState('saved');
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  
  // Check if any data is loading
  const isLoading = savedProjectsLoading || allProjectsLoading || userProfileLoading;

  // Handle publishing a project
  const handlePublishProject = (projectId) => {
    const project = [...getDraftProjects(), ...getSavedProjects(), ...getPublishedProjects()]
      .find(p => p._id === projectId);
    
    if (project) {
      setProjectToPublish(project);
      setPublishDialogOpen(true);
    }
  };

  const confirmPublish = async () => {
    try {
      await publishProject(projectToPublish._id).unwrap();
      toast.success('Project published successfully!');
      setPublishDialogOpen(false);
      setProjectToPublish(null);
    } catch (error) {
      toast.error('Failed to publish project');
      setPublishDialogOpen(false);
    }
  };

  // Get draft, saved, and published projects
  const getDraftProjects = () => {
    if (!allProjects?.projects) return [];
    return allProjects.projects.filter(p => !p.isSaved && !p.isPublished);
  };
  
  const getSavedProjects = () => {
    if (!savedProjects?.projects) return [];
    return savedProjects.projects.filter(p => p.isSaved && !p.isPublished);
  };
  
  const getPublishedProjects = () => {
    if (!allProjects?.projects) return [];
    return allProjects.projects.filter(p => p.isPublished);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
      toast.error('Please login to view your profile');
    }
  }, [isLoading, isAuthenticated, router]);
  
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

  // Function to navigate to project details
  const viewProject = (projectId) => {
    const project = [...getDraftProjects(), ...getSavedProjects(), ...getPublishedProjects()]
      .find(p => p._id === projectId);
    
    if (project) {
      setSelectedProject(project);
      setIsProjectDetailsOpen(true);
    } else {
      router.push(`/projects/${projectId}`);
    }
  };

  // Sample activity data (would come from API in real app)
  const activities = [
    { 
      date: 'Today, 10:30 AM', 
      title: 'Published a new project', 
      description: 'Task Management System is now available for collaboration',
      icon: ExternalLink
    },
    { 
      date: 'Yesterday, 3:45 PM', 
      title: 'Generated a new project idea', 
      description: 'E-Commerce Dashboard with analytics features',
      icon: Sparkles
    },
    { 
      date: '3 days ago', 
      title: 'Updated profile preferences', 
      description: 'Added React Native and Flutter to skills',
      icon: Settings
    }
  ];

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setProjectToEdit(null);
  };
  
  const handleEditProfileSuccess = () => {
    setIsEditing(false);
    refetchUserProfile();
    toast.success('Profile updated successfully!');
  };

  return (
    <PageTransition>
    <main className="min-h-screen bg-background tech-grid-bg relative overflow-hidden">
      <Header />
      <TechBackground/>

      {/* Subtle blue glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blue-glow -z-10 opacity-60"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blue-glow -z-10 opacity-60"></div>
      
      {/* Custom background with blue gradients */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-900/10 to-blue-600/10 dark:from-blue-700/10 dark:to-blue-400/10 -z-10"></div>
      
      <div className="container px-4 mx-auto pb-20 pt-20">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <div>
            {/* Profile Overview Card */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isEditing ? (
                <ProfileEditForm 
                  profile={userProfileData?.profile} 
                  onCancel={() => setIsEditing(false)} 
                  onSuccess={handleEditProfileSuccess} 
                />
              ) : (
                <div className="group relative">
                  <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-xl transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
                  
                  <Card className="relative overflow-hidden bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 rounded-xl">
                    {/* Add decorative blue gradients */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-600/10 to-blue-400/10 dark:from-blue-700/10 dark:to-blue-400/10 rounded-full blur-2xl"></div>
                      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-700/10 rounded-full blur-2xl"></div>
                    </div>
                    <CardContent className="p-0">
                      <div className="md:flex">
                        {/* Left column with profile image and basic info */}
                        <div className="md:w-1/3 bg-gradient-to-br from-primary/5 to-primary/10 p-6 flex flex-col items-center justify-center">
                          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-xl overflow-hidden mb-4">
                            {user?.avatar ? (
                              <img 
                                src={user.avatar}
                                alt={`${user.name}'s profile`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  e.currentTarget.src = "https://avatar.vercel.sh/" + (user.username || "user");
                                }}
                              />
                            ) : (
                              // Fallback if no avatar URL exists
                              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                <span className="text-4xl font-bold">{user?.name?.charAt(0) || "U"}</span>
                              </div>
                            )}
                          </div>
                          
                          <h1 className="text-2xl md:text-3xl font-bold text-center mb-1">{user?.name || "GitHub User"}</h1>
                          <p className="text-muted-foreground text-center mb-4">@{user?.username || "username"}</p>
                          
                          <div className="flex flex-wrap justify-center gap-2 mb-6">
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" /> {userProfileData?.profile?.availability || "Available"}
                            </Badge>
                            <Badge 
                              variant={user?.plan === "pro" ? "default" : "outline"} 
                              className={`gap-1 ${user?.plan === "pro" ? 'bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 text-white' : ''}`}
                            >
                              {user?.plan === "pro" ? "Pro Plan" : "Free Plan"}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-3 mb-2 relative z-10">
  {userProfileData?.profile?.githubProfile && (
    <Button 
      size="sm"
      variant="outline" 
      className="gap-1 bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer relative z-10"
      onClick={() => window.open(userProfileData.profile.githubProfile, '_blank')}
    >
      <Github className="h-3 w-3" />
      GitHub
    </Button>
  )}
  {userProfileData?.profile?.website && (
    <Button 
      size="sm"
      variant="outline" 
      className="gap-1 bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer relative z-10"
      onClick={() => window.open(userProfileData.profile.website, '_blank')}
    >
      <Globe className="h-3 w-3" />
      Website
    </Button>
  )}
</div>

<div className="flex mt-4 md:mt-0 gap-2 relative z-10">
  {userProfileData?.profile?.twitterProfile && (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => window.open(userProfileData.profile.twitterProfile, '_blank')}
    >
      <Twitter className="h-4 w-4" />
    </Button>
  )}
  
  {userProfileData?.profile?.linkedinProfile && (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => window.open(userProfileData.profile.linkedinProfile, '_blank')}
    >
      <Linkedin className="h-4 w-4" />
    </Button>
  )}
  
  {user?.email && userProfileData?.profile?.publicEmail && (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={() => window.location.href = `mailto:${user.email}`}
    >
      <Mail className="h-4 w-4" />
    </Button>
  )}
</div>
                          {user?.plan !== "pro" && (
                            <Button 
                              size="sm"
                              className="mt-4 gap-1 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_2px_0_0_rgba(0,0,0,1)] dark:shadow-[0_2px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                              onClick={() => router.push('/pricing')}
                            >
                              <Sparkles className="h-3 w-3" />
                              Upgrade to Pro
                            </Button>
                          )}
                        </div>
                        
                        {/* Right column with stats and quick actions */}
                        <div className="md:w-2/3 p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                            <div>
                              <h2 className="text-xl font-semibold flex items-center gap-2">
                                Profile Overview
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <EditIcon className="h-3.5 w-3.5" />
                                </Button>
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                              </p>
                            </div>
                            
                            <div className="mt-4 md:mt-0">
                              <Button 
                                className="w-full md:w-auto gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                                onClick={() => router.push('/generate')}
                              >
                                <Sparkles className="h-4 w-4" />
                                Generate New Project
                              </Button>
                            </div>
                          </div>
                          
                          {/* Bio Section */}
                          <div className="mb-6">
                            <h3 className="text-sm font-medium mb-2">About</h3>
                            <p className="text-sm text-muted-foreground">
                              {userProfileData?.profile?.bio || "Tell others about yourself by editing your profile."}
                            </p>
                          </div>
                          
                          {/* Skills */}
                          <div className="mb-6">
                            <h3 className="text-sm font-medium mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-1.5">
                              {userProfileData?.profile?.skills && userProfileData.profile.skills.length > 0 ? (
                                userProfileData.profile.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary">{skill}</Badge>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">Add your skills by editing your profile.</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Preferred Technologies */}
                          {userProfileData?.profile?.preferredTechnologies && userProfileData.profile.preferredTechnologies.length > 0 && (
                            <div className="mb-6">
                              <h3 className="text-sm font-medium mb-2">Preferred Technologies</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {userProfileData.profile.preferredTechnologies.map((tech, index) => (
                                  <Badge key={index} variant="outline">{tech}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Projects Generated</p>
                              <p className="text-2xl font-bold">{user?.projectsGenerated || 0}</p>
                            </div>
                            <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Active Collaborations</p>
                              <p className="text-2xl font-bold">{user?.projectsCollaborated || 0}</p>
                            </div>
                            <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Published Projects</p>
                              <p className="text-2xl font-bold">{getPublishedProjects().length}</p>
                            </div>
                            <div className="bg-primary/10 rounded-lg p-3 relative overflow-hidden">
                              <div className="relative z-10">
                                <p className="text-xs text-muted-foreground">Project Ideas Left</p>
                                <p className="text-2xl font-bold">{user?.projectIdeasLeft || 0}</p>
                              </div>
                              {user?.plan !== "pro" && (
                                <div className="absolute bottom-1 right-2">
                                  <Sparkles className="h-8 w-8 text-primary/20" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>

            {/* Profile Completion Card */}
            {!isEditing && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ProfileCompletionCard 
                  user={user} 
                  profile={userProfileData?.profile}
                  onStartEdit={() => setIsEditing(true)}
                />
              </motion.div>
            )}

            {/* Main Content Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Tabs 
                defaultValue="projects" 
                className="mt-10"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full md:grid-cols-4 h-auto p-1 mb-8">
                  <TabsTrigger value="projects" className="py-2.5">
                    <Code2 className="h-4 w-4 mr-2" />
                    My Projects
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="py-2.5">
                    <BarChart4 className="h-4 w-4 mr-2" />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="collaborations" className="py-2.5">
                    <Users className="h-4 w-4 mr-2" />
                    Collaborations
                  </TabsTrigger>
                  <TabsTrigger value="feedback" className="py-2.5">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    My Feedback
                  </TabsTrigger>
                </TabsList>

                {/* Projects Tab */}
                <TabsContent value="projects">
                  <div className="grid gap-6">
                    {/* Quick Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="gap-2 flex-1 sm:flex-none bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                        onClick={() => router.push('/generate')}
                      >
                        <Sparkles className="h-4 w-4" />
                        Generate New Project
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2 flex-1 sm:flex-none bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                        onClick={() => router.push('/ideas')}
                      >
                        <Filter className="h-4 w-4" />
                        Browse Ideas
                      </Button>
                    </div>

                    {/* Project Status Tabs */}
                    <Tabs 
                      defaultValue="saved" 
                      value={activeProjectsTab}
                      onValueChange={setActiveProjectsTab}
                    >
                      <TabsList className="mb-6 inline-flex">
                        <TabsTrigger value="drafts">
                          Drafts ({getDraftProjects().length})
                        </TabsTrigger>
                        <TabsTrigger value="saved">
                          Saved ({getSavedProjects().length})
                        </TabsTrigger>
                        <TabsTrigger value="published">
                          Published ({getPublishedProjects().length})
                        </TabsTrigger>
                      </TabsList>

                      {/* Drafts */}
                      <TabsContent value="drafts">
                        {getDraftProjects().length === 0 ? (
                          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Code2 className="h-8 w-8 text-primary/70" />
                              </div>
                              <h3 className="text-xl font-semibold mb-2">No Draft Projects</h3>
                              <p className="text-muted-foreground mb-6 text-center max-w-md">
                                Generate your first project idea to start building your portfolio. 
                                Draft projects are ideas that haven't been saved or published yet.
                              </p>
                              <Button 
                                onClick={() => router.push('/generate')}
                                className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                              >
                                <Sparkles className="h-4 w-4" />
                                Generate Your First Project
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getDraftProjects().map((project) => (
                              <ProjectCard 
                                key={project._id} 
                                project={project} 
                                onView={viewProject}
                                onPublish={handlePublishProject}
                                onEdit={handleEditProject}
                              />
                            ))}
                            <div className="group relative">
                              {/* Blue gradient background with opposite orientation */}
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 to-blue-600/15 dark:from-blue-400/15 dark:to-blue-700/15 rounded-lg transform -rotate-2 transition-transform duration-300 group-hover:-rotate-1"></div>
                              {/* Blue gradient background effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 to-blue-400/15 dark:from-blue-700/15 dark:to-blue-400/15 rounded-lg transform rotate-2 transition-transform duration-300 group-hover:rotate-1"></div>
                              <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                              <Card 
                                className="relative border-dashed hover:border-primary/50 cursor-pointer transition-colors group flex flex-col justify-center items-center h-full bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1"
                                onClick={() => router.push('/generate')}
                              >
                                <CardContent className="flex flex-col items-center justify-center py-8">
                                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-all group-hover:scale-110">
                                    <PlusCircle className="h-6 w-6 text-primary/70" />
                                  </div>
                                  <CardTitle className="text-center text-muted-foreground group-hover:text-primary transition-colors">
                                    Generate New Project Idea
                                  </CardTitle>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      {/* Saved */}
                      <TabsContent value="saved">
                        {getSavedProjects().length === 0 ? (
                          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <BookOpen className="h-8 w-8 text-primary/70" />
                              </div>
                              <h3 className="text-xl font-semibold mb-2">No Saved Projects</h3>
                              <p className="text-muted-foreground mb-6 text-center max-w-md">
                                You haven't saved any projects yet. Generate a project idea and save it to 
                                keep track of projects you're interested in developing.
                              </p>
                              <Button 
                                onClick={() => router.push('/generate')}
                                className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                              >
                                Generate and Save a Project
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getSavedProjects().map((project) => (
                              <ProjectCard 
                                key={project._id} 
                                project={project} 
                                onView={viewProject}
                                onPublish={handlePublishProject}
                                onEdit={handleEditProject}
                              />
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      {/* Published */}
                      <TabsContent value="published">
                        {getPublishedProjects().length === 0 ? (
                          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-8 w-8 text-primary/70" />
                              </div>
                              <h3 className="text-xl font-semibold mb-2">No Published Projects</h3>
                              <p className="text-muted-foreground mb-6 text-center max-w-md">
                                You haven't published any projects yet. Publishing makes your project
                                visible to other developers who might want to collaborate with you.
                              </p>
                              <Button 
                                onClick={() => router.push('/generate')}
                                className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                              >
                                Generate and Publish a Project
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getPublishedProjects().map((project) => (
                              <ProjectCard 
                                key={project._id} 
                                project={project} 
                                onView={viewProject}
                                onPublish={handlePublishProject}
                                onEdit={handleEditProject}
                              />
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <div className="md:col-span-2">
                      <div className="group relative">
                        <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                        <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                        {/* Blue gradient background effect */}
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-blue-400/10 dark:from-blue-700/10 dark:to-blue-400/10 rounded-full blur-xl"></div>
                        </div>
                          <CardHeader>
                            <CardTitle className="text-xl flex items-center">
                              <BarChart4 className="h-5 w-5 mr-2" /> 
                              Recent Activity
                            </CardTitle>
                            <CardDescription>Your latest actions and achievements</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="space-y-1 divide-y divide-border/30">
                              {activities.map((activity, index) => (
                                <ActivityItem
                                  key={index}
                                  date={activity.date}
                                  title={activity.title}
                                  description={activity.description}
                                  icon={activity.icon}
                                />
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="ghost" className="w-full justify-center gap-1">
                              View All Activity <ChevronRight className="h-3 w-3" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </div>

                    {/* Stats Card */}
                    <div>
                      <div className="group relative mb-6">
                        <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                        <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                          <CardHeader>
                            <CardTitle className="text-lg">Usage Statistics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1 text-sm">
                                  <span>Project Ideas</span>
                                  <span className="text-primary">{user?.projectIdeasLeft || 0}/3</span>
                                </div>
                                <Progress value={(user?.projectIdeasLeft || 0) * 33.33} className="h-2" />
                              </div>
                              
                              <div>
                                <div className="flex justify-between mb-1 text-sm">
                                  <span>Plan Usage</span>
                                  <span>{user?.plan === "pro" ? "Unlimited" : "Basic"}</span>
                                </div>
                                <Progress value={user?.plan === "pro" ? 100 : 50} className="h-2" />
                              </div>
                              
                              <div className="pt-2">
                                <h4 className="text-sm font-medium mb-2">Plan Details</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <div className="flex justify-between">
                                    <span>Current Plan:</span>
                                    <span className="font-medium">{user?.plan === "pro" ? "Pro" : "Free"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Ideas Generated:</span>
                                    <span>{user?.projectsGenerated || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Projects Published:</span>
                                    <span>{getPublishedProjects().length}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          {user?.plan !== "pro" && (
                            <CardFooter>
                              <Button 
                                className="w-full gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                                onClick={() => router.push('/pricing')}
                              >
                                <Sparkles className="h-4 w-4" />
                                Upgrade to Pro
                              </Button>
                            </CardFooter>
                          )}
                        </Card>
                      </div>

                      {/* Calendar Card */}
                      <div className="group relative">
                        <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                        <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              Join Date
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center pb-6">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                              <Star className="h-8 w-8 text-primary/70" />
                            </div>
                            <p className="text-sm text-center">
                              Joined Projectrix on
                            </p>
                            <p className="text-xl font-bold">
                              {new Date(user?.createdAt || Date.now()).toLocaleDateString(undefined, { 
                                year: 'numeric', 
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Collaborations Tab */}
                <TabsContent value="collaborations">
                  <div className="grid gap-6">
                    {/* Active Collaborations header */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">Active Collaborations</h2>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => router.push('/ideas')}
                      >
                        <Users className="h-4 w-4" />
                        Find Projects
                      </Button>
                    </div>
                    
                    {/* Collaborations status */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                      <Card className="relative bg-white dark:bg-black border border-dashed border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                        <CardContent className="flex flex-col items-center justify-center py-20">
                          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <MessageSquare className="h-10 w-10 text-primary/70" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">No Active Collaborations</h3>
                          <p className="text-muted-foreground mb-6 text-center max-w-md">
                            You're not collaborating on any projects yet. Browse available projects to find ones that match your skills and interests.
                          </p>
                          <Button 
                            onClick={() => router.push('/ideas')}
                            className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                          >
                            <Users className="h-4 w-4" />
                            Browse Available Projects
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Feedback Tab */}
                <TabsContent value="feedback">
                  <MyFeedback />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <ProjectDetails 
        project={selectedProject}
        isOpen={isProjectDetailsOpen}
        onClose={() => setIsProjectDetailsOpen(false)}
      />

      <PublishConfirmationDialog
        isOpen={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        onConfirm={confirmPublish}
        projectTitle={projectToPublish?.title || ""}
      />

      {projectToEdit && (
        <ProjectEditDialog
          project={projectToEdit}
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
        />
      )}
      <Footer />
    </main>
    </PageTransition>
  );
}