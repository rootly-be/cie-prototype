import Image from 'next/image'
import { Section, Container } from '@/components/layout'
import styles from './AboutMission.module.css'

/**
 * About Mission Section - "Qui sommes-nous" section
 * Story 4.2: Create About Page (Task 3)
 * Source: cie4/cie.html lines 50-74
 */
export function AboutMission() {
  return (
    <Section id="qui-sommes-nous">
      <Container>
        <div className={styles.grid}>
          <div className={styles.textContent}>
            <span className={styles.subheading}>Notre Mission</span>
            <h2>Qui sommes-nous ?</h2>
            <p className={styles.paragraph}>
              Le <strong>CIE d&apos;Enghien (Centre d&apos;Initiation à l&apos;Environnement)</strong>{' '}
              est un espace dédié à la découverte, à l&apos;apprentissage et à la
              sensibilisation à l&apos;environnement. À travers des activités pédagogiques,
              des ateliers nature, des formations et des animations pour tous les publics,
              notre mission est de créer un lien vivant entre l&apos;homme et son environnement.
            </p>
            <p className={styles.paragraph}>
              Situé au cœur d&apos;un cadre naturel exceptionnel, le CIE d&apos;Enghien accueille
              écoles, familles, associations et citoyens désireux de comprendre, préserver
              et valoriser la nature qui nous entoure. Nous proposons une approche active,
              accessible et ludique de l&apos;éducation à l&apos;environnement.
            </p>
            <p>
              Nous sommes <strong>fièrement soutenus par la Région wallonne</strong>, un appui
              essentiel qui nous permet de développer des projets innovants, d&apos;enrichir nos
              programmes pédagogiques et de renforcer notre rôle d&apos;acteur local engagé en
              faveur du développement durable.
            </p>

            <blockquote className={styles.quote}>
              &laquo; Le monde ne mourra jamais par manque de merveilles, mais par manque
              d&apos;émerveillement. &raquo;
              <footer>- Gilbert Keith Chesterton</footer>
            </blockquote>
          </div>
          <div className={styles.imageContainer}>
            <Image
              src="https://cieenghien.be/wp-content/uploads/2021/06/Image3bb.jpg"
              alt="Photo du CIE d'Enghien"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
