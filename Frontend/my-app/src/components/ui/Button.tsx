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
    "inline-flex items-center justify-center font-medium transition-all font-sans rounded-md focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none";

  const variants = {
    primary: "bg-[#2f54eb] hover:bg-[#1d39c4] text-white",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    outline: "border border-white/10 hover:border-white/20 text-white bg-transparent",
    ghost: "text-on-surface-variant hover:text-white bg-transparent",
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
