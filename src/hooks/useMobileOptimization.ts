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

  // Return optimized animation props for mobile
  const getAnimationProps = (desktopProps: any) => {
    if (isMobile) {
      // On mobile, show content immediately without animations
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 },
      };
    }
    return desktopProps;
  };

  // Return optimized viewport props
  const getViewportProps = () => {
    if (isMobile) {
      // On mobile, trigger immediately
      return { once: true, amount: 0 };
    }
    return { once: true, amount: 0.3 };
  };

  return {
    isMobile,
    getAnimationProps,
    getViewportProps,
  };
}
