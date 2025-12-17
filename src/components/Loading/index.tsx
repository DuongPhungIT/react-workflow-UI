// Loading component

import React from 'react';
import { cn } from '@/utils/classNames';
import './styles.less';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  fullScreen = false,
  text,
  className,
}) => {
  const spinner = (
    <div className={cn('loading', className)}>
      <svg
        className={cn('loading__spinner', `loading__spinner--${size}`)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          opacity="0.25"
        />
        <path
          fill="currentColor"
          opacity="0.75"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <p className="loading__text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="loading loading--full-screen">{spinner}</div>;
  }

  return spinner;
};

export default Loading;

