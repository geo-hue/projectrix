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
  Globe,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { TechSelect } from '@/components/TechSelect';
import { useGetSavedProjectsQuery, useGetProjectsQuery, usePublishProjectMutation } from '../api/projectApiSlice';
import { Project } from '../types/projectTypes';
import ProjectDetails from '@/components/ProjectDetails';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../api/userProfileApiSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const ProjectCard = ({ project, onView, onPublish }) => {
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
  const [publishProject, { isLoading: publishing }] = usePublishProjectMutation();
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfileQuery();
const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  
  // Project details modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('projects');
  const [activeProjectsTab, setActiveProjectsTab] = useState('saved');
  
  // State for tech stack preferences
  const [techPreferences, setTechPreferences] = useState([
    'React', 'TypeScript', 'Node.js', 'MongoDB', 'Next.js'
  ]);

  // State for editing mode (for future functionality)
  const [isEditing, setIsEditing] = useState(false);
  
  // Check if any data is loading
  const isLoading = savedProjectsLoading || allProjectsLoading;

  const [editableProfile, setEditableProfile] = useState({
    bio: "",
    skills: [],
    website: "",
    githubProfile: "",
    twitterProfile: "",
    linkedinProfile: "",
    availability: "available",
    hoursPerWeek: "10-20 hours",
    preferredTechnologies: [],
    preferredRoles: [],
    publicEmail: false
  });

  
// Load profile data when available
useEffect(() => {
  if (userProfile?.profile) {
    setEditableProfile({
      bio: userProfile.profile.bio || "",
      skills: userProfile.profile.skills || [],
      website: userProfile.profile.website || "",
      githubProfile: userProfile.profile.githubProfile || "",
      twitterProfile: userProfile.profile.twitterProfile || "",
      linkedinProfile: userProfile.profile.linkedinProfile || "",
      availability: userProfile.profile.availability || "available",
      hoursPerWeek: userProfile.profile.hoursPerWeek || "10-20 hours",
      preferredTechnologies: userProfile.profile.preferredTechnologies || [],
      preferredRoles: userProfile.profile.preferredRoles || [],
      publicEmail: userProfile.profile.publicEmail || false
    });
    
    // Also set the tech preferences from profile if available
    if (userProfile.profile.preferredTechnologies?.length > 0) {
      setTechPreferences(userProfile.profile.preferredTechnologies);
    }
  }
}, [userProfile]);

// Handle saving profile updates
const handleSaveProfile = async () => {
  try {
    // Prepare the data to update
    const updateData = {
      ...editableProfile,
      // Sync tech preferences to preferred technologies
      preferredTechnologies: techPreferences
    };
    
    await updateUserProfile(updateData).unwrap();
    toast.success("Profile updated successfully");
    setIsEditing(false);
  } catch (error) {
    console.error("Failed to update profile:", error);
    toast.error("Failed to update profile");
  }
};

// Toggle edit mode
const toggleEditMode = () => {
  if (isEditing) {
    // If we're exiting edit mode, save changes
    handleSaveProfile();
  } else {
    // Entering edit mode
    setIsEditing(true);
  }
};

// Handle input changes
const handleProfileChange = (field, value) => {
  setEditableProfile(prev => ({
    ...prev,
    [field]: value
  }));
};

  // Handle publishing a project
  const handlePublishProject = async (projectId) => {
    try {
      await publishProject(projectId).unwrap();
      toast.success('Project published successfully!');
    } catch (error) {
      toast.error('Failed to publish project');
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
                            <Clock className="h-3 w-3" /> Available
                          </Badge>
                          <Badge 
                            variant={user?.plan === "pro" ? "default" : "outline"} 
                            className={`gap-1 ${user?.plan === "pro" ? 'bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 text-white' : ''}`}
                          >
                            {user?.plan === "pro" ? "Pro Plan" : "Free Plan"}
                          </Badge>
                        </div>
                        
                       <div className="flex gap-3 mb-2">
  {isEditing ? (
    <div className="space-y-2 w-full">
      <div className="flex items-center gap-2">
        <Github className="h-3 w-3 text-muted-foreground" />
        <Input 
          size="sm"
          placeholder="GitHub username"
          value={editableProfile.githubProfile}
          onChange={(e) => handleProfileChange('githubProfile', e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <div className="flex items-center gap-2">
        <Globe className="h-3 w-3 text-muted-foreground" />
        <Input 
          size="sm"
          placeholder="Website URL"
          value={editableProfile.website}
          onChange={(e) => handleProfileChange('website', e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <div className="flex items-center gap-2">
        <Twitter className="h-3 w-3 text-muted-foreground" />
        <Input 
          size="sm"
          placeholder="Twitter username"
          value={editableProfile.twitterProfile}
          onChange={(e) => handleProfileChange('twitterProfile', e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <div className="flex items-center gap-2">
        <Linkedin className="h-3 w-3 text-muted-foreground" />
        <Input
          size="sm"
          placeholder="LinkedIn username"
          value={editableProfile.linkedinProfile}
          onChange={(e) => handleProfileChange('linkedinProfile', e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="publicEmail"
          checked={editableProfile.publicEmail}
          onCheckedChange={(checked) => handleProfileChange('publicEmail', checked)}
        />
        <label htmlFor="publicEmail" className="text-xs cursor-pointer">
          Make email public
        </label>
      </div>
    </div>
  ) : (
    <>
      <Button 
        size="sm"
        variant="outline" 
        className="gap-1 bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
        onClick={() => window.open(editableProfile.githubProfile ? `https://github.com/${editableProfile.githubProfile}` : `https://github.com/${user?.username}`)}
      >
        <Github className="h-3 w-3" />
        GitHub
      </Button>
      {editableProfile.website && (
        <Button 
          size="sm"
          variant="outline" 
          className="gap-1 bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
          onClick={() => window.open(editableProfile.website.startsWith('http') ? editableProfile.website : `https://${editableProfile.website}`)}
        >
          <Globe className="h-3 w-3" />
          Website
        </Button>
      )}
    </>
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
      {!isEditing ? (
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0"
          onClick={() => setIsEditing(true)}
        >
          <EditIcon className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button 
          size="sm" 
          variant="ghost"
          className="h-8 p-1 text-xs"
          onClick={handleSaveProfile}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Saving...
            </>
          ) : "Save"}
        </Button>
      )}
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
  {isEditing ? (
    <textarea
      className="w-full min-h-24 p-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      placeholder="Tell us about yourself..."
      value={editableProfile.bio}
      onChange={(e) => handleProfileChange('bio', e.target.value)}
    />
  ) : (
    <p className="text-sm text-muted-foreground">
      {editableProfile.bio || "Deeveloper passionate about building collaborative projects and learning new technologies. Looking for interesting opportunities to enhance my skills."}
    </p>
  )}
</div>
                        
                        {/* Skills */}
                        <div className="mb-6">
                          <h3 className="text-sm font-medium mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {techPreferences.map((tech, index) => (
                              <Badge key={index} variant="secondary">{tech}</Badge>
                            ))}
                            <Button variant="outline" size="sm" className="h-6 gap-1 text-xs">
                              <Plus className="h-3 w-3" /> Edit
                            </Button>
                          </div>
                        </div>
                        
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
            </motion.div>

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
                  <TabsTrigger value="preferences" className="py-2.5">
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
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
                              />
                            ))}
                            <div className="group relative">
                      {/* Blue gradient background with opposite orientation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 to-blue-600/15 dark:from-blue-400/15 dark:to-blue-700/15 rounded-lg transform -rotate-2 transition-transform duration-300 group-hover:-rotate-1"></div>
                      {/* Blue gradient background effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 to-blue-400/15 dark:from-blue-700/15 dark:to-blue-400/15 rounded-lg transform rotate-2 transition-transform duration-300 group-hover:rotate-1"></div>
                        {/* Add blue rotated gradient background with reverse colors */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-lg transform -rotate-3 transition-transform duration-300 group-hover:-rotate-2"></div>
                  {/* Add blue rotated gradient background like in the Story section */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg transform rotate-3 transition-transform duration-300 group-hover:rotate-2"></div>
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

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Tech Stack Preferences */}
                    <div className="group relative">
  <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
  <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
    <CardHeader className="flex flex-row items-start justify-between">
      <div>
        <CardTitle>Tech Stack</CardTitle>
        <CardDescription>Technologies you want to work with</CardDescription>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={() => setIsEditing(!isEditing)}
      >
        <EditIcon className="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {techPreferences.map((tech, index) => (
            <Badge key={index} variant="secondary">{tech}</Badge>
          ))}
        </div>
        {isEditing && (
          <TechSelect 
            onSelect={setTechPreferences} 
            defaultValue={techPreferences} 
          />
        )}
      </div>
    </CardContent>
    {isEditing && (
      <CardFooter>
        <Button 
          onClick={handleSaveProfile} 
          className="w-full"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : "Save Preferences"}
        </Button>
      </CardFooter>
    )}
  </Card>
</div>
                    {/* Project Preferences */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                      <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                        <CardHeader className="flex flex-row items-start justify-between">
                          <div>
                            <CardTitle>Project Preferences</CardTitle>
                            <CardDescription>Your ideal project settings</CardDescription>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-medium mb-3">Complexity Level</h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge>Intermediate</Badge>
                                <Badge>Advanced</Badge>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-3">Project Duration</h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge>1-3 months</Badge>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-3">Team Size</h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge>2-4 members</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Availability */}
                    <div className="group relative">
  <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
  <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
    <CardHeader className="flex flex-row items-start justify-between">
      <div>
        <CardTitle>Availability</CardTitle>
        <CardDescription>Your collaboration availability</CardDescription>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={() => setIsEditing(!isEditing)}
      >
        <EditIcon className="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Hours per Week</h4>
          {isEditing ? (
            <Select 
              value={editableProfile.hoursPerWeek} 
              onValueChange={(value) => handleProfileChange('hoursPerWeek', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5 hours">1-5 hours</SelectItem>
                <SelectItem value="5-10 hours">5-10 hours</SelectItem>
                <SelectItem value="10-20 hours">10-20 hours</SelectItem>
                <SelectItem value="20+ hours">20+ hours</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Badge>{editableProfile.hoursPerWeek}</Badge>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-sm font-medium mb-3">Status</h4>
          {isEditing ? (
            <Select 
              value={editableProfile.availability} 
              onValueChange={(value) => handleProfileChange('availability', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available for Collaboration</SelectItem>
                <SelectItem value="limited">Limited Availability</SelectItem>
                <SelectItem value="unavailable">Not Available Currently</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex gap-2">
              <Badge className={
                editableProfile.availability === 'available' 
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                  : editableProfile.availability === 'limited'
                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
              }>
                {editableProfile.availability === 'available' 
                  ? "Available for Collaboration" 
                  : editableProfile.availability === 'limited'
                    ? "Limited Availability"
                    : "Not Available Currently"
                }
              </Badge>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
</div>


                    {/* Communication */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                      <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                        <CardHeader className="flex flex-row items-start justify-between">
                          <div>
                            <CardTitle>Communication</CardTitle>
                            <CardDescription>Your contact preferences</CardDescription>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-medium mb-3">Email</h4>
                              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-2 rounded-md">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user?.email || 'user@example.com'}</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-3">Preferred Platforms</h4>
                              <div className="flex gap-2">
                                <Badge>Discord</Badge>
                                <Badge>GitHub</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
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

      <Footer />
    </main>
    </PageTransition>
  );
}