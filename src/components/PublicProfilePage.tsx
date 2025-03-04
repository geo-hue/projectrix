'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Github, 
  Mail, 
  Sparkles,
  Code2,
  Globe,
  MessageCircle,
  Twitter,
  Linkedin,
  Loader2,
  PanelRightOpen, 
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechBackground from '@/components/TechBackground';
import PageTransition from '@/components/PageTransition';
import { toast } from 'sonner';

// Custom dialog for messaging
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

// Import API hooks
import { useGetPublicProfileQuery } from '@/app/api/userProfileApiSlice';
import { useSendMessageMutation } from '@/app/api/messageApiSlice';
import { useAuth } from '@/app/context/AuthContext';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';

interface PublicProfilePageProps {
    params: {
      username: string;
    } | {
      value: string;  // For ReactPromise serialized value
      status?: string;
    } | any;  // Fallback for other formats
  }

const PublicProfilePage = ({ params }: PublicProfilePageProps) => {

    let username: string | undefined;
  
    try {
      // Check if params is a ReactPromise with a value property that's a string
      if (params && typeof (params as any).value === 'string') {
        // Parse the JSON string value
        const parsedValue = JSON.parse((params as any).value);
        username = parsedValue.username;
      } 
      // Regular object case
      else if (params && typeof params === 'object') {
        username = params.username;
      }
      
      console.log("Extracted username:", username);
    } catch (error) {
      console.error("Error parsing params:", error);
    }

  const router = useRouter();
  const { isAuthenticated, login, user } = useAuth();
  
  // State for messaging dialog
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  
  // API hooks
  const { data, isLoading, error } = useGetPublicProfileQuery(username || '', {
    // Skip the query if no username is provided
    skip: !username
  });
  const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();
  
  const profileData = data?.publicProfile;
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      try {
        await login();
        toast.info('Please log in to send messages');
      } catch (error) {
        console.error('Login error:', error);
      }
      return;
    }
    
    if (!messageContent.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    try {
      await sendMessage({
        receiverId: profileData?.user?._id,
        content: messageContent
      }).unwrap();
      
      toast.success('Message sent successfully!');
      setMessageContent('');
      setIsMessageDialogOpen(false);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };
  
  // Check if own profile
  const isOwnProfile = user?.username === username;
  
  // Handle external links
  const openExternalLink = (url?: string) => {
    if (!url) return;
    
    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-background relative">
          <Header />
          <TechBackground />
          <div className="container mx-auto px-4 pt-24 pb-12 flex justify-center items-center min-h-[70vh]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Loading profile for {username}...</p>
            </div>
          </div>
          <Footer />
        </main>
      </PageTransition>
    );
  }
  
  if (error || !profileData) {
    console.error('Profile fetch error:', error);
    return (
      <PageTransition>
        <main className="min-h-screen bg-background relative">
          <Header />
          <TechBackground />
          <div className="container mx-auto px-4 pt-24 pb-12 flex justify-center items-center min-h-[70vh]">
            <div className="text-center">
              {/* Replace Users icon with SVG using Next.js Image component */}
              <div className="w-194 h-64 mx-auto mb-6 relative">
                <Image 
                  src="/demo.svg" 
                  alt="User not found" 
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  onError={(e) => {
                    // Fallback to Users icon if SVG fails to load
                    e.currentTarget.style.display = 'none';
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'flex justify-center';
                    fallbackDiv.innerHTML = '<div class="h-16 w-16 text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>';
                    e.currentTarget.parentNode.appendChild(fallbackDiv);
                  }}
                />
              </div>
              <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
              <p className="text-muted-foreground mb-2">
                We couldn't find a user with the username "{username}".
              </p>
              {error && (
                <p className="text-red-500 text-sm mb-6">
                  {(error as any)?.data?.message || 'Error loading profile'}
                </p>
              )}
              <div className="flex justify-center gap-4">
                <Button onClick={() => router.push('/ideas')}>
                  Browse Projects
                </Button>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative">
        <Header />
        <TechBackground />
        
        {/* Subtle blue glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blue-glow -z-10 opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blue-glow -z-10 opacity-60"></div>
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
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
                          {profileData.user?.avatar ? (
                            <img 
                              src={profileData.user.avatar}
                              alt={`${profileData.user.name}'s profile`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.src = "https://avatar.vercel.sh/" + (profileData.user.username || "user");
                              }}
                            />
                          ) : (
                            // Fallback if no avatar URL exists
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                              <span className="text-4xl font-bold">{profileData.user?.name?.charAt(0) || "U"}</span>
                            </div>
                          )}
                        </div>
                        
                        <h1 className="text-2xl md:text-3xl font-bold text-center mb-1">{profileData.user?.name || "GitHub User"}</h1>
                        <p className="text-muted-foreground text-center mb-4">@{profileData.user?.username || "username"}</p>
                        
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" /> {profileData.profile?.availability || "Available"}
                          </Badge>
                          {profileData.profile?.hoursPerWeek && (
                            <Badge variant="outline" className="gap-1">
                              {profileData.profile.hoursPerWeek}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-3 mb-4">
                          {profileData.profile?.githubProfile && (
                            <Button 
                              size="sm"
                              variant="outline" 
                              className="gap-1 bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
                              onClick={() => openExternalLink(profileData.profile.githubProfile)}
                            >
                              <Github className="h-3 w-3" />
                              GitHub
                            </Button>
                          )}
                          
                          {profileData.profile?.website && (
                            <Button 
                              size="sm"
                              variant="outline" 
                              className="gap-1 bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
                              onClick={() => openExternalLink(profileData.profile.website)}
                            >
                              <Globe className="h-3 w-3" />
                              Website
                            </Button>
                          )}
                        </div>
                        
                        {!isOwnProfile && (
                          <Button 
                            size="sm"
                            className="w-full mt-2 gap-1 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_2px_0_0_rgba(0,0,0,1)] dark:shadow-[0_2px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                            onClick={() => setIsMessageDialogOpen(true)}
                          >
                            <MessageCircle className="h-3 w-3" />
                            Message
                          </Button>
                        )}
                      </div>
                      
                      {/* Right column with bio and stats */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                          <div>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                              Profile Overview
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Joined {new Date(profileData.user?.createdAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                            </p>
                          </div>
                          
                          <div className="flex mt-4 md:mt-0 gap-2">
                            {profileData.profile?.twitterProfile && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openExternalLink(profileData.profile.twitterProfile)}
                              >
                                <Twitter className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {profileData.profile?.linkedinProfile && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openExternalLink(profileData.profile.linkedinProfile)}
                              >
                                <Linkedin className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {profileData.user.email && profileData.profile?.publicEmail && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => window.location.href = `mailto:${profileData.user.email}`}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Bio Section */}
                        <div className="mb-6">
                          <h3 className="text-sm font-medium mb-2">About</h3>
                          <p className="text-sm text-muted-foreground">
                            {profileData.profile?.bio || "This user has not added a bio yet."}
                          </p>
                        </div>
                        
                        {/* Skills */}
                        <div className="mb-6">
                          <h3 className="text-sm font-medium mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {profileData.profile?.skills && profileData.profile.skills.length > 0 ? (
                              profileData.profile.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">{skill}</Badge>
                              ))
                            ) : (
                              <p className="text-xs text-muted-foreground">No skills listed</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Preferred Technologies */}
                        {profileData.profile?.preferredTechnologies && profileData.profile.preferredTechnologies.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-sm font-medium mb-2">Preferred Technologies</h3>
                            <div className="flex flex-wrap gap-1.5">
                              {profileData.profile.preferredTechnologies.map((tech, index) => (
                                <Badge key={index} variant="outline">{tech}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Preferred Roles */}
                        {profileData.profile?.preferredRoles && profileData.profile.preferredRoles.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-sm font-medium mb-2">Preferred Roles</h3>
                            <div className="flex flex-wrap gap-1.5">
                              {profileData.profile.preferredRoles.map((role, index) => (
                                <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20">{role}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Projects Generated</p>
                            <p className="text-2xl font-bold">{profileData.stats?.projectsGenerated || 0}</p>
                          </div>
                          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Active Collaborations</p>
                            <p className="text-2xl font-bold">{profileData.stats?.projectsCollaborated || 0}</p>
                          </div>
                          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">Published Projects</p>
                            <p className="text-2xl font-bold">{profileData.stats?.publishedProjects || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Published Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Published Projects</h2>
                
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={() => router.push('/ideas')}
                >
                  <PanelRightOpen className="h-4 w-4" /> 
                  Browse All Projects
                </Button>
              </div>
              
              {profileData.publishedProjects && profileData.publishedProjects.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profileData.publishedProjects.map((project) => (
                    <ProjectCard 
                      key={project._id} 
                      project={{
                        ...project,
                        publisher: profileData.user
                      }}
                      height={400}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed text-center py-12">
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Code2 className="h-8 w-8 text-primary/70" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Published Projects</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-4">
                        {isOwnProfile
                          ? "You haven't published any projects yet. Generate a project idea and publish it to share with others."
                          : `${profileData.user.name} hasn't published any projects yet.`
                        }
                      </p>
                      
                      {isOwnProfile && (
                        <Button 
                          className="gap-2"
                          onClick={() => router.push('/generate')}
                        >
                          <Sparkles className="h-4 w-4" />
                          Generate a Project
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Message Dialog */}
        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send Message to {profileData.user?.name}</DialogTitle>
              <DialogDescription>
                Your message will be sent directly to {profileData.user?.name}. They will be able to respond via the messaging system.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={profileData.user?.avatar || `https://avatar.vercel.sh/${profileData.user?.username || "user"}`}
                    alt={profileData.user?.name || "User"} 
                  />
                  <AvatarFallback>{profileData.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                
                <textarea
                  className="flex-1 h-32 p-3 text-sm rounded-md border border-input bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Write your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                Messages are limited to 1000 characters. Keep communications professional and project-related.
              </p>
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsMessageDialogOpen(false)}
                disabled={isSendingMessage}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={isSendingMessage || !messageContent.trim()}
              >
                {isSendingMessage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Footer />
      </main>
    </PageTransition>
  );
};

export default PublicProfilePage;