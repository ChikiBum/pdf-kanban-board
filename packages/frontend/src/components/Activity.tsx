import type { ReactNode } from 'react';

interface ActivityProps {
  children: ReactNode;
  className?: string;
}

export function Activity({ children, className = '' }: ActivityProps) {
  return <div className={`transition-opacity duration-200 ${className}`}>{children}</div>;
}
