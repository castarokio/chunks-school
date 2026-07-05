'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

const navLinks = [
  { key: 'home', labelKey: 'nav.home', href: '#home' },
  { key: 'courses', labelKey: 'nav.courses', href: '#courses' },
  { key: 'about', labelKey: 'nav.about', href: '#about' },
  { key: 'contact', labelKey: 'nav.contact', href: '#contact' },
];
const sectionIds = ['home', 'courses', 'about', 'contact'] as const;
const sectionIdsFromBottom = [...sectionIds].reverse();

export default function Navbar() {
  const { language, setCurrentView } = useAppStore();
  const rtl = isRTL(language);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 50;
        setScrolled((current) => (current === nextScrolled ? current : nextScrolled));

        for (const section of sectionIdsFromBottom) {
          const el = document.getElementById(section);
          if (el && window.scrollY >= el.offsetTop - 120) {
            setActiveLink((current) => (current === section ? current : section));
            break;
          }
        }
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? 'border-b border-border/70 bg-background/96 shadow-[0_10px_28px_rgba(16,42,67,0.07)]'
          : 'bg-transparent'
      }`}
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/champs-logo.png"
              alt="Champs School"
              width={40}
              height={40}
              loading="eager"
              sizes="40px"
              className="size-10 object-contain"
            />
            <span
              className={`font-black tracking-normal ${
                scrolled
                  ? 'text-primary'
                  : 'text-primary'
              } transition-colors`}
              translate="no"
            >
              Champs School
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setActiveLink(link.key)}
                className={`relative rounded-md px-4 py-2 text-sm font-bold transition-[color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeLink === link.key
                    ? scrolled
                      ? 'text-primary'
                      : 'text-primary'
                    : scrolled
                      ? 'text-muted-foreground hover:bg-secondary hover:text-primary'
                      : 'text-foreground/80 hover:bg-card/70 hover:text-primary'
                }`}
              >
                {t(link.labelKey, language)}
                {activeLink === link.key && (
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-5/6 -translate-x-1/2 rounded-full bg-accent"
                  />
                )}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('login')}
                className={
                  scrolled
                    ? 'text-foreground hover:bg-secondary'
                    : 'text-foreground hover:bg-card/70'
                }
              >
                {t('nav.login', language)}
              </Button>
              <Button
                size="sm"
                onClick={() => setCurrentView('register')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t('nav.register', language)}
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={
                      scrolled
                        ? 'text-foreground'
                        : 'text-foreground'
                    }
                    aria-label="Open Navigation Menu"
                  >
                    <Menu className="size-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={rtl ? 'right' : 'left'}
                  className="w-80 bg-background"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex flex-col gap-6 mt-8">
                    {/* Logo in mobile menu */}
                    <div className="flex items-center gap-2 px-2">
                      <Image
                        src="/champs-logo.png"
                        alt="Champs School"
                        width={36}
                        height={36}
                        sizes="36px"
                        className="size-9 object-contain"
                      />
                      <span className="text-lg font-black text-primary" translate="no">
                        Champs School
                      </span>
                    </div>

                    {/* Nav links */}
                    <div className="flex flex-col gap-1">
                      {navLinks.map((link) => (
                        <a
                          key={link.key}
                          href={link.href}
                          onClick={() => {
                            setActiveLink(link.key);
                            setMobileOpen(false);
                          }}
                          className={`rounded-md px-4 py-3 text-sm font-bold transition-colors ${
                            activeLink === link.key
                              ? 'bg-secondary text-primary'
                              : 'text-muted-foreground hover:bg-secondary hover:text-primary'
                          }`}
                        >
                          {t(link.labelKey, language)}
                        </a>
                      ))}
                    </div>

                    {/* Auth buttons */}
                    <div className="flex flex-col gap-2 px-2">
                      <Button
                        variant="outline"
                        onClick={() => { setCurrentView('login'); setMobileOpen(false); }}
                        className="w-full"
                      >
                        {t('nav.login', language)}
                      </Button>
                      <Button
                        onClick={() => { setCurrentView('register'); setMobileOpen(false); }}
                        className="w-full"
                      >
                        {t('nav.register', language)}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
