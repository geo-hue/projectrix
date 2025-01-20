'use client';

import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Users, Sparkles, Github, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import TechScroll from '@/components/TechScroll';
import { useEffect } from 'react';
import { useState } from 'react';


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
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
      >
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-blue-600/20 dark:from-blue-700/20 dark:to-blue-400/20"
            />
            {/* Grid Pattern */}
            <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-10">
              {[...Array(64)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: Math.random() }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: Math.random() * 2 }}
                  className="bg-blue-500 dark:bg-blue-400 h-full"
                />
              ))}
            </div>
          </div>

          {/* Center Content */}
          <div className="relative">
            {/* Rotating Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 border border-blue-600/20 dark:border-blue-400/20 rounded-full"
                style={{
                  width: `${(i + 1) * 100}px`,
                  height: `${(i + 1) * 100}px`,
                  marginLeft: `-${((i + 1) * 100) / 2}px`,
                  marginTop: `-${((i + 1) * 100) / 2}px`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, i % 2 === 0 ? 1.1 : 0.9, 1],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}

            {/* Main Logo Text Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Glowing Effect */}
              <motion.div
                className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-900/30 to-blue-600/30 dark:from-blue-700/30 dark:to-blue-400/30"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* PROJECTRIX Text */}
              <h1 className="text-4xl md:text-6xl font-bold font-orbitron relative">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent"
                >
                  PROJECT
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-700 bg-clip-text text-transparent"
                >
                  RIX
                </motion.span>
              </h1>
            </motion.div>

            {/* Tech particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-500 dark:bg-blue-400 rounded-full"
                initial={{
                  opacity: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.cos(i * Math.PI / 10) * 100,
                  y: Math.sin(i * Math.PI / 10) * 100,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    ) : (
      <motion.main
        key="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background"
      >
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
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Generate Ideas <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
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
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border/40">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Generation</h3>
              <p className="text-muted-foreground">Get personalized project suggestions based on your skills and interests.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border/40">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tech Stack Matching</h3>
              <p className="text-muted-foreground">Find projects that perfectly match your preferred technologies.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border/40">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Collaboration Hub</h3>
              <p className="text-muted-foreground">Connect with developers and bring ideas to life together.</p>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="space-y-2">
              <h4 className="text-3xl font-bold">500+</h4>
              <p className="text-muted-foreground">Projects Generated</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-bold">200+</h4>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-bold">50+</h4>
              <p className="text-muted-foreground">Technologies</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-bold">100+</h4>
              <p className="text-muted-foreground">Collaborations</p>
            </div>
          </motion.div>
        </div>
      </section>
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

    <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
      {[
        {
          icon: <Code2 className="h-6 w-6" />,
          title: "Select Tech Stack",
          description: "Choose your preferred programming languages and frameworks"
        },
        {
          icon: <Sparkles className="h-6 w-6" />,
          title: "Generate Ideas",
          description: "Get AI-powered project suggestions based on your selections"
        },
        {
          icon: <Users className="h-6 w-6" />,
          title: "Find Collaborators",
          description: "Connect with developers who share your interests"
        },
        {
          icon: <Zap className="h-6 w-6" />,
          title: "Start Building",
          description: "Begin working on your project with your new team"
        }
      ].map((step, index) => (
        <motion.div 
          key={index}
          className="relative flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            {step.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
          <p className="text-muted-foreground">{step.description}</p>
          
          {index < 3 && (
            <div className="hidden md:block absolute top-1/4 left-2/3 w-16 border-t border-dashed border-border" />
          )}
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

    <div className="max-w-3xl mx-auto space-y-6">
      {[
        {
          question: "How does the project idea generation work?",
          answer: "Our AI-powered system analyzes your selected technologies and preferences to generate relevant and exciting project ideas tailored to your skills and interests."
        },
        {
          question: "Can I collaborate with developers from anywhere?",
          answer: "Yes! Projectrix connects you with developers worldwide. You can find collaborators based on shared interests, time zones, and technology preferences."
        },
        {
          question: "Is GitHub integration required?",
          answer: "Yes, we use GitHub for authentication and profile information. This helps us create a more secure and reliable development environment."
        },
        {
          question: "How do I find the right collaborators?",
          answer: "You can browse developer profiles, filter by skills and interests, and connect with potential collaborators directly through our platform."
        }
      ].map((faq, index) => (
        <motion.div
          key={index}
          className="p-6 bg-card rounded-lg border border-border/40"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
          <p className="text-muted-foreground">{faq.answer}</p>
        </motion.div>
      ))}
    </div>
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
      <Button size="lg" className="gap-2">
        Get Started <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  </div>
</section>

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
    </motion.main>
    )}
        </AnimatePresence>
  );
}