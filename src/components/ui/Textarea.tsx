'use client';

import { forwardRef, TextareaHTMLAttributes, useId } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea */
  label?: string;
  /** Error message displayed below the textarea */
  error?: string;
}

/**
 * Textarea component matching cie4 form styling.
 * Supports labels, error states, and accessibility features.
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Message"
 *   placeholder="Your message..."
 *   rows={5}
 *   required
 * />
 *
 * // With error
 * <Textarea
 *   label="Message"
 *   error="Message is required"
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;

    const textareaClasses = [
      styles.textarea,
      error ? styles.textareaError : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.field}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          rows={rows}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <span id={errorId} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
