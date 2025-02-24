import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, Sparkles } from "lucide-react";

const FeatureSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "AI-Powered Generation",
      description: "Get personalized project suggestions based on your skills and interests, tailored to your experience level."
    },
    {
      icon: <Code2 className="h-6 w-6 text-primary" />,
      title: "Tech Stack Matching",
      description: "Find and explore projects that perfectly match your preferred technologies and development environment setup."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Collaboration Hub",
      description: "Connect with developers, share ideas, and build amazing projects together in a supportive community."
    }
  ];

  // Handle scroll snap observation
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveSlide(index);
          }
        });
      },
      {
        root: scrollElement,
        threshold: 0.5
      }
    );

    scrollElement.querySelectorAll('[data-index]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      className="feature-slider md:grid md:grid-cols-3 md:gap-8 max-w-5xl mx-auto mt-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Mobile Slider */}
      <div className="md:hidden w-full">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4"
          style={{ 
            scrollBehavior: 'smooth',
            overflowY: 'hidden' // Prevent vertical scrolling
          }}
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              data-index={index}
              className="group relative flex-none w-[85vw] snap-center h-full"
            >
              {/* Background shadow element */}
              <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
              
              {/* Main card content */}
              <div className="relative flex flex-col items-center text-center p-8 rounded-lg bg-white dark:bg-black border border-black dark:border-white transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 h-full">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const cards = scrollRef.current?.querySelectorAll('[data-index]');
                cards?.[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
              }}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === activeSlide 
                  ? 'bg-black dark:bg-white' 
                  : 'bg-black/20 dark:bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      {features.map((feature, index) => (
        <div key={index} className="group relative hidden md:block">
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
  );
};

export default FeatureSlider;