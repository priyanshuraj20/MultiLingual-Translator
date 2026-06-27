import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all font-sans rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none active:scale-98";

  const variants = {
    primary: "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-lg shadow-[#8b5cf6]/10",
    secondary: "bg-[#0a0a0a] hover:bg-[#111111] text-white border border-[#1f1f1f]",
    outline: "border border-white/5 hover:border-white/10 text-white bg-transparent",
    ghost: "text-[#a1a1aa] hover:text-white bg-transparent",
    white: "bg-white text-black hover:bg-zinc-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
