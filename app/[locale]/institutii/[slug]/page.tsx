import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { 
  MapPin, Phone, Mail, Globe, Clock, User, 
  Building, Waves, Leaf, Heart, BookOpen, 
  Utensils, Users, Landmark, Facebook
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ClickableImage } from '@/components/ui/clickable-image';
import * as institutionsService from '@/lib/supabase/services/institutions';
import type { Locale } from '@/lib/seo/config';
import { translateContentFields } from '@/lib/google-translate/cache';

// Icon mapping
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  building: Building,
  waves: Waves,
  bird: Leaf,
  leaf: Leaf,
  heart: Heart,
  bookOpen: BookOpen,
  utensils: Utensils,
  users: Users,
  landmark: Landmark,
  mapPin: MapPin,
  phone: Phone,
  mail: Mail,
  globe: Globe,
  clock: Clock,
  user: User,
  facebook: Facebook,
};

function getIcon(iconName: string) {
  return ICONS[iconName] || Building;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const institution = await institutionsService.getInstitutionBySlug(slug);
  
  if (!institution) {
    return { title: 'Not Found' };
  }
  
  return {
    title: institution.name,
    description: institution.short_description || institution.name,
  };
}

export async function generateStaticParams() {
  const slugs = await institutionsService.getAllInstitutionSlugs();
  const locales = ['ro', 'en', 'hu'];
  
  return locales.flatMap(locale => 
    slugs.map(slug => ({ locale, slug }))
  );
}

