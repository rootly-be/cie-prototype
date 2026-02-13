'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui';
import styles from './Navbar.module.css';

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  links?: NavLink[];
}

const defaultLinks: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/cie', label: 'Le CIE' },
  { href: '/animations', label: 'Animations' },
  { href: '/formations', label: 'Formations' },
  { href: '/stages', label: 'Stages' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar({ links = defaultLinks }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);

  // H1 Fix: Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // M2 Fix: Close menu on Escape key
  // M3 Fix: Focus trap in mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuToggleRef.current?.focus();
        return;
      }

      // Focus trap: Tab key handling
      if (event.key === 'Tab' && navLinksRef.current) {
        const focusableElements = navLinksRef.current.querySelectorAll<HTMLElement>(
          'a, button:not([disabled])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navbarClasses = [styles.navbar, isScrolled ? styles.scrolled : '']
    .filter(Boolean)
    .join(' ');

  const navLinksClasses = [
    styles.navLinks,
    isMobileMenuOpen ? styles.active : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={navbarClasses}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
          CIE Enghien
        </Link>

        <button
          ref={menuToggleRef}
          className={styles.menuToggle}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="nav-links"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <div id="nav-links" ref={navLinksRef} className={navLinksClasses}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.active : ''}
              aria-current={pathname === link.href ? 'page' : undefined}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}

          <ThemeToggle className={styles.themeToggle} />
        </div>
      </div>
    </nav>
  );
}
