# Story 1.8: Create Form Components

Status: done

## Story

As a **visitor**,
I want **forms that match cie4 styling**,
So that **I have a consistent experience when filling forms**.

## Acceptance Criteria

1. **AC1:** `Input`, `Textarea`, `Select` components match cie4 styling (FR53)
2. **AC2:** Focus states are visible with accent border and subtle shadow
3. **AC3:** Validation error states are styled (red border, error message)
4. **AC4:** Components are accessible (labels, aria attributes, keyboard navigation)

## Tasks / Subtasks

- [x] Task 1: Create Input component (AC: 1, 2, 3, 4)
  - [x] Create `src/components/ui/Input.tsx` with 'use client'
  - [x] Create `src/components/ui/Input.module.css` matching cie4 .form-input
  - [x] Add props: id, name, type, placeholder, value, onChange, error, label, required
  - [x] Implement error state styling (red border)
  - [x] Add label with htmlFor and optional required indicator

- [x] Task 2: Create Textarea component (AC: 1, 2, 3, 4)
  - [x] Create `src/components/ui/Textarea.tsx` with 'use client'
  - [x] Create `src/components/ui/Textarea.module.css` matching cie4 .form-input
  - [x] Add props: id, name, placeholder, value, onChange, error, label, required, rows
  - [x] Implement resize behavior (vertical only)
  - [x] Add label with htmlFor and optional required indicator

- [x] Task 3: Create Select component (AC: 1, 2, 3, 4)
  - [x] Create `src/components/ui/Select.tsx` with 'use client'
  - [x] Create `src/components/ui/Select.module.css` matching cie4 .form-input
  - [x] Add props: id, name, options, value, onChange, error, label, required, placeholder
  - [x] Add custom dropdown arrow styling
  - [x] Add label with htmlFor and optional required indicator

- [x] Task 4: Create FormField wrapper component (AC: 4)
  - [x] Create `src/components/ui/FormField.tsx`
  - [x] Create `src/components/ui/FormField.module.css`
  - [x] Wrapper for label + input + error message layout
  - [x] Accept children, label, error, required props

- [x] Task 5: Export components and verify build (AC: 1)
  - [x] Export all form components from `src/components/ui/index.ts`
  - [x] Run `npm run build` to verify no TypeScript errors
  - [x] Verify dark mode styling works correctly

## Dev Notes

### CRITICAL: Source Files

**cie4/style.css:39,91 - CSS Variables for input background:**
```css
/* Light mode */
--bg-input: #ffffff;

/* Dark mode */
--bg-input: #2c2c2c;
```

**cie4/style.css:144-151 - Focus states:**
```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
.btn:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
}
```

**cie4/style.css:473-489 - Form box and input styles:**
```css
.form-box {
    background: var(--bg-card); padding: 40px;
    border-radius: var(--radius-md); color: var(--text-main);
}
.form-input {
    width: 100%; padding: 12px;
    border: 1px solid var(--border-main);
    background-color: var(--bg-input);
    color: var(--text-main);
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 16px;
}
.form-input:focus {
    outline: none; border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(128,128,128,0.1);
}
```

### CSS Variables Already Available

From `src/styles/variables.css`:
- `--bg-input` - Already defined (light: #ffffff, dark: #2c2c2c)
- `--border-main` - Border color
- `--text-main` - Text color
- `--color-accent` - Accent color for focus
- `--radius-sm` - Border radius (4px)
- `--font-body` - Body font family

### TypeScript Interfaces

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}
```

### Implementation Pattern for Input

```typescript
'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={styles.field}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### CSS Module Pattern for Input

```css
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-main);
}

.required {
  color: var(--color-error, #dc3545);
  margin-left: 2px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-main);
  background-color: var(--bg-input);
  color: var(--text-main);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(128, 128, 128, 0.1);
}

.inputError {
  border-color: var(--color-error, #dc3545);
}

.inputError:focus {
  border-color: var(--color-error, #dc3545);
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.error {
  font-size: var(--text-sm);
  color: var(--color-error, #dc3545);
}
```

### File Structure After This Story

```
src/
├── components/
│   ├── ui/
│   │   ├── index.ts           # MODIFIED: Export form components
│   │   ├── Input.tsx          # NEW: Input component
│   │   ├── Input.module.css   # NEW: Input styles
│   │   ├── Textarea.tsx       # NEW: Textarea component
│   │   ├── Textarea.module.css # NEW: Textarea styles
│   │   ├── Select.tsx         # NEW: Select component
│   │   ├── Select.module.css  # NEW: Select styles
│   │   ├── FormField.tsx      # NEW: FormField wrapper
│   │   ├── FormField.module.css # NEW: FormField styles
│   │   └── ...
```

### What NOT to Do

