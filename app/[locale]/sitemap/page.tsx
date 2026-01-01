import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { MAIN_NAVIGATION, SECONDARY_NAVIGATION } from '@/lib/constants/navigation';

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
          <div className="max-w-6xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Găsiți rapid toate paginile disponibile pe site-ul Primăriei Municipiului Salonta.
            </p>

            {/* Main Navigation Sections */}
            <div className="space-y-10">
              {MAIN_NAVIGATION.map((section) => (
                <div key={section.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                  <h2 className="text-xl font-bold text-primary-900 mb-6 flex items-center gap-2">
                    {section.icon && <section.icon className="w-5 h-5" />}
                    <Link href={section.href} className="hover:text-primary-700">
                      {t(section.id)}
                    </Link>
                  </h2>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Groups */}
                    {section.groups?.map((group) => (
                      <div key={group.groupId} className="space-y-2">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          {group.groupIcon && <group.groupIcon className="w-4 h-4 text-primary-600" />}
                          {group.groupHref ? (
                            <Link href={group.groupHref} className="hover:text-primary-700">
                              {t(group.groupId)}
                            </Link>
                          ) : (
                            t(group.groupId)
                          )}
                        </h3>
                        <ul className="space-y-1 pl-6">
                          {group.items.map((item) => (
                            <li key={item.id + item.href}>
                              <Link 
                                href={item.href}
                                className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2"
                              >
                                <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                                {t(item.id)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Standalone Items */}
                    {section.standaloneItems && section.standaloneItems.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800">Alte pagini</h3>
                        <ul className="space-y-1 pl-6">
                          {section.standaloneItems.map((item) => (
                            <li key={item.id + item.href}>
                              <Link 
                                href={item.href}
                                className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2"
                              >
                                <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                                {t(item.id)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Secondary Navigation */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Quick Links */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Acces rapid</h3>
                  <ul className="space-y-1 pl-6">
                    {SECONDARY_NAVIGATION.map((item) => (
                      <li key={item.id}>
                        <Link 
                          href={item.href}
                          className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2"
                        >
                          <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                          {t(item.id)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Pages */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Informații legale</h3>
                  <ul className="space-y-1 pl-6">
                    <li>
                      <Link 
                        href="/politica-confidentialitate"
                        className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                        Politica de confidențialitate
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/politica-cookies"
                        className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                        Politica de cookies
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/accesibilitate"
                        className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                        Accesibilitate
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
