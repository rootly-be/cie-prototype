'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { loginSchema } from '@/lib/validations/auth'
import styles from './LoginForm.module.css'

/**
 * LoginForm Client Component
 * Story 2.4: Build Admin Login Page
 *
 * Features:
 * - AC2: Client-side validation with Zod (email format, password length)
 * - AC3: Form submission to /api/auth/login with error handling
 * - AC4: Accessibility (labels, ARIA, keyboard navigation)
 *
 * Integration:
 * - Uses loginSchema from Story 2.2 for validation
 * - Calls login API from Story 2.2
 * - Redirects to /admin after success (protected by Story 2.3 middleware)
 * - Uses Input and Button components from Story 1.4
 */
export default function LoginForm() {
  const router = useRouter()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    form?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handle form submission
   * AC2: Validate client-side before API call
   * AC3: Submit to API, handle success/error responses
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({}) // Clear previous errors

    // M3 fix: Trim email (spaces could break authentication)
    const trimmedEmail = email.trim()

    // AC2: Client-side validation with Zod
    const result = loginSchema.safeParse({ email: trimmedEmail, password })

    if (!result.success) {
      // Extract field-level errors from Zod
      const fieldErrors: { email?: string; password?: string } = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'email' | 'password'
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    // AC3: Form submission
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Success: httpOnly cookie set by API (Story 2.2)
        // Redirect to admin (protected by middleware from Story 2.3)
        // H3 fix: Early return prevents state update after unmount
        router.push('/admin')
        // M2 fix: Removed router.refresh() - navigation triggers middleware automatically
        return
      } else {
        // Error: Display user-friendly message from API
        const errorMessage = data.error?.message || 'Une erreur est survenue'
        setErrors({ form: errorMessage })
      }
    } catch (error) {
      // Network or parsing error
      // M7 fix: Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.error('[LoginForm] Submission error:', error)
      }
      setErrors({ form: 'Erreur de connexion au serveur' })
    } finally {
      setIsLoading(false)
    }
  }

  // M4 fix: Clear form-level error when user types
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.form) {
      setErrors({ ...errors, form: undefined })
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.form) {
      setErrors({ ...errors, form: undefined })
    }
  }

  return (
    <div
      className={styles.formContainer}
      style={{ opacity: isLoading ? 0.6 : 1 }} // M6 fix: Visual loading feedback
    >
      <h1 className={styles.title} id="login-title">
        Connexion Admin
      </h1>

      {/* AC4: Form-level error with aria-live for screen readers */}
      {errors.form && (
        <div className={styles.formError} role="alert" aria-live="polite">
          {errors.form}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={styles.form}
        noValidate // L5 fix: Use Zod validation instead of browser validation
        aria-labelledby="login-title" // L2 fix: Link form to title for screen readers
      >
        {/* AC4: Proper labels with htmlFor (handled by Input component) */}
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={handleEmailChange}
          error={errors.email}
          required
          autoComplete="email"
          disabled={isLoading}
          maxLength={255} // M5 fix: RFC 5321 standard max email length
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Mot de passe"
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
          required
          autoComplete="current-password"
          disabled={isLoading}
          maxLength={128} // M5 fix: Reasonable password max length
        />

        {/* AC3: Submit button with loading state */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  )
}
