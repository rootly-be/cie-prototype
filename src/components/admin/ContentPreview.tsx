'use client'

import styles from './admin-components.module.css'
import { Badge } from '@/components/ui'

interface AnimationPreviewProps {
  type: 'animation'
  data: {
    titre?: string
    description?: string
    niveau?: string
    categorie?: string
  }
}

interface FormationPreviewProps {
  type: 'formation'
  data: {
    titre?: string
    description?: string
    categorie?: string
  }
}

interface StagePreviewProps {
  type: 'stage'
  data: {
    titre?: string
    description?: string
    periode?: string
    ageMin?: number
    ageMax?: number
    prix?: string
    dateDebut?: string
    dateFin?: string
  }
}

type ContentPreviewProps = AnimationPreviewProps | FormationPreviewProps | StagePreviewProps

/**
 * ContentPreview Component
 * Story 3.7: FR11 - Preview before publishing
 *
 * Shows how content will appear before saving/publishing.
 */
export function ContentPreview(props: ContentPreviewProps) {
  const hasContent = props.data.titre || props.data.description

  if (!hasContent) {
    return (
      <div className={styles.preview}>
        <div className={styles.previewHeader}>
          <span className={styles.previewIcon}>👁️</span>
          <span className={styles.previewTitle}>Apercu</span>
        </div>
        <div className={styles.previewEmpty}>
          <div className={styles.previewEmptyIcon}>📝</div>
          <div>Remplissez le formulaire pour voir l&apos;apercu</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.preview}>
      <div className={styles.previewHeader}>
        <span className={styles.previewIcon}>👁️</span>
        <span className={styles.previewTitle}>Apercu</span>
      </div>

      <div className={styles.previewCard}>
        <h3 className={styles.previewCardTitle}>
          {props.data.titre || 'Sans titre'}
        </h3>

        <div className={styles.previewCardMeta}>
          {props.type === 'animation' && (
            <>
              {props.data.niveau && (
                <span className={styles.previewCardMetaItem}>
                  📚 {props.data.niveau}
                </span>
              )}
              {props.data.categorie && (
                <Badge variant="nouveau">{props.data.categorie}</Badge>
              )}
            </>
          )}

          {props.type === 'formation' && (
            <>
              {props.data.categorie && (
                <Badge variant="nouveau">{props.data.categorie}</Badge>
              )}
            </>
          )}

          {props.type === 'stage' && (
            <>
              {props.data.periode && (
                <span className={styles.previewCardMetaItem}>
                  📅 {props.data.periode}
                </span>
              )}
              {props.data.ageMin !== undefined && props.data.ageMax !== undefined && (
                <span className={styles.previewCardMetaItem}>
                  👶 {props.data.ageMin}-{props.data.ageMax} ans
                </span>
              )}
              {props.data.prix && (
                <span className={styles.previewCardMetaItem}>
                  💰 {props.data.prix}
                </span>
              )}
              {props.data.dateDebut && props.data.dateFin && (
                <span className={styles.previewCardMetaItem}>
                  🗓️ {formatDateRange(props.data.dateDebut, props.data.dateFin)}
                </span>
              )}
            </>
          )}
        </div>

        {props.data.description && (
          <p className={styles.previewCardDescription}>
            {truncateText(props.data.description, 200)}
          </p>
        )}
      </div>
    </div>
  )
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

function formatDateRange(start: string, end: string): string {
  try {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
    })
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`
  } catch {
    return `${start} - ${end}`
  }
}
