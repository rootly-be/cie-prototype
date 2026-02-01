import Image from 'next/image'
import Link from 'next/link'
import { Section, Container } from '@/components/layout'
import { ScrollReveal, Card } from '@/components/ui'
import styles from './ActivitiesGrid.module.css'

const activities = [
  {
    title: 'Scolaires',
    description:
      "De la maternelle au secondaire, des animations en lien avec les programmes scolaires pour découvrir la nature autrement.",
    image: 'https://cieenghien.be/wp-content/uploads/2021/06/21b.jpg',
    link: '/animations',
    linkText: 'Découvrir les programmes',
  },
  {
    title: 'Stages Vacances',
    description:
      "Durant les congés scolaires, nous accueillons vos enfants pour des semaines d'aventures, de jeux et de découvertes.",
    image: 'https://cieenghien.be/wp-content/uploads/2021/06/Image5b.jpg',
    link: '/stages',
    linkText: 'Voir les prochains stages',
  },
  {
    title: 'Formations Adultes',
    description:
      "Jardinage écologique, compostage, formation guide nature... Il n'y a pas d'âge pour apprendre !",
    image: 'https://cieenghien.be/wp-content/uploads/2021/06/Image2bb.jpg',
    link: '/formations',
    linkText: 'En savoir plus',
  },
]

/**
 * Activities Grid Section - 3 cards for Scolaires, Stages, Formations
 * Story 4.1: Create Homepage (Task 6)
 * Source: cie4/index.html lines 169-216
 */
export function ActivitiesGrid() {
  return (
    <Section>
      <Container>
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <h2>Nos Pôles d&apos;Activités</h2>
            <p>Une offre variée pour tous les publics.</p>
          </div>
        </ScrollReveal>

        <div className={styles.activitiesGrid}>
          {activities.map((activity, index) => (
            <ScrollReveal key={activity.title} delay={index * 0.1}>
              <Card className={styles.activityCard}>
                <div className={styles.activityImg}>
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <Card.Content>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <Link href={activity.link} className={styles.activityLink}>
                    {activity.linkText} &rarr;
                  </Link>
                </Card.Content>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
