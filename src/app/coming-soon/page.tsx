"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  Zap, 
  Brain
} from "lucide-react"
import TechBackground from "@/components/TechBackground"
import TextRevealLoader from "@/components/TextRevealLoader"
import PageTransition from "@/components/PageTransition"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ComingSoonPage() {
  const [isLoading, setIsLoading] = useState(true)
  // No router needed after removing buttons
  
  // Launch date - set to March 28, 2025
  const launchDate = new Date("2025-03-28T09:00:00Z")
  
  // State for countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Calculate time left until launch
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +launchDate - +new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }
    
    // Initial calculation
    calculateTimeLeft()
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(timer)
  }, [launchDate])

  // Loading screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // 3 seconds loading screen

    return () => clearTimeout(timer)
  }, [])

  return (
    <PageTransition>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <TextRevealLoader />
        ) : (
          <main className="min-h-screen bg-background relative overflow-hidden">
            <TechBackground />
            
            {/* Subtle blue glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blue-glow -z-10 opacity-60"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blue-glow -z-10 opacity-60"></div>

            <div className="container px-4 mx-auto min-h-screen flex flex-col justify-center items-center relative z-10 py-20">
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron">
                  <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                    Something
                  </span>{" "}
                  <span className="text-black dark:text-white">
                    Amazing
                  </span>
                  <br />
                  <span className="text-black dark:text-white">
                    Is Coming
                  </span>
                </h1>
                <motion.div
                  className="h-1 w-32 md:w-48 mx-auto bg-gradient-to-r from-blue-600/50 to-blue-400/50 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
                <p className="text-lg md:text-xl text-muted-foreground mt-6 mb-8 max-w-3xl mx-auto">
                  Projectrix is transforming how developers collaborate and build projects together.
                  Join us on our journey to launch.
                </p>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div
                className="mb-16 w-full max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold mb-2">Launching In</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="group relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      {/* Background shadow */}
                      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
                      
                      {/* Countdown item */}
                      <div className="relative h-36 md:h-44 rounded-lg bg-white dark:bg-black border border-black/20 dark:border-white/20 flex flex-col items-center justify-center transform transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1">
                        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                          {item.value.toString().padStart(2, '0')}
                        </span>
                        <span className="text-base text-muted-foreground font-medium mt-2">
                          {item.label}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Core Features Section */}
              <motion.div 
                className="w-full max-w-4xl mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                  Core Features
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: <Brain className="h-6 w-6" />,
                      title: "AI Project Generation",
                      description: "Get personalized project ideas based on your tech stack, skill level, and interests."
                    },
                    {
                      icon: <Users className="h-6 w-6" />,
                      title: "Team Collaboration",
                      description: "Find the perfect collaborators with complementary skills for your projects."
                    },
                    {
                      icon: <Zap className="h-6 w-6" />,
                      title: "Growth & Learning",
                      description: "Build your portfolio with meaningful projects while mastering new technologies."
                    }
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="group relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    >
                      {/* Background shadow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg transform rotate-3 transition-transform duration-300 group-hover:rotate-2" />
                      
                      {/* Shadow element */}
                      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                      
                      {/* Feature card */}
                      <div className="relative flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-black border border-black/20 dark:border-white/20 h-full transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                          {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Theme Toggle */}
              <motion.div
                className="fixed top-6 right-6 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <ThemeToggle />
              </motion.div>

              {/* Timeline */}
              <motion.div
                className="w-full max-w-2xl mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <h2 className="text-xl font-semibold mb-6 text-center">Launch Timeline</h2>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-blue-600/50 via-blue-400/30 to-transparent transform -translate-x-1/2"></div>
                  
                  {/* Timeline items */}
                  {[
                    { date: "February 2025", label: "Beta Testing" },
                    { date: "March 22, 2025", label: "Launch Announcement" },
                    { date: "March 28, 2025", label: "Official Launch" },
                    { date: "April 2025", label: "New Features Rollout" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="relative flex items-center mb-8"
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    >
                      <div className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} w-full items-center`}>
                        <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                          <h3 className="text-sm font-medium">{item.label}</h3>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                        
                        <div className="z-10 h-6 w-6 rounded-full bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white dark:bg-black"></div>
                        </div>
                        
                        <div className="w-1/2"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Projectrix. All rights reserved.
                </p>
              </motion.div>
            </div>

            {/* Animated elements */}
            <AnimatedElements />
          </main>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

const AnimatedElements = () => {
  return (
    <>
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute hidden md:block"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: Math.random() * 60 + 20,
            height: Math.random() * 60 + 20,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0) 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.2, 0.4],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Tech floating elements */}
      {[...Array(4)].map((_, index) => (
        <motion.div
          key={`tech-${index}`}
          className="absolute hidden md:block"
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${15 + Math.random() * 70}%`,
            width: 60,
            height: 60,
            opacity: 0.1,
            fontSize: "2rem",
            color: "#3b82f6",
            transform: "rotate(10deg)"
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [10, -5, 10],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: index * 2
          }}
        >
          {/* Technology-related symbols */}
          {["{}", "</>", "#", "()=>"][index]}
        </motion.div>
      ))}
    </>
  )
}