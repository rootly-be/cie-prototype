import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Section, Container } from '@/components/layout'
import { ScrollReveal } from '@/components/ui'
import styles from './TeamSection.module.css'

/**
 * Team Section Component
 * Story 4.2: Create About Page (Task 4)
 * Fetches team members from database
 */
export async function TeamSection() {
  // Fetch team members from database
  const members = await prisma.teamMember.findMany({
    orderBy: [{ ordre: 'asc' }, { nom: 'asc' }],
  })

  const equipeMembers = members.filter((m) => m.type === 'equipe')
  const caMembers = members.filter((m) => m.type === 'ca')

  return (
    <Section bgLight id="equipe">
      <Container>
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <h2>L&apos;équipe</h2>
            <p>Des passionnés de nature au service de l&apos;éducation à l&apos;environnement.</p>
          </div>
        </ScrollReveal>

        {/* Équipe Grid */}
        {equipeMembers.length > 0 && (
          <div className={styles.teamGrid}>
            {equipeMembers.map((member, index) => (
              <ScrollReveal key={member.id} delay={index * 0.1}>
                <div className={styles.teamCard}>
                  <div className={styles.teamPhoto}>
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.nom}
                        fill
                        sizes="150px"
                      />
                    ) : (
                      <span className={styles.photoPlaceholder}>Photo</span>
                    )}
                  </div>
                  <h3>{member.nom}</h3>
                  <p className={styles.teamRole}>{member.fonction}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* CA Section - Same card style */}
        {caMembers.length > 0 && (
          <div className={styles.caSection}>
            <h3 className={styles.caTitle}>Conseil d&apos;Administration</h3>
            <div className={styles.teamGrid}>
              {caMembers.map((member, index) => (
                <ScrollReveal key={member.id} delay={index * 0.1}>
                  <div className={styles.teamCard}>
                    <div className={styles.teamPhoto}>
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.nom}
                          fill
                          sizes="150px"
                        />
                      ) : (
                        <span className={styles.photoPlaceholder}>Photo</span>
                      )}
                    </div>
                    <h3>{member.nom}</h3>
                    <p className={styles.teamRole}>{member.fonction}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Empty state if no members */}
        {members.length === 0 && (
          <div className={styles.sectionHeader}>
            <p>L&apos;équipe sera bientôt présentée ici.</p>
          </div>
        )}
      </Container>
    </Section>
  )
}
