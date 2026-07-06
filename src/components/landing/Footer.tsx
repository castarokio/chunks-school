'use client';

import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';

const quickLinks = [
  { labelKey: 'nav.home', href: '#home' },
  { labelKey: 'nav.courses', href: '#courses' },
  { labelKey: 'nav.about', href: '#about' },
  { labelKey: 'nav.contact', href: '#contact' },
];

const resourceLinks = [
  { label: 'الشروط والأحكام', labelEn: 'Terms & Conditions', labelFr: 'Conditions Générales', href: '#' },
  { label: 'سياسة الخصوصية', labelEn: 'Privacy Policy', labelFr: 'Politique de Confidentialité', href: '#' },
  { label: 'الأسئلة الشائعة', labelEn: 'FAQ', labelFr: 'FAQ', href: '#' },
  { label: 'الدعم الفني', labelEn: 'Support', labelFr: 'Support', href: '#' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

export default function Footer() {
  const { language } = useAppStore();
  const rtl = isRTL(language);

  const getResourceLabel = (link: typeof resourceLinks[0]) => {
    if (language === 'ar') return link.label;
    if (language === 'fr') return link.labelFr;
    return link.labelEn;
  };

  return (
    <footer
      className="bg-primary text-primary-foreground"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/champs-logo.png"
                alt="Chunks School"
                width={40}
                height={40}
                sizes="40px"
                className="size-10 object-contain"
              />
              <span className="text-xl font-black" translate="no">Chunks School</span>
            </div>
            <p className="mb-6 text-sm leading-7 text-primary-foreground/70">
              {language === 'ar'
                ? 'منصة تعليمية متقدمة تجمع بين التكنولوجيا الحديثة وأساليب التعلم المبتكرة لتقديم تجربة تعليمية فريدة.'
                : language === 'fr'
                  ? 'Une plateforme éducative avancée combinant technologie moderne et méthodes d\'apprentissage innovantes.'
                  : 'An advanced educational platform combining modern technology and innovative learning methods for a unique experience.'}
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="group flex size-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent"
                  >
                    <Icon className="size-4 text-primary-foreground/80 transition-colors group-hover:text-accent-foreground" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-black text-accent">
              {language === 'ar' ? 'روابط سريعة' : language === 'fr' ? 'Liens Rapides' : 'Quick Links'}
            </h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.labelKey}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {t(link.labelKey, language)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-lg font-black text-accent">
              {language === 'ar' ? 'الموارد' : language === 'fr' ? 'Ressources' : 'Resources'}
            </h3>
            <ul className="flex flex-col gap-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {getResourceLabel(link)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-black text-accent">
              {language === 'ar' ? 'تواصل معنا' : language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <MapPin className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  {language === 'ar'
                    ? 'الجزائر العاصمة، الجزائر'
                    : language === 'fr'
                      ? 'Alger Centre, Algérie'
                      : 'Algiers, Algeria'}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span dir="ltr">+213 XX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>info@chunks.school</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-6 bg-primary-foreground/15" />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-primary-foreground/55 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Chunks School. {t('footer.rights', language)}
          </p>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-accent">
              {t('footer.privacy', language)}
            </a>
            <a href="#" className="transition-colors hover:text-accent">
              {t('footer.terms', language)}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
