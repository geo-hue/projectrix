import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const technologies = [
  // Row 1 - Frontend
  { name: 'React', icon: 'logos:react' },
  { name: 'Next.js', icon: 'logos:nextjs-icon' },
  { name: 'Vue', icon: 'logos:vue' },
  { name: 'Angular', icon: 'logos:angular-icon' },
  { name: 'Svelte', icon: 'logos:svelte-icon' },
  { name: 'HTML5', icon: 'logos:html-5' },
  { name: 'CSS3', icon: 'logos:css-3' },
  { name: 'JavaScript', icon: 'logos:javascript' },
  { name: 'TypeScript', icon: 'logos:typescript-icon' },
  { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon' },
  { name: 'Bootstrap', icon: 'logos:bootstrap' },
  { name: 'Material UI', icon: 'logos:material-ui' },
  { name: 'Webpack', icon: 'logos:webpack' },
  { name: 'Vite', icon: 'logos:vitejs' },
  { name: 'Redux', icon: 'logos:redux' },

  // Row 2 - Backend & Databases
  { name: 'Node.js', icon: 'logos:nodejs-icon' },
  { name: 'Python', icon: 'logos:python' },
  { name: 'Django', icon: 'logos:django-icon' },
  { name: 'Flask', icon: 'logos:flask' },
  { name: 'Express', icon: 'logos:express' },
  { name: 'Java', icon: 'logos:java' },
  { name: 'Spring Boot', icon: 'logos:spring-icon' },
  { name: 'PHP', icon: 'logos:php' },
  { name: 'Laravel', icon: 'logos:laravel' },
  { name: 'Ruby', icon: 'logos:ruby' },
  { name: 'MongoDB', icon: 'logos:mongodb-icon' },
  { name: 'PostgreSQL', icon: 'logos:postgresql' },
  { name: 'MySQL', icon: 'logos:mysql-icon' },
  { name: 'Redis', icon: 'logos:redis' },
  { name: 'GraphQL', icon: 'logos:graphql' },

  // Row 3 - DevOps & Cloud
  { name: 'Docker', icon: 'logos:docker-icon' },
  { name: 'Kubernetes', icon: 'logos:kubernetes' },
  { name: 'AWS', icon: 'logos:aws' },
  { name: 'Google Cloud', icon: 'logos:google-cloud' },
  { name: 'Azure', icon: 'logos:microsoft-azure' },
  { name: 'Git', icon: 'logos:git-icon' },
  { name: 'GitHub', icon: 'logos:github-icon' },
  { name: 'GitLab', icon: 'logos:gitlab' },
  { name: 'Jenkins', icon: 'logos:jenkins' },
  { name: 'Rust', icon: 'logos:rust' },
  { name: 'Go', icon: 'logos:go' },
  { name: 'Sass', icon: 'logos:sass' },
  { name: 'Firebase', icon: 'logos:firebase' },
  { name: 'Vercel', icon: 'logos:vercel-icon' },
  { name: 'Netlify', icon: 'logos:netlify' }
];

const TechCard = ({ tech }: { tech: { name: string; icon: string } }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      {/* Shadow element */}
      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-xl transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
      
      {/* Main card */}
      <div className="relative flex flex-col items-center justify-center w-28 h-32 rounded-xl bg-white dark:bg-black border border-black/20 dark:border-white/20 p-4 transition-all duration-300">
        {/* Icon */}
        <div className="h-12 w-12 mb-3 flex items-center justify-center relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-900/20 dark:from-blue-400/20 dark:to-blue-700/20 blur-xl rounded-full" />
          <Icon icon={tech.icon} className="w-full h-full relative z-10" />
        </div>
        
        {/* Name */}
        <span className="text-xs text-center font-medium">{tech.name}</span>
      </div>
    </motion.div>
  );
};

const TechScroll = () => {
  return (
    <div className="relative w-full overflow-hidden p-2">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="flex flex-col gap-16">
        {/* First Row */}
        <div className="flex animate-scroll-left">
          <div className="flex gap-8 items-center [&>*]:flex-shrink-0">
            {[...technologies.slice(0, 15), ...technologies.slice(0, 15)].map((tech, index) => (
              <TechCard key={`row1-${index}`} tech={tech} />
            ))}
          </div>
        </div>

        {/* Second Row */}
        <div className="flex animate-scroll-right">
          <div className="flex gap-8 items-center [&>*]:flex-shrink-0">
            {[...technologies.slice(15, 30), ...technologies.slice(15, 30)].map((tech, index) => (
              <TechCard key={`row2-${index}`} tech={tech} />
            ))}
          </div>
        </div>

        {/* Third Row */}
        <div className="flex animate-scroll-left">
          <div className="flex gap-8 items-center [&>*]:flex-shrink-0">
            {[...technologies.slice(30), ...technologies.slice(30)].map((tech, index) => (
              <TechCard key={`row3-${index}`} tech={tech} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechScroll;