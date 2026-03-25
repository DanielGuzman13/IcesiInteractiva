import React from 'react';

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  children: React.ReactNode;
}

export const Boton: React.FC<BotonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  let baseStyles = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 block w-full text-center";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50",
    success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
