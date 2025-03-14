'use client';

import { motion } from "framer-motion";
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from "react";

export default function ScrollDownButton() {
  const [isVisible, setIsVisible] = useState(true);

  // Hide the button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    // Scroll to the content section
    const contentSection = document.querySelector('.content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="hidden md:flex flex-col items-center absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20
      }}
      transition={{ 
        duration: 0.5,
        delay: 1.2
      }}
    >
      <motion.p 
        className="text-sm font-medium mb-3 text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Discover More
      </motion.p>
      
      <motion.button
        onClick={scrollToContent}
        className="relative group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Outer ring with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Button background */}
        <div className="relative h-12 w-12 rounded-full bg-white dark:bg-black border border-blue-500/30 dark:border-blue-400/30 flex items-center justify-center shadow-lg overflow-hidden">
          {/* Animated background effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20"
            animate={{ 
              y: ["0%", "100%", "0%"],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          
          {/* Arrow icon with animation */}
          <motion.div
            animate={{ 
              y: [0, 5, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <ChevronDown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
}
