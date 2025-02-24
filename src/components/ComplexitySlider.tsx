import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface ComplexitySliderProps {
  onChange?: (value: number) => void;
  defaultValue?: number;
}

export function ComplexitySlider({ onChange, defaultValue = 50 }: ComplexitySliderProps) {
  const [value, setValue] = useState(defaultValue);

  const getComplexityLabel = (value: number) => {
    if (value <= 33) return "Beginner";
    if (value <= 66) return "Intermediate";
    return "Advanced";
  };

  const getComplexityColor = (value: number) => {
    if (value <= 33) return "from-emerald-500 to-emerald-700";
    if (value <= 66) return "from-blue-500 to-blue-700";
    return "from-purple-500 to-purple-700";
  };

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue[0]);
    onChange?.(newValue[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header with value display */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Complexity Level</span>
        <div className="flex items-center gap-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium text-white
            bg-gradient-to-r ${getComplexityColor(value)}
          `}>
            {getComplexityLabel(value)}
          </span>
          <span className="text-sm text-muted-foreground">
            ({value}%)
          </span>
        </div>
      </div>

      {/* Main slider container */}
      <div className="relative pt-1 pb-4">
        {/* Background track */}
        <div className="absolute h-2 w-full rounded-full bg-gradient-to-r from-emerald-100 via-blue-100 to-purple-100 dark:from-emerald-950 dark:via-blue-950 dark:to-purple-950" />
        
        {/* Progress track */}
        <div 
          className={`
            absolute h-2 rounded-full
            bg-gradient-to-r ${getComplexityColor(value)}
          `}
          style={{ 
            width: `${value}%`,
            transition: 'width 0.2s ease, background-color 0.3s ease'
          }}
        />

        {/* Slider component */}
        <Slider
          value={[value]}
          onValueChange={handleValueChange}
          max={100}
          step={1}
          className="relative z-10"
        />

        {/* Level markers */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex flex-col items-center">
            <div className="w-px h-2 bg-muted-foreground/30" />
            <span className="mt-1">Beginner</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-px h-2 bg-muted-foreground/30" />
            <span className="mt-1">Intermediate</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-px h-2 bg-muted-foreground/30" />
            <span className="mt-1">Advanced</span>
          </div>
        </div>
      </div>

      {/* Experience level description */}
      <div className="text-sm text-muted-foreground">
        {value <= 33 && (
          "Perfect for those starting their coding journey. Focus on fundamentals and basic concepts."
        )}
        {value > 33 && value <= 66 && (
          "Suitable for developers with some experience. Introduces more complex patterns and technologies."
        )}
        {value > 66 && (
          "Challenging projects for experienced developers. Involves advanced concepts and architectural decisions."
        )}
      </div>
    </div>
  );
}