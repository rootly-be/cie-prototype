import Image from 'next/image'
import { Section, Container } from '@/components/layout'
import styles from './ParkSection.module.css'

/**
 * Park Section Component - "Le Parc d'Enghien" section
 * Story 4.2: Create About Page (Task 5)
 * Source: cie4/cie.html lines 135-155
 */
export function ParkSection() {
  return (
    <Section id="parc">
      <Container>
        <div className={styles.grid}>
          <div className={styles.imageContainer}>
            <Image
              src="https://cieenghien.be/wp-content/uploads/2021/06/21b.jpg"
              alt="Le Parc d'Enghien"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className={styles.textContent}>
            <span className={styles.subheading}>Un cadre exceptionnel</span>
            <h2>Le Parc d&apos;Enghien</h2>
            <p className={styles.paragraph}>
              Considéré au XVIIe siècle comme l&apos;un des plus beaux jardins d&apos;Europe,
              le domaine a connu, en trois siècles, de formidables évolutions et restaurations
              et se trouve aujourd&apos;hui classé au <strong>Patrimoine Majeur de Wallonie</strong>.
            </p>
            <p className={styles.paragraph}>
              Vous y découvrirez un superbe exemple d&apos;architecture paysagère, jouant à la
              fois sur la géométrie et la perspective des espaces, l&apos;art floral et
              l&apos;ingénierie hydraulique. Vous revivrez l&apos;ambiance des jardins
              thématiques (comme le jardin « à la française », le Conservatoire européen
              du dahlia, la roseraie) et pourrez admirer de nombreux ouvrages, témoins des
              jeux d&apos;eau qui participaient à la féerie des lieux.
            </p>
            <p className={styles.paragraph}>
              Composé d&apos;une mosaïque de plans d&apos;eau, de bois et de jardins, le parc
              d&apos;Enghien constitue un site remarquable tant par son aspect écologique que
              botanique. De nombreuses espèces d&apos;arbres, de plantes et d&apos;animaux
              vivent en harmonie dans ce magnifique théâtre de verdure.
            </p>
            <p>
              Vous serez vite transporté par le charme et la quiétude de ces paysages
              idylliques, constituant un véritable havre de paix en plein centre-ville.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
