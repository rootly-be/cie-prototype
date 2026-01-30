import Image from 'next/image';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, hoverable = true }: CardProps) {
  const cardClasses = [
    styles.card,
    hoverable ? styles.hoverable : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={cardClasses}>{children}</div>;
}

export function CardImage({ src, alt, className }: CardImageProps) {
  const imageClasses = [styles.cardImage, className || '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={imageClasses}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 400px" />
    </div>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  const contentClasses = [styles.cardContent, className || '']
    .filter(Boolean)
    .join(' ');

  return <div className={contentClasses}>{children}</div>;
}

// Compound component pattern for Card
Card.Image = CardImage;
Card.Content = CardContent;
