import Image from 'next/image'
import { Section, Container } from '@/components/layout'
import { ScrollReveal } from '@/components/ui'
import styles from './SupportSection.module.css'

/**
 * Support Section - "Nous Soutenir" with donation info
 * Story 4.3: Create Contact Page (Task 5)
 * Source: cie4/contact.html lines 152-192
 */
export function SupportSection() {
  return (
    <Section bgLight id="soutenir">
      <Container>
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <h2>Nous Soutenir</h2>
            <p>
              Votre soutien nous permet de poursuivre notre mission de sensibilisation
              à l&apos;environnement.
            </p>
          </div>
        </ScrollReveal>

        <div className={styles.supportGrid}>
          {/* Why Support */}
          <ScrollReveal>
            <div className={styles.supportCard}>
              <span className={styles.iconCircleLarge}>
                <Image src="/icons/heart.svg" alt="" width={28} height={28} />
              </span>
              <h3>Pourquoi nous soutenir ?</h3>
              <p>
                En nous soutenant, vous contribuez directement à la poursuite de nos
                projets de sensibilisation à l&apos;environnement, destinés à un public
                varié sur l&apos;ensemble du territoire wallon. Votre appui nous permet
                d&apos;avoir un impact concret et durable.
              </p>
            </div>
          </ScrollReveal>

          {/* How to Support */}
          <ScrollReveal delay={0.1}>
            <div className={styles.supportCard}>
              <h3>Comment nous soutenir ?</h3>

              <div className={styles.supportMethod}>
                <h4>Faire un don</h4>
                <p>Vous pouvez nous soutenir financièrement sur le compte :</p>
                <span className={styles.iban}>BE11-0013-3971-0648</span>
              </div>

              <div className={styles.supportMethod}>
                <h4>Donner de votre temps</h4>
                <p>Contactez-nous si vous souhaitez participer en tant que bénévole.</p>
              </div>

              <div className={styles.supportMethod}>
                <h4>Partager et promouvoir</h4>
                <p>Parlez de nos actions autour de vous et sur vos réseaux.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  )
}
