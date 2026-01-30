import styles from './Hero.module.css';

interface HeroProps {
  variant?: 'full' | 'page';
  backgroundImage: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Hero({
  variant = 'full',
  backgroundImage,
  title,
  subtitle,
  children,
}: HeroProps) {
  const heroClasses = [
    styles.hero,
    variant === 'page' ? styles.pageHeader : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={heroClasses}>
      <div
        className={styles.heroBg}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className={styles.heroContent}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children && <div className={styles.heroActions}>{children}</div>}
      </div>
    </div>
  );
}
