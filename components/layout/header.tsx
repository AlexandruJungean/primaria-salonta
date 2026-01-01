'use client';

import { Link } from '@/components/ui/link';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { MegaMenu } from './mega-menu';
import { MobileNav } from './mobile-nav';
import { LanguageSwitcher } from './language-switcher';
import { cn } from '@/lib/utils/cn';
import { useState, useEffect } from 'react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white'
      )}
    >
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary-900 text-white py-2 overflow-visible">
        <Container className="overflow-visible">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span>📍 Str. Republicii nr.1, Salonta, Jud.Bihor</span>
              <span>📞 0359-409730, 0359-409731</span>
              <span>✉️ primsal3@gmail.com</span>
            </div>
            <div className="flex items-center gap-4 overflow-visible">
              <a
                href="https://www.facebook.com/PrimariaSalontaNagyszalontaPolgarmesteriHivatala"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-300 transition-colors"
                aria-label="Facebook"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/primaria.municipiuluisalonta/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-300 transition-colors"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@primariasalonta_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-300 transition-colors"
                aria-label="TikTok"
              >
                TikTok
              </a>
              <div className="border-l border-white/30 pl-4 overflow-visible">
                <LanguageSwitcher variant="topbar" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Header */}
      <Container>
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo/logo-transparent.png"
              alt="Primăria Salonta"
              width={50}
              height={50}
              className="w-10 h-10 lg:w-12 lg:h-12"
              priority
            />
            <div className="hidden sm:block">
              <div className="font-bold text-primary-900 text-lg leading-tight">
                Primăria Salonta
              </div>
              <div className="text-xs text-gray-500 hidden md:block">
                Municipiul Salonta
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden lg:block">
            <MegaMenu />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher - Mobile Only (desktop has it in top bar) */}
            <div className="lg:hidden">
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu */}
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}

