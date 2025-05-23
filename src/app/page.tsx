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
import PageTransition from '@/components/PageTransition';
import { useRouter } from 'next/navigation';
import FeatureSlider from '@/components/FeatureSlider';
import { useAuth } from './context/AuthContext';
import ScrollDownButton from '@/components/scroll-down-button';


const styles = `
.card-container {
  perspective: 1000px;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.sticky-card {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  transform-style: preserve-3d;
  transform-origin: center center;
  will-change: transform;
}

.content-section {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background: var(--background);
}
`;


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, login } = useAuth(); 
  const router = useRouter(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);
  
  
  
  useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Cleanup
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <PageTransition>
    <AnimatePresence mode='wait'>
      {isLoading ? (
        <TextRevealLoader/>
      ) : (
        <>
       <Header/>
          <div className="card-container">
            {/* Card 1: Hero Section */}
            <div className="sticky-card">
              <section className="relative bg-background min-h-screen flex items-center justify-center">
                <TechBackground/>
                <div className="container px-4 mx-auto">
                  <div className="max-w-4xl mx-auto text-center">
                  <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-6 pb-2 font-orbitron relative inline-block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
          Transform Ideas into
        </span>
        <br /> 
        <span className="text-black dark:text-white">
          Collaborative Projects
        </span>
        <motion.div
          className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/50"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
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
  className="flex flex-col sm:flex-row items-center justify-center gap-4"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
  {user ? (
    <>
      <Button 
        size="lg" 
        className="w-full sm:w-auto gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
        onClick={() => router.push('/generate')}
      >
        Generate Ideas <ArrowRight className="h-4 w-4" />
      </Button>
      <Button 
        size="lg" 
        variant="outline" 
        className="w-full sm:w-auto gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
        onClick={() => router.push('/ideas')}
      >
        <Sparkles className="h-4 w-4" /> View Project Ideas
      </Button>
    </>
  ) : (
    <>
      <Button 
        size="lg" 
        onClick={login}
        className="w-full sm:w-auto gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
      >
        <Github className="h-4 w-4" /> Login with GitHub
      </Button>
      <Button 
        size="lg" 
        variant="outline" 
        className="w-full sm:w-auto gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
        onClick={() => router.push('/about')}
      >
        Learn More <ArrowRight className="h-4 w-4" />
      </Button>
    </>
  )}
</motion.div>
          </div>

          {/* Scroll indicator - only visible on PC/desktop */}
         <ScrollDownButton/>
</div>
</section>
</div>

<div className='content-section'>
<div 
className="relative bg-background dark:bg-black dark:bg-opacity-[0.97] z-30"
>
            {/* Feature Slider Section  */}
            <section className="py-20">
              <div className="container px-4 mx-auto">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">Key Features</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Everything you need to bring your project ideas to life
                  </p>
                </motion.div>
                <FeatureSlider />
              </div>
            </section>

            {/* Stats Section */}
          <section className="py-20 bg-muted/50">
              <div className="container px-4 mx-auto">
                <motion.div className="">
                  <EnhancedStats />
                </motion.div>
              </div>
            </section>

{/* How It Works Section */}
<section className="py-20">
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
<section className="py-20 overflow-hidden bg-muted/50">
  <div className="container px-4 mx-auto">
    <motion.div 
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent pb-2">
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
<section className="py-20">
  <div className="container px-4 mx-auto">
    <motion.div 
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent pb-2">Frequently Asked Questions</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Everything you need to know about Projectrix
      </p>
    </motion.div>

    <EnhancedFAQ />
  </div>
</section>


{/* Final CTA Section */}
<section className="py-20 bg-muted/50">
  <div className="container px-4 mx-auto">
  <motion.div 
  className="max-w-4xl mx-auto text-center"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
  <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent pb-2">
    {user ? 'Ready to Create Something Amazing?' : 'Ready to Start Your Next Project?'}
  </h2>
  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
    {user 
      ? 'Start generating project ideas and find the perfect team to build with.'
      : 'Join our community of developers and turn your ideas into reality.'
    }
  </p>
  <Button 
    size="lg" 
    className="gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
    onClick={() => user ? router.push('/generate') : handleLogin()}
  >
    {user ? (
      <>Generate Ideas <ArrowRight className="h-4 w-4" /></>
    ) : (
      <>Get Started <ArrowRight className="h-4 w-4" /></>
    )}
  </Button>
</motion.div>
  </div>
</section>

{/* Footer */}
<Footer/>
</div>
</div>
    </div>
    </>
    )}
        </AnimatePresence>
        </PageTransition>
        
  );
}