- ❌ Do NOT forget 'use client' directive (components use hooks)
- ❌ Do NOT use inline styles for input styling (use CSS Modules)
- ❌ Do NOT hardcode colors (use CSS variables)
- ❌ Do NOT forget aria-invalid and aria-describedby for accessibility
- ❌ Do NOT forget to generate unique IDs for label/input association
- ❌ Do NOT skip error state styling
- ❌ Do NOT forget displayName for forwardRef components

### Testing Verification

To verify the implementation:

1. Input, Textarea, Select render with correct cie4 styling
2. Focus states show accent border and subtle shadow
3. Error states show red border and error message
4. Labels are properly associated with inputs (click label focuses input)
5. Dark mode colors work correctly (--bg-input changes)
6. Required indicator (*) appears when required prop is set
7. `npm run build` passes with no TypeScript errors
8. Screen reader announces error messages (role="alert")

### References

- [Source: cie4/style.css:39,91] - --bg-input CSS variable
- [Source: cie4/style.css:144-151] - Focus ring styles
- [Source: cie4/style.css:473-489] - .form-input styles
- [Source: docs/planning-artifacts/epics.md:374-387] - Story requirements

---

## Previous Story Intelligence (Story 1.7)

### Key Learnings from Story 1.7

1. **RefObject typing**: Use `React.RefObject<HTMLDivElement | null>` for strict TypeScript
2. **Polymorphic components**: Use `as` prop with ElementType generic for semantic flexibility
3. **CSS organization**: Animations in separate file, imported in globals.css
4. **Duplicate CSS rules**: Check for conflicting rules across files (typography.css vs animations.css)
5. **Optimization notes**: Add comments for future optimizations (shared observer pattern)

### Patterns Established

- 'use client' for any component with hooks or browser APIs
- CSS Modules for all component styling
- Barrel exports in index.ts
- forwardRef for form components (allows parent ref access)
- useId() for generating unique accessible IDs

### Code Review Fixes from Story 1.7

- M1: Removed duplicate prefers-reduced-motion rules
- M2: Added optimization note comment for shared IntersectionObserver
- M3: Added polymorphic `as` prop to ScrollReveal

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build verified: `npm run build` passes with no errors

### Completion Notes List

1. **AC1 (Input, Textarea, Select match cie4):** Created all three components with cie4 styling: 12px padding, --bg-input background, --border-main border, --radius-sm border-radius, 16px font-size, --font-body font-family. All extend native HTML attributes for full compatibility.

2. **AC2 (Focus states visible):** Implemented focus states with --color-accent border and box-shadow 0 0 0 3px rgba(128,128,128,0.1). Added :focus-visible with --focus-ring for keyboard accessibility.

3. **AC3 (Error states styled):** All components support error prop with red border (--color-error), red error message with role="alert", and enhanced focus ring for error state.

4. **AC4 (Accessible):** Components use forwardRef for ref access, useId() for unique IDs, label with htmlFor, aria-invalid for error state, aria-describedby linking to error message, required indicator (*) when required prop is set.

5. **FormField wrapper:** Created for custom inputs that need label/error layout. Includes optional hint text support.

6. **Dark mode:** All components use CSS variables (--bg-input, --border-main, --text-main) which automatically adapt to dark mode via html.dark-mode remapping in variables.css.

### Code Review Fixes

| ID | Severity | Issue | Fix Applied |
|----|----------|-------|-------------|
| M1 | MEDIUM | Duplicated CSS across form components | Added documentation note about trade-off, future optimization path |
| M2 | MEDIUM | Missing SelectOption type export | Exported SelectOption from Select.tsx and barrel index.ts |
| M3 | MEDIUM | CSS :has() selector limited browser support | Replaced with JS-based .selectWrapperError class |
| L1 | LOW | FormField aria-describedby not connected | Added accessibility documentation to JSDoc |
| L2 | LOW | Inconsistent className handling | Changed FormField to use array join pattern |
| L3 | LOW | Duplicate focus-visible rules | Removed duplicates, kept error-specific rules, added note about global handling |

### Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-26 | Created Input component with CSS Module | Task 1 |
| 2026-01-26 | Created Textarea component with CSS Module | Task 2 |
| 2026-01-26 | Created Select component with custom arrow | Task 3 |
| 2026-01-26 | Created FormField wrapper component | Task 4 |
| 2026-01-26 | Exported all form components from barrel | Task 5 |
| 2026-01-26 | Code review fixes: export SelectOption, fix :has() selector, cleanup CSS | Code Review |

### File List

**Created:**
- src/components/ui/Input.tsx
- src/components/ui/Input.module.css
- src/components/ui/Textarea.tsx
- src/components/ui/Textarea.module.css
- src/components/ui/Select.tsx
- src/components/ui/Select.module.css
- src/components/ui/FormField.tsx
- src/components/ui/FormField.module.css

**Modified:**
- src/components/ui/index.ts - Added exports for Input, Textarea, Select, FormField
