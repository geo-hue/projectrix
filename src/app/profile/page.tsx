'use client';

import Header from '@/components/Header';
import { 
  Github, 
  Mail,
  Clock,
  Sparkles,
  Users,
  ArrowRight,
  Filter,
  Settings,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function ProfilePage() {
  const isLoading = false; // Replace with actual loading state

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="h-48 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400" />
      
      <div className="container px-4 mx-auto pb-20">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <div className="relative">
            {/* Profile Overview */}
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              <div className="flex-shrink-0">
                <img 
                  src="https://github.com/ukohae.png" 
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-background bg-background"
                />
              </div>
              <div className="flex-grow pt-4 md:pt-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">John Doe</h1>
                    <p className="text-muted-foreground">@johndoe</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" /> Available for Collaboration
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-3">
                    <Button className="gap-2">
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="projects" className="mt-12">
              <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex h-auto p-1 mb-8">
                <TabsTrigger value="projects" className="py-2.5">Projects</TabsTrigger>
                <TabsTrigger value="preferences" className="py-2.5">Preferences</TabsTrigger>
                <TabsTrigger value="collaborations" className="py-2.5">Collaborations</TabsTrigger>
                <TabsTrigger value="activity" className="py-2.5">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                <div className="grid gap-6">
                  {/* Quick Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="gap-2 flex-1 sm:flex-none">
                      <Sparkles className="h-4 w-4" />
                      Generate New Project
                    </Button>
                    <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
                      <Filter className="h-4 w-4" />
                      Filter Ideas
                    </Button>
                  </div>

                  {/* Generated Projects */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* New Project Card */}
                    <Card className="border-dashed hover:border-primary/50 cursor-pointer transition-colors group">
                      <CardHeader className="flex flex-row items-center justify-center h-40">
                        <PlusCircle className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </CardHeader>
                      <CardContent className="text-center">
                        <CardTitle className="text-muted-foreground group-hover:text-primary transition-colors">
                          Generate New Project Idea
                        </CardTitle>
                      </CardContent>
                    </Card>

                    {/* Project Cards */}
                    {[1, 2, 3].map((project) => (
                      <Card key={project} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle>AI-Powered Chat Application</CardTitle>
                          <CardDescription>Generated on Jan 15, 2024</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge>React</Badge>
                              <Badge>Node.js</Badge>
                              <Badge>OpenAI</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">2 Collaborators Needed</span>
                              </div>
                              <Button variant="ghost" size="sm" className="gap-2">
                                View Details <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Tech Stack Preferences */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tech Stack Preferences</CardTitle>
                      <CardDescription>Technologies you want to work with</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">TypeScript</Badge>
                        <Badge variant="secondary">Node.js</Badge>
                        <Badge variant="secondary">Python</Badge>
                        <Badge variant="secondary">PostgreSQL</Badge>
                        <Button variant="outline" size="sm" className="gap-2">
                          <PlusCircle className="h-3 w-3" /> Add More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Project Preferences */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Preferences</CardTitle>
                      <CardDescription>Your ideal project settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Complexity Level</h4>
                          <div className="flex gap-2">
                            <Badge>Intermediate</Badge>
                            <Badge>Advanced</Badge>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Project Duration</h4>
                          <Badge>1-3 months</Badge>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Team Size</h4>
                          <Badge>2-4 members</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Availability */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Availability</CardTitle>
                      <CardDescription>Your collaboration availability</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Hours per Week</h4>
                          <Badge>10-20 hours</Badge>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Time Zone</h4>
                          <Badge>UTC-5 (Eastern Time)</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Communication */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Communication</CardTitle>
                      <CardDescription>Your contact preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>john.doe@example.com</span>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Preferred Platforms</h4>
                          <div className="flex gap-2">
                            <Badge>Discord</Badge>
                            <Badge>Slack</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Add other tab contents */}
            </Tabs>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">How it Works</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Guides</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">GitHub</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/40 text-center">
            <p className="text-muted-foreground">Developed by <a 
              href="https://ukohgodwingeorge-portfolio.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent hover:after:w-full after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-blue-900 after:to-blue-600 dark:after:from-blue-700 dark:after:to-blue-400 after:transition-all after:duration-300"
            >
              Ukoh-Godwin George
            </a></p>
            <p className="text-muted-foreground mt-2">&copy; 2025 Projectrix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}