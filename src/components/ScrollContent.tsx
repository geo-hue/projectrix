'use client';

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface ScrollContextType {
  heroRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  isHeroFixed: boolean;
  isMobile: boolean;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHeroFixed, setIsHeroFixed] = useState(true);
  const lastScrollPosition = useRef(0);


  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
  
      const featureSlider = heroRef.current.querySelector('.feature-slider');
      if (!featureSlider) return;
  
      const featureRect = featureSlider.getBoundingClientRect();
  
      // Only trigger the overlay effect (fixed hero) when the feature slider is completely out of view.
      if (featureRect.bottom <= 0) {
        setIsHeroFixed(true);
      } else {
        setIsHeroFixed(false);
      }
    };
  
    handleScroll(); // Check initial position
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  return (
    <ScrollContext.Provider value={{ heroRef, contentRef, isHeroFixed }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
}

export default ScrollContext;