export default async function InstitutionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const institutionData = await institutionsService.getInstitutionBySlug(slug);
  
  if (!institutionData) {
    notFound();
  }
  
  // Translate content based on locale
  // NOT translated: director_name (person name), address (proper noun - street names)
  // Translated: working_hours (contains day names like Luni, Marți)
  const institution = await translateContentFields(
    institutionData,
    ['name', 'short_description', 'working_hours', 'director_title'],
    locale as 'ro' | 'hu' | 'en'
  );
  
  const t = await getTranslations({ locale, namespace: 'navigation' });
  
  const IconComponent = getIcon(institution.icon);
  
  // Localized labels
  const labels: Record<string, Record<string, string>> = {
    ro: {
      address: 'Adresă',
      phone: 'Telefon',
      email: 'Email',
      website: 'Website',
      facebook: 'Facebook',
      workingHours: 'Program',
      contact: 'Contact',
      director: 'Director',
      fiscalCode: 'Cod fiscal',
    },
    en: {
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      website: 'Website',
      facebook: 'Facebook',
      workingHours: 'Working Hours',
      contact: 'Contact',
      director: 'Director',
      fiscalCode: 'Tax ID',
    },
    hu: {
      address: 'Cím',
      phone: 'Telefon',
      email: 'E-mail',
      website: 'Weboldal',
      facebook: 'Facebook',
      workingHours: 'Nyitvatartás',
      contact: 'Kapcsolat',
      director: 'Igazgató',
      fiscalCode: 'Adószám',
    },
  };
  
  const l = labels[locale] || labels.ro;

  return (
    <>
      <Breadcrumbs items={[
        { label: t('institutii'), href: '/institutii' },
        { label: institution.name }
      ]} />
      
      {/* Custom page header with institution name */}
      <Section background="gradient" className="py-12 md:py-16">
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{institution.name}</h1>
          </div>
          {institution.short_description && (
            <p className="text-white/80 text-lg max-w-3xl">{institution.short_description}</p>
          )}
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Info Cards */}
            {(institution.info_cards?.length > 0 || institution.address || institution.phone || institution.email) && (
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {institution.address && (
                  <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <MapPin className="w-5 h-5 text-primary-600 shrink-0" />
                      <span className="text-sm">{institution.address}</span>
                    </CardContent>
                  </Card>
                )}
                {institution.phone && (
                  <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <Phone className="w-5 h-5 text-primary-600 shrink-0" />
                      <a href={`tel:${institution.phone}`} className="text-sm hover:text-primary-600">
                        {institution.phone}
                      </a>
                    </CardContent>
                  </Card>
                )}
                {institution.email && (
                  <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <Mail className="w-5 h-5 text-primary-600 shrink-0" />
                      <a href={`mailto:${institution.email}`} className="text-sm hover:text-primary-600 break-all">
                        {institution.email}
                      </a>
                    </CardContent>
                  </Card>
                )}
                {institution.facebook && (
                  <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <Facebook className="w-5 h-5 text-primary-600 shrink-0" />
                      <a href={institution.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        Facebook
                      </a>
                    </CardContent>
                  </Card>
                )}
                {institution.working_hours && (
                  <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                      <Clock className="w-5 h-5 text-primary-600 shrink-0" />
                      <span className="text-sm whitespace-pre-line">{institution.working_hours}</span>
                    </CardContent>
                  </Card>
                )}
                {/* Custom info cards from database */}
                {institution.info_cards?.map((card, index) => {
                  const CardIcon = getIcon(card.icon);
                  return (
                    <Card key={index}>
                      <CardContent className="flex items-center gap-4 pt-6">
                        <CardIcon className="w-5 h-5 text-primary-600 shrink-0" />
                        <div className="text-sm">
                          {card.label && <span className="text-gray-500">{card.label}: </span>}
                          <span>{card.value}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Content sections - rendered in order as defined in admin */}
            <div className="prose prose-lg max-w-none">
              {/* If there's a primary image and first section is text/heading, show them side by side */}
              {institution.image_url && institution.content?.[0] && 
               (institution.content[0].type === 'text' || institution.content[0].type === 'heading') && (
                <div className="grid lg:grid-cols-2 gap-8 mb-10 not-prose">
                  {/* Primary Image */}
                  <ClickableImage
                    src={institution.image_url}
                    alt={institution.name}
                    aspectRatio="4/3"
                    className="rounded-xl"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  
                  {/* First content section */}
                  <div>
                    {institution.content[0].type === 'heading' && institution.content[0].title && (
                      <h2 className="text-2xl font-bold text-primary-800 mb-4">{institution.content[0].title}</h2>
                    )}
                    {institution.content[0].type === 'text' && (
                      <>
                        {institution.content[0].title && (
                          <h2 className="text-xl font-semibold text-primary-800 mb-4">{institution.content[0].title}</h2>
                        )}
                        {institution.content[0].content && (
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {institution.content[0].content}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* If there's a primary image but no content, show image full width */}
              {institution.image_url && (!institution.content || institution.content.length === 0) && (
                <div className="mb-10 not-prose">
                  <ClickableImage
                    src={institution.image_url}
                    alt={institution.name}
                    aspectRatio="video"
                    className="rounded-xl"
                    sizes="100vw"
                  />
                </div>
              )}

              {/* If there's a primary image but first section is image/list, show primary image first then content */}
              {institution.image_url && institution.content?.[0] && 
               (institution.content[0].type === 'image' || institution.content[0].type === 'list') && (
                <div className="mb-10 not-prose">
                  <ClickableImage
                    src={institution.image_url}
                    alt={institution.name}
                    aspectRatio="video"
                    className="rounded-xl"
                    sizes="100vw"
                  />
                </div>
              )}

              {/* Remaining content sections (skip first if it was shown in the grid above) */}
              {institution.content?.map((section, index) => {
                // Skip first section if it was already shown in the 2-column layout
                const skipFirst = institution.image_url && 
                  (institution.content?.[0]?.type === 'text' || institution.content?.[0]?.type === 'heading');
                if (index === 0 && skipFirst) return null;

                return (
                  <div key={section.id || index} className="mb-8">
                    {/* Heading type - just a title */}
                    {section.type === 'heading' && section.title && (
                      <h2 className="text-2xl font-bold text-primary-800 mb-4">{section.title}</h2>
                    )}

                    {/* Text type - title + content */}
                    {section.type === 'text' && (
                      <>
                        {section.title && <h2 className="text-xl font-semibold text-primary-800 mb-4">{section.title}</h2>}
                        {section.content && (
                          <p className="whitespace-pre-line text-gray-700 leading-relaxed">{section.content}</p>
                        )}
                      </>
                    )}

                    {/* Image type - image with optional title and caption */}
                    {section.type === 'image' && section.image_url && (
                      <figure className="my-8 not-prose">
                        {section.title && (
                          <h3 className="text-lg font-semibold text-primary-800 mb-3">{section.title}</h3>
                        )}
                        <ClickableImage
                          src={section.image_url}
                          alt={section.title || section.caption || 'Imagine'}
                          aspectRatio="video"
                          className="rounded-xl"
                          sizes="100vw"
                          caption={section.caption}
                        />
                      </figure>
                    )}
                    
                    {/* List type */}
                    {section.type === 'list' && section.items && (
                      <>
                        {section.title && <h3 className="text-lg font-semibold text-primary-800 mb-3">{section.title}</h3>}
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {section.items.map((item, itemIndex) => (
                            item.text ? <li key={itemIndex}>{item.text}</li> : null
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Director info */}
              {institution.director_name && (
                <div className="mb-8 not-prose">
                  <h3 className="text-lg font-semibold text-primary-800 mb-2">{l.director}</h3>
                  <p className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-primary-600" />
                    <span>{institution.director_name}</span>
                    {institution.director_title && (
                      <span className="text-gray-500">- {institution.director_title}</span>
                    )}
                  </p>
                </div>
              )}

              {/* Additional contacts */}
              {institution.contacts?.length > 0 && (
                <div className="mb-8 not-prose">
                  <h3 className="text-lg font-semibold text-primary-800 mb-4">{l.contact}</h3>
                  <ul className="space-y-3">
                    {institution.contacts.map((contact, index) => (
                      <li key={index} className="border-l-2 border-primary-200 pl-4">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        {contact.role && <p className="text-sm text-gray-500">{contact.role}</p>}
                        {contact.phone && (
                          <p className="text-sm flex items-center gap-2 mt-1">
                            <Phone className="w-3 h-3 text-primary-600" />
                            <a href={`tel:${contact.phone}`} className="text-gray-700 hover:text-primary-600">{contact.phone}</a>
                          </p>
                        )}
                        {contact.email && (
                          <p className="text-sm flex items-center gap-2">
                            <Mail className="w-3 h-3 text-primary-600" />
                            <a href={`mailto:${contact.email}`} className="text-gray-700 hover:text-primary-600">{contact.email}</a>
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fiscal code if present */}
              {institution.fiscal_code && (
                <div className="mb-8 not-prose">
                  <p className="text-sm text-gray-500">
                    {l.fiscalCode}: {institution.fiscal_code}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
