import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Search } from 'lucide-react';

interface TechSelectProps {
  onSelect?: (techs: string[]) => void;
  defaultValue?: string[];
}

// Organized technologies by category
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

export function TechSelect({ onSelect, defaultValue = [] }: TechSelectProps) {
  const [selectedTechs, setSelectedTechs] = useState<string[]>(defaultValue);
  const [techSearchOpen, setTechSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTechSelect = (techs: string[]) => {
    setSelectedTechs(techs);
    onSelect?.(techs);
  };

  // Filter technologies based on search query
  const filteredTechnologies = searchQuery
    ? Object.entries(technologies).reduce((acc, [category, techs]) => {
        const filtered = techs.filter(tech =>
          tech.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
          acc[category] = filtered;
        }
        return acc;
      }, {} as typeof technologies)
    : technologies;

  return (
    <div className="space-y-2">
      <Popover open={techSearchOpen} onOpenChange={setTechSearchOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={techSearchOpen}
            className="w-full justify-between"
          >
            {selectedTechs.length > 0 
              ? `${selectedTechs.length} technologies selected`
              : "Select technologies..."}
            <span className="ml-2 h-4 w-4 shrink-0 opacity-50">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-screen max-w-2xl p-0 bg-popover border shadow-lg"
          style={{
            backgroundColor: 'var(--popover)',
          }}
        >
          {/* Search bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search technologies..."
                className="w-full pl-10 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Technologies grid */}
          <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
            <div className="p-4 grid grid-cols-3 gap-4">
              {Object.entries(filteredTechnologies).map(([category, techs]) => (
                <div key={category} className="space-y-2">
                  <h3 className="font-semibold text-sm text-foreground bg-popover py-1">
                    {category}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({techs.length})
                    </span>
                  </h3>
                  <div className="space-y-1">
                    {techs.map((tech) => (
                      <div
                        key={tech.value}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer
                          transition-colors duration-150
                          ${selectedTechs.includes(tech.value)
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted/50'}
                        `}
                        onClick={() => {
                          handleTechSelect(
                            selectedTechs.includes(tech.value)
                              ? selectedTechs.filter(item => item !== tech.value)
                              : [...selectedTechs, tech.value]
                          );
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTechs.includes(tech.value)}
                          onChange={() => {}}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{tech.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected count footer */}
          <div className="p-4 border-t bg-muted/50">
            <p className="text-sm text-muted-foreground">
              {selectedTechs.length} technologies selected
            </p>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Selected Technologies */}
      <div className="flex flex-wrap gap-2">
        {selectedTechs.map(tech => {
          const techItem = Object.values(technologies)
            .flat()
            .find(t => t.value === tech);
            
          return (
            <Badge 
              key={tech}
              variant="secondary"
              className="flex items-center gap-1 pr-1 hover:bg-destructive/10 transition-colors"
            >
              {techItem?.label}
              <button
                onClick={() => handleTechSelect(
                  selectedTechs.filter(item => item !== tech)
                )}
                className="ml-1 hover:bg-background/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}