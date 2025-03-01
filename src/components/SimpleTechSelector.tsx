import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { X, Search } from 'lucide-react';

interface SimpleTechSelectorProps {
  onSelect?: (techs: string[]) => void;
  defaultValue?: string[];
}

// Same technologies as the original component
const technologies = {
  "Frontend": [
    { label: "React", value: "react" },
    { label: "Next.js", value: "nextjs" },
    { label: "Vue", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
    { label: "HTML5", value: "html5" },
    { label: "CSS3", value: "css3" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Tailwind CSS", value: "tailwindcss" },
    { label: "Bootstrap", value: "bootstrap" },
    { label: "Material UI", value: "materialui" },
    { label: "Redux", value: "redux" },
    { label: "Webpack", value: "webpack" },
    { label: "Vite", value: "vite" }
  ],
  "Backend": [
    { label: "Node.js", value: "nodejs" },
    { label: "Python", value: "python" },
    { label: "Django", value: "django" },
    { label: "Flask", value: "flask" },
    { label: "Express", value: "express" },
    { label: "Java", value: "java" },
    { label: "Spring Boot", value: "springboot" },
    { label: "PHP", value: "php" },
    { label: "Laravel", value: "laravel" },
    { label: "Ruby", value: "ruby" },
    { label: "GraphQL", value: "graphql" }
  ],
  "Databases": [
    { label: "MongoDB", value: "mongodb" },
    { label: "PostgreSQL", value: "postgresql" },
    { label: "MySQL", value: "mysql" },
    { label: "Redis", value: "redis" },
    { label: "Firebase", value: "firebase" }
  ],
  "DevOps & Cloud": [
    { label: "Docker", value: "docker" },
    { label: "Kubernetes", value: "kubernetes" },
    { label: "AWS", value: "aws" },
    { label: "Google Cloud", value: "gcloud" },
    { label: "Azure", value: "azure" },
    { label: "Git", value: "git" },
    { label: "GitHub", value: "github" },
    { label: "GitLab", value: "gitlab" },
    { label: "Jenkins", value: "jenkins" },
    { label: "Vercel", value: "vercel" },
    { label: "Netlify", value: "netlify" }
  ],
  "Programming Languages": [
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" },
    { label: "C#", value: "csharp" },
    { label: "Rust", value: "rust" },
    { label: "Go", value: "go" },
    { label: "Ruby", value: "ruby" },
    { label: "PHP", value: "php" },
    { label: "Swift", value: "swift" },
    { label: "Kotlin", value: "kotlin" }
  ]
};

export function SimpleTechSelector({ onSelect, defaultValue = [] }: SimpleTechSelectorProps) {
  const [selectedTechs, setSelectedTechs] = useState<string[]>(defaultValue);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleTechSelect = (value: string) => {
    const newSelectedTechs = selectedTechs.includes(value)
      ? selectedTechs.filter(tech => tech !== value)
      : [...selectedTechs, value];
    
    setSelectedTechs(newSelectedTechs);
    onSelect?.(newSelectedTechs);
  };
  
  // Filter technologies based on search query and active category
  const filteredTechnologies = Object.entries(technologies).reduce((acc, [category, techs]) => {
    // Skip if not "All" and not the active category
    if (activeCategory !== 'All' && activeCategory !== category) {
      return acc;
    }
    
    const filtered = techs.filter(tech =>
      tech.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    
    return acc;
  }, {} as typeof technologies);

  // Get all categories plus "All" option
  const categories = ['All', ...Object.keys(technologies)];

  const handleClick = (e) => {
    // Prevent events from bubbling up to parent form
    e.stopPropagation();
  };

  return (
    <div className="border rounded-md bg-white dark:bg-black border-black/20 dark:border-white/20 p-4 space-y-4 w-full max-w-full overflow-hidden"
    onClick={handleClick}
    >
      {/* Selected Technologies */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedTechs.length > 0 ? (
          selectedTechs.map(tech => {
            const techItem = Object.values(technologies)
              .flat()
              .find(t => t.value === tech);
              
            return (
              <Badge 
                key={tech}
                variant="secondary"
                className="flex items-center gap-1 pr-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                {techItem?.label}
                <button
                  onClick={() => handleTechSelect(tech)}
                  className="ml-1 hover:bg-black/20 dark:hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No technologies selected</p>
        )}
      </div>
      
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search technologies..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map(category => (
          <button
            key={category}
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveCategory(category);
            }}
            className={`px-3 py-1 text-sm rounded-md whitespace-nowrap
              ${activeCategory === category 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`}
          >
            {category}
          </button>
        ))}
      </div>
      
   {/* Tech options grid */}
   <div className="max-h-40 overflow-y-auto pr-1">
        {Object.entries(filteredTechnologies).map(([category, techs]) => (
          <div key={category} className="mb-4">
            <h3 className="font-semibold text-sm mb-2">{category}</h3>
            <div className="grid grid-cols-2 gap-1">
              {techs.map((tech) => (
                <div
                  key={tech.value}
                  onClick={() => handleTechSelect(tech.value)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm
                    transition-colors duration-150
                    ${selectedTechs.includes(tech.value)
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTechs.includes(tech.value)}
                    onChange={() => {}}
                    className="h-4 w-4"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>{tech.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground">
        {selectedTechs.length} technologies selected
      </div>
    </div>
  );
}