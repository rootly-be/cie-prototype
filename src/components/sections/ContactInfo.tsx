'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input, Button } from '@/components/ui'
import styles from './ContactInfo.module.css'

/**
 * Contact Info Section - Address, phone, email, social, newsletter
 * Story 4.3: Create Contact Page (Task 2)
 * Source: cie4/contact.html lines 57-116
 */
export function ContactInfo() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // Mock subscription - will connect to n8n in production
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  return (
    <div className={styles.contactInfo}>
      <h2>Nos coordonnées</h2>

      <div className={styles.contactDetails}>
        {/* Address */}
        <div className={styles.contactItem}>
          <span className={styles.iconCircle}>
            <Image src="/icons/map-pin.svg" alt="" width={20} height={20} />
          </span>
          <div>
            <h4>Adresse</h4>
            <p>Parc 6, 7850 Enghien, Belgique</p>
          </div>
        </div>

        {/* Phone */}
        <div className={styles.contactItem}>
          <span className={styles.iconCircle}>
            <Image src="/icons/phone.svg" alt="" width={20} height={20} />
          </span>
          <div>
            <h4>Téléphone</h4>
            <p>+32 (0)2 3959789</p>
            <p>0497 24 34 86</p>
          </div>
        </div>

        {/* Email */}
        <div className={styles.contactItem}>
          <span className={styles.iconCircle}>
            <Image src="/icons/mail.svg" alt="" width={20} height={20} />
          </span>
          <div>
            <h4>Email</h4>
            <p>
              <a href="mailto:contact@cieenghien.be" className={styles.emailLink}>
                contact@cieenghien.be
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className={styles.socialLinks}>
        <h4>Suivez-nous</h4>
        <div className={styles.socialButtons}>
          <a
            href="https://facebook.com/cieenghien"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            aria-label="Facebook"
          >
            <Image src="/icons/facebook.svg" alt="" width={20} height={20} />
          </a>
          <a
            href="https://instagram.com/cieenghien"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            aria-label="Instagram"
          >
            <Image src="/icons/instagram.svg" alt="" width={20} height={20} />
          </a>
        </div>
      </div>

      {/* Newsletter */}
      <div className={styles.newsletterBox}>
        <h4>Newsletter</h4>
        <p>
          Pour recevoir notre newsletter et être informés de toutes nos activités.
        </p>
        {subscribed ? (
          <p className={styles.subscribeSuccess} role="status" aria-live="polite">
            Inscription confirmée !
          </p>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email..."
              required
              aria-label="Email pour newsletter"
              className={styles.newsletterInput}
            />
            <Button type="submit" variant="primary">
              S&apos;inscrire
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
