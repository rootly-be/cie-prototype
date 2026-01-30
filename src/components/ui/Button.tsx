'use client';

import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

export function Button({
  variant = 'primary',
  disabled = false,
  children,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const buttonClasses = [
    styles.btn,
    variant === 'primary' ? styles.btnPrimary : styles.btnOutline,
    disabled ? styles.btnDisabled : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
