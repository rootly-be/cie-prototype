import styles from './Section.module.css';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  bgLight?: boolean;
  id?: string;
}

export function Section({ children, className, bgLight = false, id }: SectionProps) {
  const sectionClasses = [
    styles.section,
    bgLight ? styles.bgLight : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return <section id={id} className={sectionClasses}>{children}</section>;
}
