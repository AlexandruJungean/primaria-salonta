import { getTranslations } from 'next-intl/server';
import { Scale, ExternalLink, FileText, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getPrimaryLegislationLinks, getSecondaryLegislationLinks, type LegislationLink } from '@/lib/supabase/services';
import { translateContentArray } from '@/lib/google-translate/cache';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'legislatie',
    locale: locale as Locale,
    path: '/primaria/legislatie',
  });
}

// Helper to get the link URL (external_url has priority over file_url)
function getLinkUrl(link: LegislationLink): string | null {
  return link.external_url || link.file_url || null;
}

// Helper to check if the link is external or a file
function isExternalLink(link: LegislationLink): boolean {
  return !!link.external_url;
}

export default async function LegislatiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tl = await getTranslations({ locale, namespace: 'legislatiePage' });

  // Fetch all legislation links
  const [primaryLinksRaw, secondaryLinksRaw] = await Promise.all([
    getPrimaryLegislationLinks(),
    getSecondaryLegislationLinks(),
  ]);

  // Translate content
  const primaryLinks = await translateContentArray(
    primaryLinksRaw, 
    ['title', 'description'], 
    locale as 'ro' | 'hu' | 'en'
  );
  
  const secondaryLinks = await translateContentArray(
    secondaryLinksRaw, 
    ['title', 'description'], 
    locale as 'ro' | 'hu' | 'en'
  );

  return (
    <>
      <Breadcrumbs items={[
        { label: t('primaria'), href: '/primaria' },
        { label: t('legislatie') }
      ]} />
      <PageHeader titleKey="legislatie" icon="scale" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Primary/Featured legislation links */}
            {primaryLinks.length > 0 && (
              <div className="space-y-4">
                {primaryLinks.map((link) => (
                  <Card key={link.id} className="bg-primary-50 border-primary-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
                          <Scale className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {link.title}
                          </h2>
                          {link.description && (
                            <p className="text-gray-600 mb-4">
                              {link.description}
                            </p>
                          )}
                          {getLinkUrl(link) && (
                            <a
                              href={getLinkUrl(link)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium"
                            >
                              {tl('viewDocument')}
                              {isExternalLink(link) ? (
                                <ExternalLink className="w-4 h-4" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Secondary legislation links */}
            {secondaryLinks.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{tl('otherLegislation')}</h3>
                <div className="space-y-3">
                  {secondaryLinks.map((link) => {
                    const url = getLinkUrl(link);
                    if (!url) return null;
                    
                    return (
                      <a
                        key={link.id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isExternalLink(link) ? (
                            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600 shrink-0" />
                          ) : (
                            <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary-600 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <span className="text-gray-700 group-hover:text-primary-700 font-medium">
                              {link.title}
                            </span>
                            {link.description && (
                              <p className="text-sm text-gray-500 truncate mt-0.5">
                                {link.description}
                              </p>
                            )}
                          </div>
                        </div>
                        {isExternalLink(link) ? (
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0" />
                        ) : (
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600 shrink-0" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {primaryLinks.length === 0 && secondaryLinks.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Scale className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{tl('noLegislation')}</p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
