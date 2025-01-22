'use client';

import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Users, Sparkles, Github, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import TechScroll from '@/components/TechScroll';
import { useEffect } from 'react';
import { useState } from 'react';
import EnhancedStats from '@/components/EnhancedStats';
import EnhancedFAQ from '@/components/EnhancedFAQ';
import Footer from '@/components/Footer';
import TechBackground from '@/components/TechBackground';
import TextRevealLoader from '@/components/TextRevealLoader';


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);
  

  return (
    <AnimatePresence mode='wait'>
    {isLoading ? (
<TextRevealLoader/>
    ) : (
      <motion.main
        key="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background relative"
      >
        <TechBackground/>
      <Header />
      <section className="pt-16 pb-12 md:pt-16 md:pb-20">
        <div className="container px-4 mx-auto">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent font-orbitron"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Transform Ideas into 
              <br /> Collaborative Projects
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Generate project ideas based on your tech stack, find collaborators,
              and build something amazing together.
            </motion.p>

            <motion.div 
    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <Button 
      size="lg" 
      className="w-full sm:w-auto gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
    >
      Generate Ideas <ArrowRight className="h-4 w-4" />
    </Button>
    <Button 
      size="lg" 
      variant="outline" 
      className="w-full sm:w-auto gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
    >
      <Github className="h-4 w-4" /> Login with GitHub
    </Button>
  </motion.div>
          </div>

{/* Features Section */}
<motion.div 
  className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
>
  {[
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "AI-Powered Generation",
      description: "Get personalized project suggestions based on your skills and interests, tailored to your experience level."
    },
    {
      icon: <Code2 className="h-6 w-6 text-primary" />,
      title: "Tech Stack Matching",
      description: "Find projects that perfectly match your preferred technologies and development environment setup."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Collaboration Hub",
      description: "Connect with developers, share ideas, and build amazing projects together in a supportive community."
    }
  ].map((feature, index) => (
    <div key={index} className="group relative">
      {/* Background shadow element */}
      <div className="absolute inset-0 bg-black dark:bg-white translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
      
      {/* Main card content */}
      <div className="relative flex flex-col items-center text-center p-8 rounded-lg bg-white dark:bg-black border border-black dark:border-white transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
          {feature.icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </div>
  ))}
</motion.div>

          {/* Stats Section */}
          <motion.div 
  className="mt-20"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
  <EnhancedStats />
</motion.div>
        </div>
      </section>

{/* How It Works Section */}
<section className="py-20 bg-muted/50">
  <div className="container px-4 mx-auto">
    <motion.div 
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">How It Works</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Get from idea to collaboration in four simple steps
      </p>
    </motion.div>

    <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
      {[
        {
          icon: <Code2 className="h-6 w-6" />,
          title: "Select Tech Stack",
          description: "Choose your preferred programming languages, frameworks, and tools to match your development style.",
          step: "01"
        },
        {
          icon: <Sparkles className="h-6 w-6" />,
          title: "Generate Ideas",
          description: "Get AI-powered project suggestions perfectly aligned with your technical expertise and interests.",
          step: "02"
        },
        {
          icon: <Users className="h-6 w-6" />,
          title: "Find Collaborators",
          description: "Connect with skilled developers who share your vision and complement your technical abilities.",
          step: "03"
        },
        {
          icon: <Zap className="h-6 w-6" />,
          title: "Start Building",
          description: "Begin your development journey with a clear, well outline plan and an enthusiastic team ready to contribute.",
          step: "04"
        }
      ].map((step, index) => (
        <motion.div 
          key={index}
          className="group relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          {/* Connector Line */}
          {index < 3 && (
            <div className="hidden md:block absolute top-12 left-full w-full h-[1px] z-0">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-900/20 dark:from-blue-400/20 dark:to-blue-700/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-700 w-0 group-hover:w-full transition-all duration-700" />
              </div>
            </div>
          )}

          {/* Background shadow - reduced thickness and offset */}
          <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
          
          {/* Card Content */}
          <div className="relative flex flex-col items-center text-center p-8 rounded-lg bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
            {/* Step Number */}
            <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 flex items-center justify-center text-white font-bold text-sm">
              {step.step}
            </div>
            
            {/* Icon */}
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
              {step.icon}
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Technologies Section */}
<section className="py-20 overflow-hidden">
  <div className="container px-4 mx-auto">
    <motion.div 
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
        Supported Technologies
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Generate projects using your favorite technologies
      </p>
    </motion.div>

    <TechScroll />
  </div>
</section>

{/* FAQ Section */}
<section className="py-20 bg-muted/50">
  <div className="container px-4 mx-auto">
    <motion.div 
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">Frequently Asked Questions</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Everything you need to know about Projectrix
      </p>
    </motion.div>

    <EnhancedFAQ />
  </div>
</section>


{/* Final CTA Section */}
<section className="py-20">
  <div className="container px-4 mx-auto">
    <motion.div 
      className="max-w-4xl mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
        Ready to Start Your Next Project?
      </h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Join our community of developers and turn your ideas into reality.
      </p>
      <Button 
    size="lg" 
    className="gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
  >
    Get Started <ArrowRight className="h-4 w-4" />
  </Button>
    </motion.div>
  </div>
</section>

{/* Footer */}
<Footer/>
    </motion.main>
    )}
        </AnimatePresence>
  );
}