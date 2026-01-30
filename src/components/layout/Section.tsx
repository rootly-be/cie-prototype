import styles from './Section.module.css';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  bgLight?: boolean;
}

export function Section({ children, className, bgLight = false }: SectionProps) {
  const sectionClasses = [
    styles.section,
    bgLight ? styles.bgLight : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return <section className={sectionClasses}>{children}</section>;
}
