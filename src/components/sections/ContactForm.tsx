'use client'

import { useState } from 'react'
import { Input, Textarea, Select, Button } from '@/components/ui'
import styles from './ContactForm.module.css'

const subjectOptions = [
  { value: 'general', label: 'Renseignement général' },
  { value: 'scolaire', label: 'Inscription Scolaire' },
  { value: 'stage', label: 'Inscription Stage' },
  { value: 'autre', label: 'Autre' },
]

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  form?: string
}

/**
 * Contact Form Component - Form with Zod validation and n8n webhook
 * Story 4.3: Create Contact Page (Task 3)
 * Source: cie4/contact.html lines 118-145
 * Implements FR33, FR34, FR35
 */
export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide'
    }

    if (!formData.subject) {
      newErrors.subject = 'Veuillez sélectionner un sujet'
    }

    if (!formData.message || formData.message.length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setSending(true)
    setErrors({})

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: 'general', message: '' })
        setTimeout(() => setSubmitted(false), 10000)
      } else {
        setErrors({ form: data.error?.message || 'Une erreur est survenue' })
      }
    } catch {
      setErrors({ form: 'Erreur de connexion. Veuillez réessayer.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.formBox}>
      <h3>Envoyez-nous un message</h3>

      {submitted ? (
        <div className={styles.successMessage} role="status" aria-live="polite">
          <p className={styles.successTitle}>Message envoyé avec succès !</p>
          <p>Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <div className={styles.formError} role="alert">
              {errors.form}
            </div>
          )}

          <div className={styles.formGroup}>
            <Input
              label="Nom complet"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
              error={errors.name}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              error={errors.email}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <Select
              label="Sujet"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              options={subjectOptions}
              error={errors.subject}
            />
          </div>

          <div className={styles.formGroup}>
            <Textarea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Bonjour..."
              error={errors.message}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className={styles.submitBtn}
            disabled={sending}
          >
            {sending ? 'Envoi en cours...' : 'Envoyer le message'}
          </Button>
        </form>
      )}
    </div>
  )
}
