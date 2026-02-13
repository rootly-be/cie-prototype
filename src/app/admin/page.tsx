import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import styles from './admin.module.css'

// Force dynamic rendering - admin pages need real-time data
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Dashboard | CIE Enghien',
  description: 'Espace d\'administration CIE Enghien',
}

interface StatCardProps {
  title: string
  value: number
  published: number
  href: string
  icon: string
}

function StatCard({ title, value, published, href, icon }: StatCardProps) {
  return (
    <Link href={href} className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statContent}>
        <div className={styles.statTitle}>{title}</div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statMeta}>
          {published} publiés / {value - published} brouillons
        </div>
      </div>
    </Link>
  )
}

/**
 * Admin Dashboard Page
 * Story 3.7: Build Admin Content Pages
 *
 * Shows overview statistics and quick links to content management.
 */
export default async function AdminDashboard() {
  // Fetch counts for each content type
  const [
    animationsTotal,
    animationsPublished,
    formationsTotal,
    formationsPublished,
    stagesTotal,
    stagesPublished,
  ] = await Promise.all([
    prisma.animation.count(),
    prisma.animation.count({ where: { published: true } }),
    prisma.formation.count(),
    prisma.formation.count({ where: { published: true } }),
    prisma.stage.count(),
    prisma.stage.count({ where: { published: true } }),
  ])

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Tableau de bord</h1>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title="Animations"
          value={animationsTotal}
          published={animationsPublished}
          href="/admin/animations"
          icon="🎓"
        />
        <StatCard
          title="Formations"
          value={formationsTotal}
          published={formationsPublished}
          href="/admin/formations"
          icon="📚"
        />
        <StatCard
          title="Stages"
          value={stagesTotal}
          published={stagesPublished}
          href="/admin/stages"
          icon="🏕️"
        />
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Actions rapides</h2>
        <div className={styles.actionGrid}>
          <Link href="/admin/animations/new" className={styles.quickAction}>
            <span className={styles.quickActionIcon}>➕</span>
            <span>Nouvelle animation</span>
          </Link>
          <Link href="/admin/formations/new" className={styles.quickAction}>
            <span className={styles.quickActionIcon}>➕</span>
            <span>Nouvelle formation</span>
          </Link>
          <Link href="/admin/stages/new" className={styles.quickAction}>
            <span className={styles.quickActionIcon}>➕</span>
            <span>Nouveau stage</span>
          </Link>
          <Link href="/admin/team" className={styles.quickAction}>
            <span className={styles.quickActionIcon}>👥</span>
            <span>Gérer l&apos;équipe</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
