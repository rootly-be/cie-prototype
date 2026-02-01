'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/**
 * Conditionally renders Navbar and Footer based on route
 * Admin routes (/admin/*) don't show the public site chrome
 */
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    // Admin routes: no navbar/footer, just render children directly
    return <>{children}</>
  }

  // Public routes: include navbar and footer
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
