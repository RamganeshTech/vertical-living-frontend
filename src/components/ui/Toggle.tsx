import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  isLoading?: boolean;
  trackClassName?: string; // Use this to pass custom background colors
  thumbClassName?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  isLoading = false,
  trackClassName = "",
  thumbClassName = ""
}) => {
  // Default to gray-500 when active, gray-200 when inactive (matching your request for Telescopic)
  const defaultTrackColor = checked ? "bg-gray-500" : "bg-gray-200";

  return (
    <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      {/* Switch Body */}
      <div className="relative inline-flex items-center mt-0.5">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && !isLoading && onChange(e.target.checked)}
          disabled={disabled || isLoading}
        />
        
        {/* Track - Uses custom passed class OR the default gray colors */}
        <div className={`w-10 h-5 rounded-full transition-colors duration-200 shadow-inner ${trackClassName || defaultTrackColor}`}></div>
        
        {/* Switch Thumb - Always white, moves exactly based on checked state */}
        <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 flex items-center justify-center
          ${checked ? 'translate-x-5' : 'translate-x-0'} ${thumbClassName}`}>

          {isLoading && (
            <div className="w-2.5 h-2.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          )}
        </div>
      </div>

      {/* Label & Description */}
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-text-strong">{label}</span>}
          {description && <span className="text-xs text-text-muted mt-0.5">{description}</span>}
        </div>
      )}
    </label>
  );
};