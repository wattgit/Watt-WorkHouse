
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  children,
  variant = 'primary',
}) => {
  const baseClasses = "px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105";

  const variantClasses = {
    primary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500",
    secondary: "bg-gray-600 text-gray-200 hover:bg-gray-500 focus:ring-gray-500",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
