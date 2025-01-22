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
import Footer from '@/components/Footer';
import ProjectSubmission from '@/components/ProjectSubmission';
import TechBackground from '@/components/TechBackground';

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
  

  return (
    <main className="min-h-screen bg-background relative">
      <TechBackground/>
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
            Tell us your preferred technologies and requirements, and we&lsquo;ll generate the perfect project idea for you.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Preferences Panel */}
          <div className="lg:col-span-2">
  <div className="group relative">
    {/* Background shadow element */}
    <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
    
    <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
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
  <div className="relative py-2">
    <div className="absolute h-2 w-full bg-secondary rounded-full border border-b-gray-500 border-border"></div>
    
    {/* Slider component */}
    <Slider
      value={[complexityLevel]}
      onValueChange={(value) => setComplexityLevel(value[0])}
      max={100}
      step={1}
      className="relative z-10"
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
  className="w-full gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none" 
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
</div>
</div>

          {/* Results Panel */}
          <motion.div 
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
           <div className="group relative">
    {/* Background shadow element */}
    <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
    
    {/* Main card */}
    <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
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

        {/* Team Structure */}
        <div>
          <h3 className="text-sm font-medium mb-2">Team Structure</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Required Roles</h4>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Frontend Lead (React, Socket.io)</li>
                <li>Frontend Developer (UI/UX)</li>
                <li>Backend Developer (Node.js, MongoDB)</li>
                <li>AI/ML Integration Specialist</li>
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

        {/* Features Grid */}
        <div>
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
              <h4 className="text-sm font-medium text-muted-foreground">AI Features</h4>
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
          <Button className="flex-1 gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none">
            <Code2 className="h-4 w-4" />
            Start Project
          </Button>
          <Button variant="outline" className="flex-1 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none">
            Generate Another
</Button>
                </div>
              </CardFooter>
            </Card>
            </div>
          </motion.div>
        </div>
      </section>


      <div className="relative my-20">
        {/* Thicker horizontal lines */}
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t-2 border-black/20 dark:border-white/20"></div>
        </div>
        
        {/* OR text with improved shadow effect */}
        <div className="relative flex justify-center">
          <div className="group relative">
            {/* Improved shadow element with multiple layers for 3D effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+8px)] h-[calc(100%+8px)] rounded-full bg-black/10 dark:bg-white/10 blur-md transform-gpu transition-all duration-300 group-hover:blur-lg group-hover:scale-110" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+4px)] h-[calc(100%+4px)] rounded-full bg-black/5 dark:bg-white/5 blur-sm transform-gpu transition-all duration-300 group-hover:blur-md group-hover:scale-105" />
            
            {/* Main OR element */}
            <span className="relative inline-flex items-center justify-center bg-white dark:bg-black px-8 py-3 text-base font-semibold rounded-full border-2 border-black/20 dark:border-white/20 transition-all duration-300 group-hover:transform group-hover:-translate-y-1">
              <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                OR
              </span>
            </span>
          </div>
        </div>
      </div>

{/* Have a Project Idea Section */}
<ProjectSubmission/>
<Footer />
    </main>
  );
}