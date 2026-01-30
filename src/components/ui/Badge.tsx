import styles from './Badge.module.css';

type BadgeVariant = 'nouveau' | 'complet' | 'dernieres-places' | 'inscriptions-bientot';

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

const defaultLabels: Record<BadgeVariant, string> = {
  nouveau: 'Nouveau',
  complet: 'Complet',
  'dernieres-places': 'Dernières places',
  'inscriptions-bientot': 'Inscriptions bientôt',
};

const ariaLabels: Record<BadgeVariant, string> = {
  nouveau: 'Nouvelle activité ajoutée récemment',
  complet: 'Activité complète, plus de places disponibles',
  'dernieres-places': 'Dernières places disponibles, inscrivez-vous vite',
  'inscriptions-bientot': 'Les inscriptions ouvriront bientôt',
};

export function Badge({ variant, children, className }: BadgeProps) {
  const variantClass = {
    nouveau: styles.nouveau,
    complet: styles.complet,
    'dernieres-places': styles.dernieresPlaces,
    'inscriptions-bientot': styles.inscriptionsBientot,
  }[variant];

  const badgeClasses = [styles.badge, variantClass, className || '']
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClasses} aria-label={ariaLabels[variant]}>
      {children || defaultLabels[variant]}
    </span>
  );
}
