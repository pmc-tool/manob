// Home Header - Landing page header component
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './home.module.css';

interface NavLink {
  label: string;
  href: string;
}

interface HomeHeaderProps {
  navLinks?: NavLink[];
  showAuth?: boolean;
}

const defaultNavLinks: NavLink[] = [
  { label: 'Code Packs', href: '#templates' },
  { label: 'How it Works', href: '#features' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#cta' },
  { label: 'Contact', href: '#contact' },
];

export default function HomeHeader({
  navLinks = defaultNavLinks,
  showAuth = true,
}: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.homeHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.headerInner}>
          {/* Logo */}
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/images/logo-manob-full.svg"
              alt="manob.ai"
              width={140}
              height={40}
              style={{ objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          {showAuth && (
            <div className={styles.authButtons}>
              <Link href="/contact" className={styles.talkButton}>
                Talk to an engineer
              </Link>
              <Link href={isAuthenticated ? "/" : "/auth/sign-in"} className={styles.getStartedButton}>
                {isAuthenticated ? "Dashboard" : "Get started"}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className={styles.mobileMenuButton}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
