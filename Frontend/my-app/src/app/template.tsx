"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import CustomCursor from "@/components/ui/CustomCursor";

/**
 * Root Next.js template component.
 * Remounts on every client-side page navigation.
 * Manages client smooth scrolling and page content fade-in animations.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Asynchronously load Locomotive Scroll for inertia-based smooth scrolling on client-side
    let locomotiveScroll: any = null;
    (async () => {
      try {
        const LocomotiveScrollClass = (await import("locomotive-scroll")).default;
        locomotiveScroll = new LocomotiveScrollClass({
          lenisOptions: {
            wrapper: window,
            content: document.documentElement,
            lerp: 0.1,         // Elastic scroll inertia speed
            duration: 1.2,     // Inertial duration
            smoothWheel: true,
          },
        });
      } catch (err) {
        console.error("Locomotive Scroll dynamic load failed:", err);
      }
    })();

    // Cleanup scrolling hooks
    return () => {
      if (locomotiveScroll && typeof locomotiveScroll.destroy === "function") {
        locomotiveScroll.destroy();
      }
    };
  }, []);

  return (
    <>
      {/* Premium cursor follow-ring dot */}
      <CustomCursor />

      {/* Page Content Fade-In Transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full min-h-screen flex flex-col flex-1"
      >
        {children}
      </motion.div>
    </>
  );
}
