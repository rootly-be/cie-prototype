'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './admin.module.css'

interface NavItem {
  href: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Tableau de bord', icon: '📊' },
  { href: '/admin/animations', label: 'Animations', icon: '🎓' },
  { href: '/admin/formations', label: 'Formations', icon: '📚' },
  { href: '/admin/stages', label: 'Stages', icon: '🏕️' },
]

/**
 * Admin Layout with Sidebar Navigation
 * Story 3.7: Build Admin Content Pages
 *
 * Provides consistent navigation shell for all admin pages.
 * Uses cie4 design variables for styling.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.logo}>
            <span className={styles.logoIcon}>🌿</span>
            <span className={styles.logoText}>CIE Admin</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backLink}>
            ← Retour au site
          </Link>
        </div>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
