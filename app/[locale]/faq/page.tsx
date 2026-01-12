import { getTranslations } from 'next-intl/server';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import { Link } from '@/components/ui/link';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { createAnonServerClient } from '@/lib/supabase/server';
import { translateContentArray } from '@/lib/google-translate/cache';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  published: boolean;
}

async function getFAQs(): Promise<FAQItem[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
  
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'faq',
    locale: locale as Locale,
    path: '/faq',
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'navigation' });
  const tp = await getTranslations({ locale, namespace: 'faqPage' });

  const faqsData = await getFAQs();
  
  // Translate FAQ questions and answers based on locale
  const faqs = await translateContentArray(
    faqsData,
    ['question', 'answer'],
    locale as 'ro' | 'hu' | 'en'
  );

  const pageLabels = {
    ro: {
      noFaqs: 'Nu există întrebări frecvente disponibile.',
      contactUs: 'Nu ați găsit răspunsul? Contactați-ne!',
      contact: 'Contact',
    },
    hu: {
      noFaqs: 'Nincsenek elérhető gyakori kérdések.',
      contactUs: 'Nem találta meg a választ? Vegye fel velünk a kapcsolatot!',
      contact: 'Kapcsolat',
    },
    en: {
      noFaqs: 'No FAQs available.',
      contactUs: "Didn't find your answer? Contact us!",
      contact: 'Contact',
    },
  };

  const labels = pageLabels[locale as keyof typeof pageLabels] || pageLabels.en;

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <>
      <Breadcrumbs items={[{ label: t('faq') }]} />
      <PageHeader titleKey="faq" icon="helpCircle" />

      <Section background="white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              {tp('description')}
            </p>

            {faqs.length > 0 ? (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.id} className="overflow-hidden">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer p-5 list-none">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                            <HelpCircle className="w-4 h-4 text-primary-600" />
                          </div>
                          <span className="font-medium text-gray-900">{faq.question}</span>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
                      </summary>
                      <CardContent className="pt-0 pb-5 px-5 pl-16">
                        <div 
                          className="text-gray-600 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </CardContent>
                    </details>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {labels.noFaqs}
              </div>
            )}

            {/* Contact CTA */}
            <Card className="mt-8 bg-primary-50 border-primary-100">
              <CardContent className="p-6 text-center">
                <p className="text-gray-700 mb-4">{labels.contactUs}</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {labels.contact}
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
