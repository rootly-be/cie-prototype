'use client'

import { useState } from 'react'
import { Section, Container } from '@/components/layout'
import { Input, Button } from '@/components/ui'
import styles from './IdeasBox.module.css'

/**
 * Ideas Box Section - Simple suggestion form
 * Story 4.1: Create Homepage (Task 7)
 * Source: cie4/index.html lines 218-228
 */
export function IdeasBox() {
  const [idea, setIdea] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (idea.trim()) {
      // Mock submission - will connect to n8n in story 4.3
      setSubmitted(true)
      setIdea('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <Section bgLight>
      <Container>
        <div className={styles.ideasBox}>
          <h2>Une idée ? Une suggestion ?</h2>
          <p className={styles.description}>
            La boîte à idées est ouverte ! Aidez-nous à améliorer le CIE.
          </p>

          {submitted ? (
            <p className={styles.thankYou} role="status" aria-live="polite">
              Merci pour votre suggestion !
            </p>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Votre idée en quelques mots..."
                className={styles.input}
                aria-label="Votre suggestion"
              />
              <Button type="submit" variant="primary" disabled={!idea.trim()}>
                Envoyer
              </Button>
            </form>
          )}
        </div>
      </Container>
    </Section>
  )
}
