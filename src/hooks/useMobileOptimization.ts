import { useState, useEffect } from "react";

export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Return optimized animation props - now instant for ALL devices to prevent lazy loading
  const getAnimationProps = (desktopProps: any) => {
    // Show content immediately without animations on all devices
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      transition: { duration: 0 },
    };
  };

  // Return optimized viewport props
  const getViewportProps = () => {
    // Trigger immediately on all devices
    return { once: true, amount: 0 };
  };

  return {
    isMobile,
    getAnimationProps,
    getViewportProps,
  };
}