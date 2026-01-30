'use client';

import { ReactNode, useId } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  /** Form field content (input, select, custom component, etc.) */
  children: ReactNode;
  /** Label text displayed above the field */
  label?: string;
  /** Error message displayed below the field */
  error?: string;
  /** Help text displayed below the field (hidden when error is shown) */
  hint?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Custom ID for the field (used for label htmlFor) */
  htmlFor?: string;
  /** Additional class name for the container */
  className?: string;
}

/**
 * FormField wrapper component for form field layout.
 * Use this to wrap custom inputs that don't have built-in label/error support,
 * or for consistent layout across different field types.
 *
 * Note: Input, Textarea, and Select components have built-in label/error support.
 * Use FormField for custom inputs or third-party components.
 *
 * **Accessibility Note:** For full accessibility, pass the same `id` to both
 * FormField's `htmlFor` prop and the child input's `id` prop. The child should
 * also receive `aria-describedby={id + '-error'}` when there's an error.
 *
 * @example
 * ```tsx
 * // With a custom date picker (full accessibility)
 * <FormField label="Date" required error={errors.date} htmlFor="date-field">
 *   <DatePicker
 *     id="date-field"
 *     aria-describedby={errors.date ? 'date-field-error' : undefined}
 *   />
 * </FormField>
 *
 * // With hint text
 * <FormField label="Password" hint="Must be at least 8 characters">
 *   <Input type="password" />
 * </FormField>
 * ```
 */
export function FormField({
  children,
  label,
  error,
  hint,
  required = false,
  htmlFor,
  className = '',
}: FormFieldProps) {
  const generatedId = useId();
  const fieldId = htmlFor || generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const fieldClasses = [styles.field, className].filter(Boolean).join(' ');

  return (
    <div className={fieldClasses}>
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {children}
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  );
}
