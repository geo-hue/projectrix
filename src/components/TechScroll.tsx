import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const technologies = [
  // Row 1 - Frontend
  { name: 'React', icon: 'logos:react', category: 'frontend' },
  { name: 'Next.js', icon: 'logos:nextjs-icon', category: 'frontend' },
  { name: 'Vue', icon: 'logos:vue', category: 'frontend' },
  { name: 'Angular', icon: 'logos:angular-icon', category: 'frontend' },
  { name: 'Svelte', icon: 'logos:svelte-icon', category: 'frontend' },
  { name: 'HTML5', icon: 'logos:html-5', category: 'frontend' },
  { name: 'CSS3', icon: 'logos:css-3', category: 'frontend' },
  { name: 'JavaScript', icon: 'logos:javascript', category: 'frontend' },
  { name: 'TypeScript', icon: 'logos:typescript-icon', category: 'frontend' },
  { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon', category: 'frontend' },
  { name: 'Bootstrap', icon: 'logos:bootstrap', category: 'frontend' },
  { name: 'Material UI', icon: 'logos:material-ui', category: 'frontend' },
  { name: 'Webpack', icon: 'logos:webpack', category: 'frontend' },
  { name: 'Vite', icon: 'logos:vitejs', category: 'frontend' },
  { name: 'Redux', icon: 'logos:redux', category: 'frontend' },

  // Row 2 - Backend & Databases
  { name: 'Node.js', icon: 'logos:nodejs-icon', category: 'backend' },
  { name: 'Python', icon: 'logos:python', category: 'backend' },
  { name: 'Django', icon: 'logos:django-icon', category: 'backend' },
  { name: 'Flask', icon: 'logos:flask', category: 'backend' },
  { name: 'Express', icon: 'logos:express', category: 'backend' },
  { name: 'Java', icon: 'logos:java', category: 'backend' },
  { name: 'Spring Boot', icon: 'logos:spring-icon', category: 'backend' },
  { name: 'PHP', icon: 'logos:php', category: 'backend' },
  { name: 'Laravel', icon: 'logos:laravel', category: 'backend' },
  { name: 'Ruby', icon: 'logos:ruby', category: 'backend' },
  { name: 'MongoDB', icon: 'logos:mongodb-icon', category: 'database' },
  { name: 'PostgreSQL', icon: 'logos:postgresql', category: 'database' },
  { name: 'MySQL', icon: 'logos:mysql-icon', category: 'database' },
  { name: 'Redis', icon: 'logos:redis', category: 'database' },
  { name: 'GraphQL', icon: 'logos:graphql', category: 'backend' },

  // Row 3 - DevOps & Cloud
  { name: 'Docker', icon: 'logos:docker-icon', category: 'devops' },
  { name: 'Kubernetes', icon: 'logos:kubernetes', category: 'devops' },
  { name: 'AWS', icon: 'logos:aws', category: 'cloud' },
  { name: 'Google Cloud', icon: 'logos:google-cloud', category: 'cloud' },
  { name: 'Azure', icon: 'logos:microsoft-azure', category: 'cloud' },
  { name: 'Git', icon: 'logos:git-icon', category: 'devops' },
  { name: 'GitHub', icon: 'logos:github-icon', category: 'devops' },
  { name: 'GitLab', icon: 'logos:gitlab', category: 'devops' },
  { name: 'Jenkins', icon: 'logos:jenkins', category: 'devops' },
  { name: 'Rust', icon: 'logos:rust', category: 'backend' },
  { name: 'Go', icon: 'logos:go', category: 'backend' },
  { name: 'Sass', icon: 'logos:sass', category: 'frontend' },
  { name: 'Firebase', icon: 'logos:firebase', category: 'cloud' },
  { name: 'Vercel', icon: 'logos:vercel-icon', category: 'cloud' },
  { name: 'Netlify', icon: 'logos:netlify', category: 'cloud' }
];

// Define categories with colors
const categories = [
  { id: 'all', name: 'All Technologies', color: 'bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-700' },
  { id: 'frontend', name: 'Frontend', color: 'bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400' },
  { id: 'backend', name: 'Backend', color: 'bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400' },
  { id: 'database', name: 'Databases', color: 'bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400' },
  { id: 'devops', name: 'DevOps', color: 'bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400' },
  { id: 'cloud', name: 'Cloud', color: 'bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400' },
];

interface TechCardProps {
  tech: {
    name: string;
    icon: string;
    category: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  getCategoryColor: (category: string) => string;
  index: number;
  isSearchResult?: boolean;
}

const TechCard: React.FC<TechCardProps> = ({ 
  tech, 
  isSelected, 
  onSelect, 
  getCategoryColor,
  index,
  isSearchResult = false
}) => {
  const controls = useAnimation();
  
  useEffect(() => {
    if (isSearchResult) {
      controls.start({
        scale: [0, 1.1, 1],
        opacity: [0, 1],
        transition: { duration: 0.5, delay: index * 0.05 }
      });
    }
  }, [isSearchResult, controls, index]);
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      animate={isSearchResult ? controls : undefined}
      initial={isSearchResult ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
      className="relative group"
      onClick={onSelect}
    >
      {/* Shadow element */}
      <div 
        className={`absolute inset-0 ${getCategoryColor(tech.category).replace('from-', 'from-').replace('to-', 'to-')}/20 translate-x-1 translate-y-1 rounded-xl transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2`} 
      />
      
      {/* Main card */}
      <div 
        className={`relative flex flex-col items-center justify-center w-28 h-32 rounded-xl ${isSelected ? 'ring-2 ring-offset-2 dark:ring-offset-black' : 'border border-black/20 dark:border-white/20'} ${isSelected ? getCategoryColor(tech.category).replace('from-', 'ring-').split(' ')[0] : 'bg-white dark:bg-black'} p-4 transition-all duration-300`}
      >
        {/* Animated dots in background */}
        {isSelected && (
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 ${getCategoryColor(tech.category).replace('from-', 'bg-').split(' ')[0]}/30 rounded-full`}
                animate={{
                  x: [Math.random() * 100, Math.random() * 100 + 50],
                  y: [Math.random() * 100, Math.random() * 100 + 50],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.5,
                }}
                style={{
                  left: `${Math.random() * 80}%`,
                  top: `${Math.random() * 80}%`,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Icon */}
        <div className="h-12 w-12 mb-3 flex items-center justify-center relative">
          {/* Glow effect */}
          <div className={`absolute inset-0 ${getCategoryColor(tech.category)} opacity-20 blur-xl rounded-full`} />
          <Icon icon={tech.icon} className={`w-full h-full relative z-10 ${isSelected ? 'text-white' : ''}`} />
        </div>
        
        {/* Name */}
        <span className={`text-xs text-center font-medium ${isSelected ? 'text-white' : ''}`}>{tech.name}</span>
      </div>
    </motion.div>
  );
};

const TechScroll: React.FC = () => {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof technologies>([]);
  const [isSearching, setIsSearching] = useState(false);

  const getCategoryColor = (category: string) => {
    const foundCategory = categories.find(cat => cat.id === category);
    return foundCategory ? foundCategory.color : categories[0].color;
  };

  const handleTechSelect = (techName: string) => {
    setSelectedTechs(prev => {
      if (prev.includes(techName)) {
        return prev.filter(name => name !== techName);
      } else {
        return [...prev, techName];
      }
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.length > 0) {
      setIsSearching(true);
      const results = technologies.filter(tech => 
        tech.name.toLowerCase().includes(query) || 
        tech.category.toLowerCase().includes(query)
      );
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const filterTechnologies = (techs: typeof technologies) => {
    if (activeCategory === 'all') return techs;
    return techs.filter(tech => tech.category === activeCategory);
  };

  // Filter technologies based on category
  const filteredTechnologies = filterTechnologies(technologies);
  
  // Create row separation based on category for better organization
  const frontendTechs = filteredTechnologies.filter(tech => tech.category === 'frontend');
  const backendTechs = filteredTechnologies.filter(tech => tech.category === 'backend');
  const restTechs = filteredTechnologies.filter(tech => tech.category !== 'frontend' && tech.category !== 'backend');

  return (
    <div className="relative w-full">
      {/* Search and filter controls */}
      <div className="mb-10 flex flex-col md:flex-row gap-6 items-center">
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`relative overflow-hidden transition-all duration-300 ${
                activeCategory === category.id 
                  ? `${category.color} text-white border-none` 
                  : 'border-black/20 dark:border-white/20'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {activeCategory === category.id && (
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
                      "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              )}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full max-w-xs">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search technologies..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-10 py-2 rounded-full border border-black/20 dark:border-white/20 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Selected technologies summary (appears when techs are selected) */}
      <AnimatePresence>
        {selectedTechs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 border border-blue-600/20 dark:border-blue-400/20 rounded-xl p-4 bg-blue-50/50 dark:bg-blue-900/10"
          >
            <h3 className="text-sm font-medium mb-2 text-blue-900 dark:text-blue-400">Selected Technologies ({selectedTechs.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTechs.map(tech => {
                const techObj = technologies.find(t => t.name === tech)!;
                return (
                  <div 
                    key={tech} 
                    className={`${getCategoryColor(techObj.category)} text-white text-xs py-1 px-3 rounded-full flex items-center gap-1`}
                  >
                    <Icon icon={techObj.icon} className="w-3 h-3" />
                    {tech}
                    <button
                      onClick={() => handleTechSelect(tech)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              {selectedTechs.length > 0 && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedTechs([])}
                >
                  Clear all
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search results display */}
      {isSearching ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-10"
        >
          <h3 className="text-lg font-medium mb-6">
            {searchResults.length > 0 
              ? `Found ${searchResults.length} technologies matching "${searchQuery}"`
              : `No technologies found matching "${searchQuery}"`
            }
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
            {searchResults.map((tech, index) => (
              <TechCard
                key={tech.name}
                tech={tech}
                isSelected={selectedTechs.includes(tech.name)}
                onSelect={() => handleTechSelect(tech.name)}
                getCategoryColor={getCategoryColor}
                index={index}
                isSearchResult={true}
              />
            ))}
          </div>
        </motion.div>
      ) : (
        // Tech scroll with staggered rows
        <div className="relative w-full overflow-hidden">
          {/* Gradient overlays for scroll effect */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10" />
          
          <div className="flex flex-col gap-16">
            {/* First Row - Frontend */}
            <div className="flex animate-scroll-left">
              <div className="flex gap-8 items-center [&>*]:flex-shrink-0">
                {[...frontendTechs, ...frontendTechs].map((tech, index) => (
                  <TechCard 
                    key={`row1-${index}`} 
                    tech={tech} 
                    isSelected={selectedTechs.includes(tech.name)}
                    onSelect={() => handleTechSelect(tech.name)}
                    getCategoryColor={getCategoryColor}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Second Row - Backend */}
            <div className="flex animate-scroll-right">
              <div className="flex gap-8 items-center [&>*]:flex-shrink-0">
                {[...backendTechs, ...backendTechs].map((tech, index) => (
                  <TechCard 
                    key={`row2-${index}`} 
                    tech={tech} 
                    isSelected={selectedTechs.includes(tech.name)}
                    onSelect={() => handleTechSelect(tech.name)}
                    getCategoryColor={getCategoryColor}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Third Row - Other (DevOps, Cloud, DB) */}
            <div className="flex animate-scroll-left">
              <div className="flex gap-8 items-center [&>*]:flex-shrink-0">
                {[...restTechs, ...restTechs].map((tech, index) => (
                  <TechCard 
                    key={`row3-${index}`} 
                    tech={tech} 
                    isSelected={selectedTechs.includes(tech.name)}
                    onSelect={() => handleTechSelect(tech.name)}
                    getCategoryColor={getCategoryColor}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to action button */}
      {selectedTechs.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Button
            size="lg"
            className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
            onClick={() => {
              // Handle navigation or form submission
              console.log('Selected technologies:', selectedTechs);
            }}
          >
            Generate Ideas with Selected Technologies
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default TechScroll;