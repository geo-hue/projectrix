'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, Code2, Users, Github, ArrowRight, Linkedin, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TechBackground from "@/components/TechBackground";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-background relative">
        <TechBackground/>
      <Header />
      
      {/* Hero Section */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent font-orbitron">
              Your Gateway to Collaborative Development
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Projectrix connects developers with meaningful projects and collaborators, making it easier than ever to build your portfolio while working with others.
            </p>
          </motion.div>
        </div>
      </section>


      {/* Story Section */}
      <section className="py-10 bg-muted/50">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
              Our Story
            </h2>
            <div className="group relative max-w-4xl mx-auto">
              {/* Background shadow - reduced thickness and offset */}
              <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
              
              {/* Content */}
              <div className="relative p-8 rounded-lg bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground mb-4">
                    Projectrix was born from a simple observation: many developers have the skills and motivation to build great projects, but struggle to find meaningful ideas and reliable collaborators.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Our platform solves this by combining AI-powered project generation with a collaborative community. Whether you&apos;re a beginner looking to build your first project or an experienced developer seeking new challenges, Projectrix helps you find the right project and the right team.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="py-10">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Brain className="h-6 w-6 text-primary" />,
                title: "Generate Ideas",
                description: "Get personalized project suggestions based on your skills and interests using our AI-powered system."
              },
              {
                icon: <Users className="h-6 w-6 text-primary" />,
                title: "Find Collaborators",
                description: "Connect with developers who complement your skillset and bring diverse perspectives to help create outstanding applications."
              },
              {
                icon: <Code2 className="h-6 w-6 text-primary" />,
                title: "Build Together",
                description: "Work collaboratively, share knowledge and bring innovative projects to life while growing as a developer"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {/* Background shadow element */}
                <div className="absolute inset-0 bg-black dark:bg-white translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
                
                {/* Main card content */}
                <div className="relative flex flex-col items-center text-center p-8 rounded-lg bg-white dark:bg-black border border-black dark:border-white transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Meet the Creator Section  */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
              Meet the Creator
            </h2>
            
            <div className="group relative max-w-2xl mx-auto">
              {/* Background shadow - reduced thickness and offset */}
              <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
              
              {/* Content */}
              <div className="relative p-8 rounded-lg bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Profile Image Container */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 p-1">
                      <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Ukoh-Godwin George</h3>
                    <p className="text-primary font-medium mb-4">Founder & Lead Developer</p>
                    <p className="text-muted-foreground mb-6">
                      A passionate developer dedicated to creating tools that help the developer community grow and collaborate effectively.
                    </p>
                    
                    {/* Social Links */}
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <a
                        href="https://github.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a
                        href="https://linkedin.com/in/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a
                        href="https://ukohgodwingeorge-portfolio.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
              Ready to Start Building?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Join our community of developers and start creating amazing projects together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default AboutPage;