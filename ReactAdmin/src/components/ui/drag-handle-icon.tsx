import React from 'react';

interface DragHandleIconProps {
  className?: string;
}

/**
 * A simple drag handle icon with three vertical dots.
 */
export function DragHandleIcon({ className }: DragHandleIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

export default DragHandleIcon;
