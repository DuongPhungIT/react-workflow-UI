// Input component

import React from 'react';
import { cn } from '@/utils/classNames';
import './styles.less';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('input-wrapper', fullWidth && 'input-wrapper--full-width')}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="input-container">
          {leftIcon && (
            <div className="input-icon input-icon--left">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input',
              error && 'input--error',
              leftIcon ? 'input--with-left-icon' : null,
              rightIcon ? 'input--with-right-icon' : null,
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="input-icon input-icon--right">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="input-error">{error}</p>}
        {helperText && !error && <p className="input-helper">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

