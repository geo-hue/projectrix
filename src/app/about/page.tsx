'use client';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, Code2, Users, Github, ArrowRight, Linkedin, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TechBackground from "@/components/TechBackground";
import PageTransition from "@/components/PageTransition";
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';


const AboutPage = () => {
  const router = useRouter();
  const { user, login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <PageTransition>
    <main className="min-h-screen bg-background relative">
        <TechBackground/>
      <Header />
      
      {/* Hero Section */}
      <section className="relative flex items-center">
      <div className="container px-4 mx-auto mt-28 md:mt-28 ">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron">
              <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                Your Gateway to
              </span>
              <br />
              <span className="relative">
                Collaborative Development
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/50"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Projectrix connects developers with meaningful projects and collaborators, making it easier than ever to build your portfolio while working with others.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>


      {/* Story Section */}
      <section className="py-8 md:py-10 bg-muted/50 relative overflow-hidden">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex justify-center"
              >
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 pb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                The Story Behind Projectrix
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg transform rotate-3" />
                <div className="relative p-8 rounded-lg bg-white dark:bg-black border border-black/20 dark:border-white/20">
                  <h3 className="text-2xl font-bold mb-4">The Challenge</h3>
                  <p className="text-lg text-muted-foreground">
                    Many developers have the skills and motivation to build great projects, but struggle to find meaningful ideas and reliable collaborators.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-lg transform -rotate-3" />
                <div className="relative p-8 rounded-lg bg-white dark:bg-black border border-black/20 dark:border-white/20">
                  <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
                  <p className="text-lg text-muted-foreground">
                    We combined AI-powered project generation with a collaborative community, helping developers at all levels find the perfect project and team to work with.
                  </p>
                </div>
              </motion.div>
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
            
            <div className="relative max-w-2xl mx-auto">
              {/* Background shadow  */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg transform rotate-3" />              
              {/* Content */}
              <div className="relative p-8 rounded-lg bg-white dark:bg-black border border-black/20 dark:border-white/20">
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
                        href="https://github.com/georgedevs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/ukoh-godwin-george/"
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
              {user ? 'Ready to Start Building?' : 'Join Our Community Today'}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {user 
                ? 'Generate project ideas and connect with developers to create something amazing.'
                : 'Join our community of developers and start creating amazing projects together.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                    View Project Ideas <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                    onClick={handleLogin}
                  >
                    <Github className="h-4 w-4" /> Login with GitHub
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                    onClick={() => router.push('/')}
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
    </PageTransition>
  );
};

export default AboutPage;