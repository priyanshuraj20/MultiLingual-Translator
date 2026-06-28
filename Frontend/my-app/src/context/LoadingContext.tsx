"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

interface LoadingContextType {
  isTransitioning: boolean;
  navigate: (to: string) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isTransitioning: false,
  navigate: () => {},
});

export const useLoading = () => useContext(LoadingContext);

/**
 * LoadingProvider wraps the application root.
 * It manages the premium loading overlay on initial mount
 * and intercept page links to show the loader during compilation & rendering.
 */
export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(true); // Start true for initial mount loading

  // 1. Initial mount load fade-out
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // 2. Track when routing has finished and the target page mounts
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 350); // Visual buffer for smooth fade transition
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const navigate = (to: string) => {
    if (to === pathname) return; // Ignore same-route navigation
    
    setIsTransitioning(true);
    router.push(to);
  };

  // 3. Global click interceptor.
  // Catches client clicks on local <a> routing links and triggers the loading overlay
  // before Next.js compiles and renders the target page.
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      // Skip external links, anchors, downloads, modifier clicks (new tab), or target="_blank"
      if (
        !href ||
        !href.startsWith("/") ||
        href.startsWith("/#") ||
        href === "#" ||
        target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      ) {
        return;
      }

      e.preventDefault();
      navigate(href);
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [pathname, isTransitioning]);

  return (
    <LoadingContext.Provider value={{ isTransitioning, navigate }}>
      {/* Loading Overlay Transition overlay */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="global-loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] pointer-events-auto"
          >
            <LoadingOverlay />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </LoadingContext.Provider>
  );
}
