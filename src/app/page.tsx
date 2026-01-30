import styles from "./page.module.css";
import { Button, Badge, Card, ScrollReveal } from "@/components/ui";
import { Hero, StatsBar, Section, Container } from "@/components/layout";

export default function Home() {
  const stats = [
    { value: "20+", label: "Années d'expérience" },
    { value: "3000+", label: "Participants par an" },
    { value: "50+", label: "Animations différentes" },
  ];

  return (
    <>
      <Hero
        variant="full"
        backgroundImage="https://picsum.photos/1920/1080?random=10"
        title="CIE Enghien"
        subtitle="Centre d'Initiation à l'Environnement - Découvrez la nature avec nous"
      >
        <Button variant="primary">Découvrir nos activités</Button>
        <Button variant="outline">Agenda</Button>
      </Hero>

      <ScrollReveal>
        <StatsBar stats={stats} />
      </ScrollReveal>

      <Section>
        <Container>
          <div className={styles.sectionHeader}>
            <h2>Aperçu du Design System</h2>
            <p>
              Cette page démontre le design system cie4 avec les variables CSS,
              la typographie et les composants UI.
            </p>
          </div>
        </Container>
      </Section>

      <Section bgLight>
        <Container>
          <h3>Palette de Couleurs</h3>
          <div className={styles.colorGrid}>
            <div className={`${styles.colorSwatch} ${styles.swatchSapin}`}>
              <span>L-sapin</span>
            </div>
            <div className={`${styles.colorSwatch} ${styles.swatchFeuille}`}>
              <span>L-feuille</span>
            </div>
            <div className={`${styles.colorSwatch} ${styles.swatchEcorce}`}>
              <span>L-ecorce</span>
            </div>
            <div className={`${styles.colorSwatch} ${styles.swatchEau}`}>
              <span>L-eau</span>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h3>Boutons</h3>
          <p>Composants Button avec variantes primary, outline et disabled.</p>
          <div className={styles.buttonRow}>
            <Button variant="primary">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Container>
      </Section>

      <Section bgLight>
        <Container>
          <h3>Badges</h3>
          <p>Badges de statut pour les activités (FR29-32).</p>
          <div className={styles.badgeRow}>
            <Badge variant="nouveau" />
            <Badge variant="complet" />
            <Badge variant="dernieres-places" />
            <Badge variant="inscriptions-bientot" />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h3>Cartes</h3>
          <p>Composant Card avec image et contenu.</p>
          <div className={styles.cardGrid}>
            <ScrollReveal delay={0}>
              <Card>
                <Card.Image
                  src="https://picsum.photos/400/220?random=1"
                  alt="Animation nature"
                />
                <Card.Content>
                  <h3>Animation Nature</h3>
                  <p>
                    Découvrez la faune et la flore de notre région à travers des
                    activités ludiques.
                  </p>
                </Card.Content>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <Card>
                <Card.Image
                  src="https://picsum.photos/400/220?random=2"
                  alt="Stage découverte"
                />
                <Card.Content>
                  <h3>Stage Découverte</h3>
                  <p>
                    Une semaine immersive pour les enfants pendant les vacances
                    scolaires.
                  </p>
                </Card.Content>
              </Card>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      <Section bgLight>
        <Container>
          <p className={styles.hint}>
            Ajoutez la classe <code>dark-mode</code> au body dans DevTools pour
            tester le mode sombre. Scrollez pour voir la transition du Navbar.
          </p>
        </Container>
      </Section>
    </>
  );
}
