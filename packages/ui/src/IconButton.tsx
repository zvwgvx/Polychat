import React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  variant?: "ghost" | "solid" | "danger";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = "ghost",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const baseStyles = "rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 inline-flex items-center justify-center gap-2";

  const variantStyles = {
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-300",
    solid: "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-300",
    danger: "hover:bg-red-50 text-red-600 focus:ring-red-300"
  };

  const sizeStyles = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg"
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {icon}
      {children}
    </button>
  );
};
