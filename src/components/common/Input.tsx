import React, { forwardRef, ReactNode } from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outlined" | "filled" | "underlined";
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      placeholder = "",
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      disabled = false,
      required = false,
      className = "",
      id,
      name,
      autoComplete,
      maxLength,
      minLength,
      min,
      max,
      step,
      pattern,
      readOnly = false,
      size = "md",
      variant = "default",
      error = "",
      label = "",
      helperText = "",
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    // Size variants
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-4 py-3 text-lg",
    };

    // Style variants
    const variantClasses = {
      default:
        "border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500",
      outlined:
        "border-2 border-gray-300 bg-transparent focus:border-blue-500 focus:ring-0",
      filled:
        "border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500",
      underlined:
        "border-0 border-b-2 border-gray-300 bg-transparent rounded-none focus:border-blue-500 focus:ring-0 px-0",
    };

    // Base classes
    const baseClasses = `
    w-full
    rounded-lg
    border
    font-normal
    leading-normal
    transition-colors
    duration-200
    placeholder:text-gray-400
    focus:outline-none
    focus:ring-1
    disabled:cursor-not-allowed
    disabled:opacity-50
    disabled:bg-gray-50
  `
      .trim()
      .replace(/\s+/g, " ");

    // Error state classes
    const errorClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "";

    // Combine all classes
    const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${errorClasses || variantClasses[variant]}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    // Input wrapper for icons
    const hasIcons = leftIcon || rightIcon;

    if (hasIcons) {
      return (
        <div className="relative">
          {label && (
            <label
              htmlFor={id}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <div className="relative">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span>{leftIcon}</span>
              </div>
            )}

            <input
              ref={ref}
              type={type}
              placeholder={placeholder}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              disabled={disabled}
              required={required}
              id={id}
              name={name}
              autoComplete={autoComplete}
              maxLength={maxLength}
              minLength={minLength}
              min={min}
              max={max}
              step={step}
              pattern={pattern}
              readOnly={readOnly}
              className={`${inputClasses} ${leftIcon ? "pl-10" : ""} ${
                rightIcon ? "pr-10" : ""
              }`}
              {...props}
            />

            {rightIcon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-400">{rightIcon}</span>
              </div>
            )}
          </div>

          {(error || helperText) && (
            <p
              className={`mt-1 text-sm ${
                error ? "text-red-600" : "text-gray-500"
              }`}
            >
              {error || helperText}
            </p>
          )}
        </div>
      );
    }

    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          id={id}
          name={name}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          readOnly={readOnly}
          className={inputClasses}
          {...props}
        />

        {(error || helperText) && (
          <p
            className={`mt-1 text-sm ${
              error ? "text-red-600" : "text-gray-500"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
