import Image from 'next/image'
import { ScrollReveal } from '@/components/ui'
import { Section, Container } from '@/components/layout'
import styles from './Presentation.module.css'

/**
 * Presentation Section - Homepage "Notre Mission" section
 * Story 4.1: Create Homepage (Task 4)
 * Source: cie4/index.html lines 76-112
 */
export function Presentation() {
  return (
    <Section id="presentation">
      <Container>
        <div className={styles.presentationGrid}>
          <div className={styles.textContent}>
            <span className={styles.subheading}>Notre Mission</span>
            <h2>Comprendre pour mieux protéger</h2>
            <p className={styles.paragraph}>
              Le <strong>Centre d&apos;Initiation à l&apos;Environnement (CIE)</strong>{' '}
              d&apos;Enghien est une ASBL dédiée à la sensibilisation à la nature.
              Situés dans le cadre exceptionnel du parc d&apos;Enghien, nous proposons
              des activités pour les écoles, les familles et tous les curieux.
            </p>
            <p>
              Notre approche pédagogique privilégie le contact direct avec le vivant,
              l&apos;observation et l&apos;expérimentation.
            </p>

            <div className={styles.featureList}>
              <ScrollReveal>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Image src="/icons/leaf.svg" alt="" width={24} height={24} />
                  </div>
                  <div>
                    <h4>Éducation relative à l&apos;environnement</h4>
                    <p className={styles.featureDescription}>
                      Des programmes adaptés aux socles de compétences pour tous les
                      niveaux scolaires.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Image src="/icons/search.svg" alt="" width={24} height={24} />
                  </div>
                  <div>
                    <h4>Découverte Scientifique</h4>
                    <p className={styles.featureDescription}>
                      Approche ludique et scientifique de la faune et de la flore
                      locales.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
          <div className={styles.presentationImg}>
            <Image
              src="https://cieenghien.be/wp-content/uploads/2021/06/Image3bb.jpg"
              alt="Enfants découvrant la nature"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
