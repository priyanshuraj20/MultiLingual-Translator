"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor renders a premium dual-layer custom cursor (inner dot + lagging outer ring)
 * that reacts to hover states on interactive page elements.
 * Corrected to avoid Tailwind CSS translation clashing and supports hybrid touch/mouse screens.
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for outer ring follow lag
  const springConfig = { damping: 25, stiffness: 220, mass: 0.55 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Dynamic tracking of actual pointer movements.
    // Handles hybrid/touch screen laptops perfectly: shows custom cursor if mouse is used,
    // hides it if touch events are firing.
    const handleMouseMove = (e: MouseEvent) => {
      // Don't show cursor if coordinates are off-screen
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth - 2 || e.clientY >= window.innerHeight - 2) {
        setIsVisible(false);
        return;
      }
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") || 
        target.closest("[role='button']") ||
        target.closest(".premium-card") ||
        target.style.cursor === "pointer";

      setIsHovered(!!isInteractive);
    };

    // Hide custom cursor immediately if user taps/touches the screen
    const handleTouchStart = () => {
      setIsVisible(false);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer follow ring (lagging inertia) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-solid rounded-full pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: isHovered ? "rgba(255, 255, 255, 0.7)" : "rgba(139, 92, 246, 0.45)", // White on hover, Purple normally
          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.05)" : "rgba(139, 92, 246, 0.02)",
        }}
        animate={{
          scale: isClicked ? 0.75 : isHovered ? 1.45 : 1,
        }}
        transition={{ duration: 0.12 }}
      />

      {/* Inner precise dot (tracks mouse instantly) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[10000]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: isHovered ? "#ffffff" : "#8b5cf6", // White on hover, Purple normally
        }}
        animate={{
          scale: isClicked ? 0.7 : isHovered ? 1.15 : 1,
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}
