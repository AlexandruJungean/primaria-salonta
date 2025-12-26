import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { FULL_NAVIGATION } from '@/lib/constants/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'footer' });
  return { 
    title: t('sitemap'),
    description: 'Harta site-ului Primăriei Municipiului Salonta - toate paginile disponibile'
  };
}

export default function SitemapPage() {
  const t = useTranslations('navigation');

  return (
    <>
      <Breadcrumbs items={[{ label: 'Harta site-ului' }]} />
      <PageHeader titleKey="sitemap" namespace="footer" icon="map" />

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Găsiți rapid toate paginile disponibile pe site-ul Primăriei Municipiului Salonta.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FULL_NAVIGATION.map((section) => (
                <div key={section.id} className="space-y-3">
                  <h2 className="text-lg font-bold text-primary-900 border-b border-primary-200 pb-2">
                    <Link href={section.href} className="hover:text-primary-700">
                      {t(section.id)}
                    </Link>
                  </h2>
                  {section.children && section.children.length > 0 && (
                    <ul className="space-y-1.5">
                      {section.children.map((child) => (
                        <li key={child.id + child.href}>
                          <Link 
                            href={child.href}
                            className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full shrink-0" />
                            {t(child.id)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Additional Pages */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-primary-900 border-b border-primary-200 pb-2">
                  Informații legale
                </h2>
                <ul className="space-y-1.5">
                  <li>
                    <Link 
                      href="/politica-confidentialitate"
                      className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full shrink-0" />
                      Politica de confidențialitate
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/politica-cookies"
                      className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full shrink-0" />
                      Politica de cookies
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/accesibilitate"
                      className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full shrink-0" />
                      Accesibilitate
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

