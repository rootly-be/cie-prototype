'use client';

import { forwardRef, SelectHTMLAttributes, useId } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /** Label text displayed above the select */
  label?: string;
  /** Error message displayed below the select */
  error?: string;
  /** Array of options to display */
  options: SelectOption[];
  /** Placeholder text shown when no option is selected */
  placeholder?: string;
}

/**
 * Select component matching cie4 form styling.
 * Supports labels, error states, and accessibility features.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Category"
 *   placeholder="Select a category"
 *   options={[
 *     { value: 'nature', label: 'Nature' },
 *     { value: 'forest', label: 'Forest' },
 *   ]}
 *   required
 * />
 *
 * // With error
 * <Select
 *   label="Category"
 *   options={options}
 *   error="Please select a category"
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;

    const selectClasses = [
      styles.select,
      error ? styles.selectError : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.field}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={`${styles.selectWrapper} ${error ? styles.selectWrapperError : ''}`.trim()}>
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled={props.required}>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={styles.arrow} aria-hidden="true" />
        </div>
        {error && (
          <span id={errorId} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
