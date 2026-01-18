import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/components/ui/link';
import { Calendar, User, ArrowLeft, FileText, Download, ImageIcon } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { formatArticleDate } from '@/lib/utils/format-date';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';
import { getNewsBySlug, getAllNewsSlugs } from '@/lib/supabase/services';
import { NewsImageGallery } from './news-image-gallery';
import { translateContentFields } from '@/lib/google-translate/cache';


export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const news = await getNewsBySlug(slug);
  
  if (!news) {
    return generatePageMetadata({
      pageKey: 'stiri',
      locale: locale as Locale,
      path: '/stiri',
    });
  }

  return generatePageMetadata({
    pageKey: 'stiri',
    locale: locale as Locale,
    path: `/stiri/${slug}`,
    customTitle: news.meta_title || news.title,
    customDescription: news.meta_description || news.excerpt || undefined,
  });
}

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function NewsDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const newsData = await getNewsBySlug(slug);
  const t = await getTranslations('news');
  const tCommon = await getTranslations('common');

  if (!newsData) {
    notFound();
  }

  // Translate news content based on locale
  const news = await translateContentFields(
    newsData,
    ['title', 'excerpt', 'content'],
    locale as 'ro' | 'hu' | 'en'
  );

  const backLabel = {
    ro: 'Înapoi la toate știrile',
    hu: 'Vissza az összes hírhez',
    en: 'Back to all news',
  }[locale] || 'Back';

  return (
    <>
      <Breadcrumbs items={[
        { label: t('title'), href: '/stiri' },
        { label: news.title },
      ]} />

      {/* Hero Image */}
      {news.featured_image && (
        <div className="relative h-[300px] md:h-[400px] w-full">
          <Image
            src={news.featured_image}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      )}

      <Section background="white">
        <Container>
          <article className={`max-w-5xl mx-auto ${news.featured_image ? '-mt-24 relative z-10' : ''}`}>
            {/* Article Header Card */}
            <Card className="mb-8 overflow-visible">
              <CardContent className="p-8">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {news.title}
                </h1>

                {/* Excerpt */}
                {news.excerpt && (
                  <p className="text-lg text-gray-600 mb-6">
                    {news.excerpt}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={news.published_at || news.created_at}>
                      {formatArticleDate(news.published_at || news.created_at, locale as 'ro' | 'hu' | 'en')}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Primăria Municipiului Salonta</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article Content */}
            {news.content && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {news.content}
                </p>
              </div>
            )}

            {/* Image Gallery */}
            {news.images && news.images.length > 0 && (
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary-600" />
                  Galerie foto
                </h3>
                <NewsImageGallery images={news.images} />
              </div>
            )}

            {/* Attached Documents */}
            {news.documents && news.documents.length > 0 && (
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Documente atașate
                </h3>
                <div className="space-y-2">
                  {news.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-primary-700">
                          {doc.title || doc.file_name}
                        </span>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Back Link */}
            <div className="mt-8 pt-6 border-t">
              <Link 
                href="/stiri" 
                className="text-primary-700 hover:text-primary-900 inline-flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {backLabel}
              </Link>
            </div>
          </article>
        </Container>
      </Section>
    </>
  );
}
