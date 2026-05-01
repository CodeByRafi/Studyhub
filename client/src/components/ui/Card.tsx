import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card = ({ children, className = '', hoverable = false }: CardProps) => {
  return (
    <div className={`
      bg-zinc-900 border border-zinc-800 rounded-3xl p-6 transition-all duration-300
      ${hoverable ? 'hover:border-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/10' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};
