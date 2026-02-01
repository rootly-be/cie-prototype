import Image from 'next/image'
import { Section, Container } from '@/components/layout'
import { ScrollReveal } from '@/components/ui'
import styles from './TeamSection.module.css'

interface TeamMember {
  name: string
  role: string
  photo?: string
}

const animators: TeamMember[] = [
  { name: 'Aurore Berger', role: 'Coordinatrice' },
  { name: 'Théo Raevens', role: 'Animateur' },
  { name: 'Flora Morelle', role: 'Animatrice' },
]

const caMembers: TeamMember[] = [
  { name: 'Muriel Mozelsio', role: 'Présidente' },
  { name: 'Grégory Michel', role: 'Vice-président' },
]

/**
 * Team Section Component
 * Story 4.2: Create About Page (Task 4)
 * Source: cie4/cie.html lines 76-133
 */
export function TeamSection() {
  return (
    <Section bgLight id="equipe">
      <Container>
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <h2>L&apos;équipe</h2>
            <p>Des passionnés de nature au service de l&apos;éducation à l&apos;environnement.</p>
          </div>
        </ScrollReveal>

        {/* Animators Grid */}
        <div className={styles.teamGrid}>
          {animators.map((member, index) => (
            <ScrollReveal key={member.name} delay={index * 0.1}>
              <div className={styles.teamCard}>
                <div className={styles.teamPhoto}>
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="150px"
                    />
                  ) : (
                    <span className={styles.photoPlaceholder}>Photo</span>
                  )}
                </div>
                <h3>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CA Section */}
        <div className={styles.caSection}>
          <h3 className={styles.caTitle}>Conseil d&apos;Administration</h3>
          <div className={styles.caGrid}>
            {caMembers.map((member, index) => (
              <ScrollReveal key={member.name} delay={index * 0.1}>
                <div className={`${styles.teamCard} ${styles.caCard}`}>
                  <div className={`${styles.teamPhoto} ${styles.caPhoto}`}>
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        sizes="100px"
                      />
                    ) : (
                      <span className={styles.photoPlaceholder}>Photo</span>
                    )}
                  </div>
                  <h4>{member.name}</h4>
                  <p className={styles.teamRole}>{member.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
