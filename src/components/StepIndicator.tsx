import React from 'react';
import { CheckIcon } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
}
const StepIndicator = ({ 
  currentStep, 
  totalSteps = 2, 
  labels = ["Basic Info", "Additional Info"] 
}: StepIndicatorProps) => {
  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-1/2 w-full h-1 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full" />
        
        {/* Progress bar */}
        <div 
          className="absolute top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-500 dark:to-indigo-400 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
        
        {/* Step circles */}
        <div className="relative flex justify-between">
          {labels.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep >= stepNumber;
            const isCompleted = currentStep > stepNumber;
            
            return (
              <div key={label} className="flex flex-col items-center">
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    shadow-md transition-all duration-300 border-2
                    ${isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-transparent scale-110' 
                      : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600'}
                  `}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5 text-white animate-fadeIn" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                
                <div className="mt-3 text-center">
                  <span 
                    className={`
                      text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                        : 'text-gray-500 dark:text-gray-400'}
                    `}
                  >
                    {label}
                  </span>
                </div>
                
                {/* Only show description if active step */}
                {isActive && currentStep === stepNumber && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 max-w-32 text-center mt-1 animate-fadeIn">
                    {currentStep === 1 ? "Enter your basic information" : "Complete your profile"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;