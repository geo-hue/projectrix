// TechSelect.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X } from 'lucide-react';

interface TechSelectProps {
  onSelect?: (techs: string[]) => void;
  defaultValue?: string[];
}

const technologies = [
  { label: "React", value: "react" },
  { label: "Next.js", value: "nextjs" },
  { label: "TypeScript", value: "typescript" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Django", value: "django" },
  { label: "PostgreSQL", value: "postgresql" },
  { label: "MongoDB", value: "mongodb" },
  // Add more technologies
];

export function TechSelect({ onSelect, defaultValue = [] }: TechSelectProps) {
  const [selectedTechs, setSelectedTechs] = useState<string[]>(defaultValue);
  const [techSearchOpen, setTechSearchOpen] = useState(false);

  const handleTechSelect = (techs: string[]) => {
    setSelectedTechs(techs);
    onSelect?.(techs);
  };

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
            Select technologies...
            <span className="ml-2 h-4 w-4 shrink-0 opacity-50">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-background border shadow-lg">
          <div className="p-2 space-y-2">
            {technologies.map((tech) => (
              <div
                key={tech.value}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer
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
                {tech.label}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Selected Technologies */}
      <div className="flex flex-wrap gap-2">
        {selectedTechs.map(tech => (
          <Badge 
            key={tech}
            variant="secondary"
            className="flex items-center gap-1 pr-1 hover:bg-destructive/10 transition-colors"
          >
            {technologies.find(t => t.value === tech)?.label}
            <button
              onClick={() => handleTechSelect(
                selectedTechs.filter(item => item !== tech)
              )}
              className="ml-1 hover:bg-background/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}