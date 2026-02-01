'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Container } from '@/components/layout'
import { Input, Textarea, Select, Button } from '@/components/ui'
import styles from './ContactSection.module.css'

const subjectOptions = [
  { value: 'general', label: 'Renseignement général' },
  { value: 'scolaire', label: 'Inscription Scolaire' },
  { value: 'stage', label: 'Inscription Stage' },
  { value: 'autre', label: 'Autre' },
]

/**
 * Contact Section - Contact info, support badge, and contact form
 * Story 4.1: Create Homepage (Task 8)
 * Source: cie4/index.html lines 230-304
 */
export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // Mock submission - will connect to n8n in story 4.3
    await new Promise((resolve) => setTimeout(resolve, 500))

    setSubmitted(true)
    setSending(false)
    setFormData({ name: '', email: '', subject: 'general', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section className={styles.contactWrapper} id="contact">
      <Container>
        <div className={styles.contactGrid}>
          {/* Contact Info Column */}
          <div className={styles.contactInfo}>
            <h2>Restons en contact</h2>
            <p>
              Vous avez une question sur nos activités ou vous souhaitez organiser
              une visite ?
            </p>

            <div className={styles.contactDetails}>
              <p className={styles.contactItem}>
                <span className={styles.iconCircle}>
                  <Image src="/icons/map-pin.svg" alt="" width={20} height={20} />
                </span>
                <span>Avenue Elisabeth, 7850 Enghien, Belgique</span>
              </p>
              <p className={styles.contactItem}>
                <span className={styles.iconCircle}>
                  <Image src="/icons/mail.svg" alt="" width={20} height={20} />
                </span>
                <span>info@cieenghien.be</span>
              </p>
              <p className={styles.contactItem}>
                <span className={styles.iconCircle}>
                  <Image src="/icons/phone.svg" alt="" width={20} height={20} />
                </span>
                <span>+32 (0)2 395 91 63</span>
              </p>
            </div>

            {/* Support Badge */}
            <div className={styles.donationBadge} id="soutenir">
              <h4 className={styles.donationTitle}>
                <span className={styles.iconCircle}>
                  <Image src="/icons/heart.svg" alt="" width={20} height={20} />
                </span>
                <span>Nous Soutenir</span>
              </h4>
              <p className={styles.donationText}>
                Votre soutien est essentiel pour la préservation de la nature.
              </p>
              <span className={styles.iban}>BE12 3456 7890 1234</span>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className={styles.formBox}>
            <h3>Envoyez-nous un message</h3>

            {submitted ? (
              <p className={styles.successMessage} role="status" aria-live="polite">
                Message envoyé avec succès ! Nous vous répondrons bientôt.
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <Input
                    label="Nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
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
                  />
                </div>
                <div className={styles.formGroup}>
                  <Textarea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Bonjour..."
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.submitBtn}
                  disabled={sending}
                >
                  {sending ? 'Envoi...' : 'Envoyer le message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
