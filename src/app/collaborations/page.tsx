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
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  UserCircle
} from "lucide-react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

// Example data
const myRequests = [
  {
    id: 1,
    projectTitle: "AI-Powered Chat Application",
    owner: "Jane Smith",
    role: "Frontend Developer",
    status: "pending",
    appliedDate: "2024-01-15",
    ownerAvatar: "/api/placeholder/32/32"
  },
  {
    id: 2,
    projectTitle: "E-Learning Platform",
    owner: "Mike Johnson",
    role: "Backend Developer",
    status: "accepted",
    appliedDate: "2024-01-10",
    ownerAvatar: "/api/placeholder/32/32"
  }
];

const incomingRequests = [
  {
    id: 1,
    projectTitle: "Task Management System",
    applicant: {
      name: "Alex Brown",
      avatar: "/api/placeholder/32/32",
      role: "Frontend Lead",
      experience: "5 years",
      github: "github.com/alexb"
    },
    appliedDate: "2024-01-18",
    status: "pending"
  }
];

const myProjects = [
  {
    id: 1,
    title: "Task Management System",
    status: "active",
    collaborators: [
      { name: "Alex Brown", avatar: "/api/placeholder/32/32", role: "Frontend Lead" },
      { name: "Sarah Wilson", avatar: "/api/placeholder/32/32", role: "Backend Dev" }
    ],
    openRoles: ["UI/UX Designer", "DevOps Engineer"],
    lastActivity: "2024-01-20"
  }
];

const CollaborationsPage = () => {
  const getStatusBadge = (status:any) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500">Rejected</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Active</Badge>;
      default:
        return null;
    }
  };

  return (
    <PageTransition>
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 mx-auto py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
              My Collaborations
            </h1>
            <p className="text-muted-foreground">
              Track and manage all your project collaborations in one place
            </p>
          </div>

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
              <div className="grid gap-6">
                {myRequests.map((request) => (
                  <div key={request.id} className="group relative">
                    <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                    <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{request.projectTitle}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <img 
                                src={request.ownerAvatar} 
                                alt={request.owner}
                                className="w-6 h-6 rounded-full"
                              />
                              Owned by {request.owner}
                            </CardDescription>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary">{request.role}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Applied on {request.appliedDate}
                            </span>
                          </div>
                          <Button variant="ghost" className="gap-2">
                            View Details <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Incoming Requests Tab */}
            <TabsContent value="incoming-requests">
              <div className="grid gap-6">
                {incomingRequests.map((request) => (
                  <div key={request.id} className="group relative">
                    <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                    <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{request.projectTitle}</CardTitle>
                            <CardDescription className="mt-1">
                              Request for {request.applicant.role}
                            </CardDescription>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Applicant Info */}
                          <div className="flex items-center gap-4">
                            <img 
                              src={request.applicant.avatar} 
                              alt={request.applicant.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <h4 className="font-medium">{request.applicant.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {request.applicant.experience} experience
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 ml-auto">
                            <Button variant="outline" className="gap-2">
                              <UserCircle className="h-4 w-4" />
                              View Profile
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <MessageCircle className="h-4 w-4" />
                              Message
                            </Button>
                            <Button className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none">
                              <CheckCircle2 className="h-4 w-4" />
                              Accept
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* My Projects Tab */}
            <TabsContent value="my-projects">
              <div className="grid gap-6">
                {myProjects.map((project) => (
                  <div key={project.id} className="group relative">
                    <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                    <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{project.title}</CardTitle>
                            <CardDescription className="mt-1">
                              Last activity: {project.lastActivity}
                            </CardDescription>
                          </div>
                          {getStatusBadge(project.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Team Members */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">Team Members</h4>
                            <div className="flex flex-wrap gap-4">
                              {project.collaborators.map((member, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <img 
                                    src={member.avatar} 
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full"
                                  />
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
                              {project.openRoles.map((role, index) => (
                                <Badge key={index} variant="outline">{role}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" className="gap-2">
                          <Users className="h-4 w-4" />
                          Manage Team
                        </Button>
                        <Button className="gap-2">
                          View Project <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
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