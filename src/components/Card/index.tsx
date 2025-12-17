// Card component

import React from 'react';
import { cn } from '@/utils/classNames';
import './styles.less';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'card',
        `card--${variant}`,
        `card--padding-${padding}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

