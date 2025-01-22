import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TechBackground = () => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!isMounted) {
    return (
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-blue-500/5 to-background/10" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-blue-500/5 to-background/10" />
      
      {/* Animated grid */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-12 gap-4 p-8 opacity-30">
            {[...Array(48)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-lg filter blur-sm" />
                <div className="h-full min-h-[100px] rounded-lg border border-blue-500/20 dark:border-blue-400/20" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-blue-500/50 dark:bg-blue-400/50 rounded-full"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
            }}
            animate={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
    </div>
  );
};

export default TechBackground;