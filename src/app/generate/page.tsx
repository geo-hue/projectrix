'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Sparkles, 
  RefreshCcw,
  Bookmark,
  Share2,
  Clock,
  Users,
  Layers,
  Code2,
  X
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Textarea } from '@/components/ui/textarea';
import { TechSelect } from '@/components/TechSelect';

const technologies = [
  { label: "React", value: "react" },
  { label: "Next.js", value: "nextjs" },
  { label: "TypeScript", value: "typescript" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Django", value: "django" },
  { label: "PostgreSQL", value: "postgresql" },
  { label: "MongoDB", value: "mongodb" },
  // Add more technologies
];

export default function GeneratePage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
    const [complexityLevel, setComplexityLevel] = useState(50);
    const [techSearchOpen, setTechSearchOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
  
    const handleGenerate = () => {
      setIsGenerating(true);
      setTimeout(() => setIsGenerating(false), 2000);
    };
  
    // Function to get complexity label based on slider value
    const getComplexityLabel = (value: number) => {
      if (value <= 33) return "Beginner";
      if (value <= 66) return "Intermediate";
      return "Advanced";
    };
  
    // Function to get background color based on complexity
    const getComplexityColor = (value: number) => {
      if (value <= 33) return "bg-green-500";
      if (value <= 66) return "bg-yellow-500";
      return "bg-red-500";
    };

  return (
    <main className="min-h-screen bg-background pb-12">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-8">
        <div className="container px-4 mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent font-orbitron"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Generate Your Next Project
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Tell us your preferred technologies and requirements, and we'll generate the perfect project idea for you.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Preferences Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Preferences</CardTitle>
              <CardDescription>Customize your project generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Technologies Multi-select */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Technologies</label>
                <Popover open={techSearchOpen} onOpenChange={setTechSearchOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={techSearchOpen}
            className="w-full justify-between"
          >
            Select technologies...
            <span className="ml-2 h-4 w-4 shrink-0 opacity-50">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-background border shadow-lg">
          <div className="p-2 space-y-2">
            {technologies.map((tech) => (
              <div
                key={tech.value}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer
                  ${selectedTechs.includes(tech.value) 
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted/50'}
                `}
                onClick={() => {
                  setSelectedTechs(prev =>
                    prev.includes(tech.value)
                      ? prev.filter(item => item !== tech.value)
                      : [...prev, tech.value]
                  );
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTechs.includes(tech.value)}
                  onChange={() => {}}
                  className="h-4 w-4"
                />
                {tech.label}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
                
                {/* Selected Technologies */}
                <div className="flex flex-wrap gap-2 mt-2">
        {selectedTechs.map(tech => (
          <Badge 
            key={tech}
            variant="secondary"
            className="flex items-center gap-1 pr-1 hover:bg-destructive/10 transition-colors"
          >
            {technologies.find(t => t.value === tech)?.label}
            <button
              onClick={() => setSelectedTechs(prev => 
                prev.filter(item => item !== tech)
              )}
              className="ml-1 hover:bg-background/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
                </div>
              </div>

              {/* Project Complexity */}
              <div className="space-y-4">
  <div className="flex justify-between items-center">
    <label className="text-sm font-medium">Complexity Level</label>
    <span className="text-sm text-muted-foreground">
      {getComplexityLabel(complexityLevel)} ({complexityLevel}%)
    </span>
  </div>
  <div className="relative">
    <Slider
      value={[complexityLevel]}
      onValueChange={(value) => setComplexityLevel(value[0])}
      max={100}
      step={1}
      className="slider"
    />
  </div>
  <div className="flex justify-between text-xs text-muted-foreground">
    <span>Beginner</span>
    <span>Intermediate</span>
    <span>Advanced</span>
  </div>
</div>


              {/* Project Duration */}
           <div className="space-y-2">
  <label className="text-sm font-medium">Estimated Duration</label>
  <Select>
    <SelectTrigger className="w-full select-trigger">
      <SelectValue placeholder="Select duration" />
    </SelectTrigger>
    <SelectContent sideOffset={4} className="select-content">
      <SelectItem value="small" className="select-item">Small (1-2 weeks)</SelectItem>
      <SelectItem value="medium" className="select-item">Medium (1-2 months)</SelectItem>
      <SelectItem value="large" className="select-item">Large (3+ months)</SelectItem>
    </SelectContent>
  </Select>
</div>

              {/* Team Size */}
              <div className="space-y-2">
  <label className="text-sm font-medium">Team Size</label>
  <Select>
    <SelectTrigger className="w-full select-trigger">
      <SelectValue placeholder="Select team size" />
    </SelectTrigger>
    <SelectContent sideOffset={4} className="select-content">
      <SelectItem value="solo" className="select-item">Solo Project</SelectItem>
      <SelectItem value="small" className="select-item">2-3 Members</SelectItem>
      <SelectItem value="medium" className="select-item">4-6 Members</SelectItem>
    </SelectContent>
  </Select>
</div>


              {/* Project Category */}
              <div className="space-y-2">
  <label className="text-sm font-medium">Project Category</label>
  <Select>
    <SelectTrigger className="w-full select-trigger">
      <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent sideOffset={4} className="select-content">
      <SelectItem value="web" className="select-item">Web Application</SelectItem>
      <SelectItem value="mobile" className="select-item">Mobile App</SelectItem>
      <SelectItem value="ai" className="select-item">AI/ML</SelectItem>
      <SelectItem value="game" className="select-item">Game Development</SelectItem>
      <SelectItem value="data" className="select-item">Data Science</SelectItem>
    </SelectContent>
  </Select>
</div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Project Idea
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Results Panel */}
          <motion.div 
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI-Powered Chat Application</CardTitle>
                    <CardDescription>A real-time chat platform with AI capabilities</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">2-3 months</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">3-4 members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Intermediate</span>
                  </div>
                </div>

                {/* Required Technologies */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Required Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>React</Badge>
                    <Badge>Node.js</Badge>
                    <Badge>Socket.io</Badge>
                    <Badge>MongoDB</Badge>
                    <Badge>OpenAI API</Badge>
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Project Description</h3>
                  <p className="text-muted-foreground">
                    Build a modern chat application that incorporates AI capabilities for enhanced user interaction. 
                    The application will feature real-time messaging, AI-powered message suggestions, and automated responses.
                  </p>
                </div>

                {/* Key Features */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Key Features</h3>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Real-time messaging using Socket.io</li>
                    <li>AI-powered message suggestions</li>
                    <li>User authentication and profiles</li>
                    <li>Message history and search</li>
                    <li>File sharing capabilities</li>
                  </ul>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Learning Outcomes</h3>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Real-time application architecture</li>
                    <li>AI/ML integration in web applications</li>
                    <li>State management in real-time systems</li>
                    <li>WebSocket implementation</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 gap-2">
                    <Code2 className="h-4 w-4" />
                    Start Project
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Generate Another
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </section>


      <div className="relative my-12">
  <div className="absolute inset-0 flex items-center" aria-hidden="true">
    <div className="w-full border-t border-border"></div>
  </div>
  <div className="relative flex justify-center">
    <span className="bg-background dark:bg-background/95 backdrop-blur-sm px-8 py-2 text-base font-medium text-muted-foreground rounded-full border border-border">
      OR
    </span>
  </div>
</div>

{/* Have a Project Idea Section */}
<section className="pt-8 pb-8">
          <div className="container px-4 mx-auto text-center">
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
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <Code2 className="h-4 w-4" />
                Submit Your Project
              </Button>
            </motion.div>
          </div>
        </section>

{/* Modal/Dialog for Project Submission */}
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Submit Your Project Idea</DialogTitle>
      <DialogDescription>
        Share your project details to find the perfect collaborators.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-6 py-4">
      {/* Project Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input id="title" placeholder="Enter your project title" />
      </div>

      {/* Project Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Project Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe your project idea, goals, and vision..."
          className="h-32"
        />
      </div>

      {/* Required Technologies */}
      <div className="space-y-2">
  <Label>Required Technologies</Label>
  <TechSelect
    onSelect={(techs) => {
      // Handle selected technologies
      console.log('Selected techs:', techs);
    }}
  />
</div>

      {/* Project Status */}
      <div className="space-y-2">
        <Label>Project Status</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select project status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="planning">Planning Phase</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Requirements */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Team Size</Label>
          <Select>
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">1-2 months</SelectItem>
              <SelectItem value="medium">3-6 months</SelectItem>
              <SelectItem value="long">6+ months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Complexity Level */}
      <div className="space-y-2">
        <Label>Project Complexity</Label>
        <div className="space-y-4">
          <Slider
            defaultValue={[50]}
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
      </div>
    </div>
    <DialogFooter>
    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
      <Button type="submit">Submit Project</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </main>
  );
}