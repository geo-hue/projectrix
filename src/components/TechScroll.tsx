'use client';

import { Icon } from '@iconify/react';

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

  // Row 3 - DevOps, Cloud & Tools
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

const TechScroll = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col gap-8">
        {/* First Row */}
        <div className="flex animate-scroll-left">
          <div className="flex gap-8 items-center [&>*]:flex-shrink-0">
            {technologies.slice(0, 15).map((tech, index) => (
              <div
                key={`row1-${index}`}
                className="flex flex-col items-center justify-center w-24 h-24 rounded-lg bg-card border border-border/40 p-4 hover:scale-105 transition-transform"
              >
                <div className="h-10 w-10 mb-2 flex items-center justify-center">
                  <Icon icon={tech.icon} className="w-full h-full" />
                </div>
                <span className="text-xs text-center font-medium">{tech.name}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {technologies.slice(0, 15).map((tech, index) => (
              <div
                key={`row1-dup-${index}`}
                className="flex flex-col items-center justify-center w-24 h-24 rounded-lg bg-card border border-border/40 p-4 hover:scale-105 transition-transform"
              >
                <div className="h-10 w-10 mb-2 flex items-center justify-center">
                  <Icon icon={tech.icon} className="w-full h-full" />
                </div>
                <span className="text-xs text-center font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row (Reverse Direction) */}
        <div className="flex animate-scroll-right">
          <div className="flex gap-8 items-center [&>*]:flex-shrink-0">
            {technologies.slice(15, 30).map((tech, index) => (
              <div
                key={`row2-${index}`}
                className="flex flex-col items-center justify-center w-24 h-24 rounded-lg bg-card border border-border/40 p-4 hover:scale-105 transition-transform"
              >
                <div className="h-10 w-10 mb-2 flex items-center justify-center">
                  <Icon icon={tech.icon} className="w-full h-full" />
                </div>
                <span className="text-xs text-center font-medium">{tech.name}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {technologies.slice(15, 30).map((tech, index) => (
              <div
                key={`row2-dup-${index}`}
                className="flex flex-col items-center justify-center w-24 h-24 rounded-lg bg-card border border-border/40 p-4 hover:scale-105 transition-transform"
              >
                <div className="h-10 w-10 mb-2 flex items-center justify-center">
                  <Icon icon={tech.icon} className="w-full h-full" />
                </div>
                <span className="text-xs text-center font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Third Row */}
        <div className="flex animate-scroll-left">
          <div className="flex gap-8 items-center [&>*]:flex-shrink-0">
            {technologies.slice(30).map((tech, index) => (
              <div
                key={`row3-${index}`}
                className="flex flex-col items-center justify-center w-24 h-24 rounded-lg bg-card border border-border/40 p-4 hover:scale-105 transition-transform"
              >
                <div className="h-10 w-10 mb-2 flex items-center justify-center">
                  <Icon icon={tech.icon} className="w-full h-full" />
                </div>
                <span className="text-xs text-center font-medium">{tech.name}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {technologies.slice(30).map((tech, index) => (
              <div
                key={`row3-dup-${index}`}
                className="flex flex-col items-center justify-center w-24 h-24 rounded-lg bg-card border border-border/40 p-4 hover:scale-105 transition-transform"
              >
                <div className="h-10 w-10 mb-2 flex items-center justify-center">
                  <Icon icon={tech.icon} className="w-full h-full" />
                </div>
                <span className="text-xs text-center font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechScroll;