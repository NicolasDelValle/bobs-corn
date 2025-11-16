import React from 'react';
import { buttonVariants } from '@/components/Button/variants';
import type { VariantProps } from 'class-variance-authority';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Button contents */
  children: React.ReactNode;
}

/** Primary UI component for user interaction */
export const Button = ({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
};
