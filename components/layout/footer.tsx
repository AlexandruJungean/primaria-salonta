'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/components/ui/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { CONTACT_INFO, EXTERNAL_LINKS } from '@/lib/constants/contact';
import { useLocale } from 'next-intl';

// TikTok icon (not in Lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('navigation');
  const locale = useLocale() as 'ro' | 'hu' | 'en';
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'anunturi', href: '/transparenta/anunturi' },
    { id: 'platiOnline', href: '/servicii-online/plati' },
    { id: 'petitiiOnline', href: '/servicii-online/petitii' },
    { id: 'program', href: '/primaria/program' },
    { id: 'conducere', href: '/primaria/conducere' },
    { id: 'contact', href: '/contact' },
  ];

  return (
    <footer className="bg-primary-900 text-white">
      {/* Main Footer */}
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Logo & About */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <Image
                  src="/logo/logo-transparent.png"
                  alt="Primăria Salonta"
                  width={60}
                  height={60}
                  className="w-14 h-14"
                />
                <div>
                  <div className="font-bold text-xl leading-tight">
                    Primăria Salonta
                  </div>
                  <div className="text-sm text-primary-200">
                    Municipiul Salonta
                  </div>
                </div>
              </Link>
              <p className="text-primary-200 text-sm mb-6">
                Site-ul oficial al Primăriei Municipiului Salonta, județul Bihor, România.
              </p>

              {/* Social Media */}
              <div className="flex items-center gap-3">
                <a
                  href={CONTACT_INFO.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={CONTACT_INFO.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={CONTACT_INFO.socialMedia.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('address')}</h3>
              <ul className="space-y-3 text-primary-200">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{CONTACT_INFO.address.full}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div>{CONTACT_INFO.phone.display}</div>
                    <div className="text-sm mt-1">FAX: {CONTACT_INFO.phone.fax}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <a
                      href={`mailto:${CONTACT_INFO.email.primary}`}
                      className="hover:text-white transition-colors block"
                    >
                      {CONTACT_INFO.email.primary}
                    </a>
                    <a
                      href={`mailto:${CONTACT_INFO.email.secondary}`}
                      className="hover:text-white transition-colors block"
                    >
                      {CONTACT_INFO.email.secondary}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div>Luni - Vineri: 8:00 - 16:00</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('usefulLinks')}</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-primary-200 hover:text-white transition-colors"
                    >
                      {tNav(link.id)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* External Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Parteneriate</h3>
              <div className="space-y-4">
                {EXTERNAL_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-200 hover:text-white transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    {link.translations[locale].title}
                  </a>
                ))}
              </div>

              {/* Partner Logos */}
              <div className="mt-6 flex flex-wrap gap-3">
                {EXTERNAL_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-2 hover:shadow-lg transition-shadow"
                  >
                    <Image
                      src={link.image}
                      alt={link.translations[locale].title}
                      width={80}
                      height={40}
                      className="h-8 w-auto object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <Container>
          <div className="py-6 flex flex-col items-center gap-4 text-sm text-primary-200">
            <p className="text-center">{t('copyright', { year: currentYear })}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link href="/politica-confidentialitate" className="hover:text-white transition-colors whitespace-nowrap">
                {t('privacyPolicy')}
              </Link>
              <span className="hidden sm:inline text-white/30">|</span>
              <Link href="/politica-cookies" className="hover:text-white transition-colors whitespace-nowrap">
                {t('cookiePolicy')}
              </Link>
              <span className="hidden sm:inline text-white/30">|</span>
              <Link href="/accesibilitate" className="hover:text-white transition-colors whitespace-nowrap">
                {t('accessibility')}
              </Link>
              <span className="hidden sm:inline text-white/30">|</span>
              <Link href="/sitemap" className="hover:text-white transition-colors whitespace-nowrap">
                {t('sitemap')}
              </Link>
            </div>
            <p className="text-xs text-primary-300/70">
              {t('developedBy')}{' '}
              <a 
                href="https://alexjungean.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Alexandru Jungean
              </a>
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

