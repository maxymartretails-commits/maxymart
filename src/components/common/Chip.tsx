"use client";
import React, { ReactNode } from "react";

export interface ChipProps {
  children: ReactNode;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  deleteIcon?: ReactNode;
}

const Chip: React.FC<ChipProps> = ({
  children,
  variant = "default",
  size = "md",
  onClick,
  onDelete,
  disabled = false,
  className = "",
  icon,
  deleteIcon,
}) => {
  // Size variants
  const sizeClasses = {
    sm: "h-6 px-2 text-xs gap-x-1",
    md: "h-8 px-4 text-sm gap-x-2",
    lg: "h-10 px-5 text-base gap-x-3",
  };

  // Color variants
  const variantClasses = {
    default: "bg-[#f4f0f0] text-[#181111]",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  };

  // Hover variants (only if clickable)
  const hoverClasses = {
    default: "hover:bg-[#ebe5e5]",
    primary: "hover:bg-blue-200",
    secondary: "hover:bg-gray-200",
    success: "hover:bg-green-200",
    warning: "hover:bg-yellow-200",
    error: "hover:bg-red-200",
  };

  // Base classes
  const baseClasses = `
    flex
    shrink-0
    items-center
    justify-center
    rounded-full
    font-medium
    leading-normal
    transition-colors
    duration-200
  `
    .trim()
    .replace(/\s+/g, " ");

  // Interactive classes
  const interactiveClasses =
    (onClick || onDelete) && !disabled
      ? `cursor-pointer ${hoverClasses[variant]} active:scale-95`
      : "";

  // Disabled classes
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  // Combine all classes
  const chipClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${interactiveClasses}
    ${disabledClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onDelete) {
      onDelete();
    }
  };

  return (
    <div className={chipClasses} onClick={handleClick}>
      {icon && <span className="flex items-center justify-center">{icon}</span>}

      <span className="flex-1 text-center">{children}</span>

      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={disabled}
          className="flex items-center justify-center ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-1 transition-colors duration-150"
          aria-label="Remove"
        >
          {deleteIcon || (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default Chip;
