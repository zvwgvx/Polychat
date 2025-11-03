import React from "react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  fallback?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  fallback = "?"
}) => {
  const sizeStyles = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  const baseStyles = "rounded-full flex items-center justify-center font-medium";

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${baseStyles} ${sizeStyles[size]} object-cover`}
      />
    );
  }

  return (
    <div className={`${baseStyles} ${sizeStyles[size]} bg-gradient-to-br from-blue-500 to-purple-600 text-white`}>
      {fallback}
    </div>
  );
};
