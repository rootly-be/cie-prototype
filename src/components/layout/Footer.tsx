import styles from './Footer.module.css';
import { Container } from './Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <p>
          © {currentYear} Centre d&apos;Initiation à l&apos;Environnement
          d&apos;Enghien. Tous droits réservés.
        </p>
      </Container>
    </footer>
  );
}
