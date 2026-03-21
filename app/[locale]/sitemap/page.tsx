import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { SECONDARY_NAVIGATION } from '@/lib/constants/navigation';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { WebPageJsonLd } from '@/lib/seo/json-ld';
import { type Locale } from '@/i18n/routing';
import { getNavSections, getNavPagesBySection } from '@/lib/supabase/services/navigation';
import { getIcon } from '@/lib/constants/icon-map';
import { getAllNewsSlugs, getAllEventSlugs, getAllProgramSlugs, getAllInstitutionSlugs } from '@/lib/supabase/services';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'sitemap',
    locale: locale as Locale,
    path: '/sitemap',
  });
}

export default async function SitemapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  const sections = await getNavSections();
  const sectionPages = await Promise.all(
    sections.map(async (section) => ({
      section,
      pages: await getNavPagesBySection(section.slug),
    }))
  );

  const [newsSlugs, eventSlugs, programSlugs, institutionSlugs] = await Promise.all([
    getAllNewsSlugs(),
    getAllEventSlugs(),
    getAllProgramSlugs(),
    getAllInstitutionSlugs(),
  ]);

  return (
    <>
      <WebPageJsonLd
        title="Harta Site-ului"
        description="Harta completă a site-ului Primăriei Municipiului Salonta"
        url="/sitemap"
        locale={locale}
      />
      <Breadcrumbs items={[{ label: 'Harta site-ului' }]} />
      <PageHeader titleKey="sitemap" namespace="footer" icon="map" />

      <Section background="white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              Găsiți rapid toate paginile disponibile pe site-ul Primăriei Municipiului Salonta.
            </p>

            {/* Nav Sections from DB */}
            <div className="space-y-10">
              {sectionPages.filter(({ section }) => section.public_path).map(({ section, pages }) => {
                const SectionIcon = getIcon(section.icon);
                return (
                  <div key={section.slug} className="border-b border-gray-200 pb-8 last:border-b-0">
                    <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                      <SectionIcon className="w-5 h-5" />
                      <Link href={section.public_path!} className="hover:text-primary-700">
                        {section.title}
                      </Link>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1">
                      {pages.map((page) => (
                        <Link
                          key={page.id}
                          href={page.public_path || '#'}
                          className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2 py-1"
                        >
                          <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                          {page.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Dynamic content pages */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-primary-900 mb-4">Știri și Anunțuri</h2>
                <p className="text-sm text-gray-500 mb-2">{newsSlugs.length} articole publicate</p>
                <Link href="/stiri" className="text-sm text-primary-600 hover:text-primary-700">
                  Vezi toate știrile →
                </Link>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-bold text-primary-900 mb-4">Evenimente</h2>
                <p className="text-sm text-gray-500 mb-2">{eventSlugs.length} evenimente publicate</p>
                <Link href="/evenimente" className="text-sm text-primary-600 hover:text-primary-700">
                  Vezi toate evenimentele →
                </Link>
              </div>

              {programSlugs.length > 0 && (
                <div className="border-b border-gray-200 pb-8">
                  <h2 className="text-xl font-bold text-primary-900 mb-4">Programe și Strategii</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1">
                    {programSlugs.map((slug: string) => (
                      <Link key={slug} href={`/programe/${slug}`} className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2 py-1">
                        <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                        {slug}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {institutionSlugs.length > 0 && (
                <div className="border-b border-gray-200 pb-8">
                  <h2 className="text-xl font-bold text-primary-900 mb-4">Instituții</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1">
                    {institutionSlugs.map((slug: string) => (
                      <Link key={slug} href={`/institutii/${slug}`} className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2 py-1">
                        <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                        {slug}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Navigation + Legal */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Acces rapid</h3>
                  <ul className="space-y-1 pl-6">
                    {SECONDARY_NAVIGATION.map((item) => (
                      <li key={item.id}>
                        <Link href={item.href} className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2">
                          <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                          {t(item.id)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Informații legale</h3>
                  <ul className="space-y-1 pl-6">
                    {[
                      { href: '/politica-confidentialitate', label: 'Politica de confidențialitate' },
                      { href: '/politica-cookies', label: 'Politica de cookies' },
                      { href: '/accesibilitate', label: 'Accesibilitate' },
                    ].map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="text-gray-600 hover:text-primary-700 text-sm flex items-center gap-2">
                          <span className="w-1 h-1 bg-primary-400 rounded-full shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
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
