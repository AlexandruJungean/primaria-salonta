'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants/contact';
import { Link } from '@/components/ui/link';

export function ContactInfoSection() {
  const t = useTranslations('footer');

  return (
    <Section background="gray">
      <Container>
        <SectionHeader 
          title={t('address')} 
          subtitle={t('contactUs')} 
        />
        
        {/* Contact Info Grid with Schema.org markup */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          itemScope 
          itemType="https://schema.org/GovernmentOrganization"
        >
          {/* Hidden schema.org properties */}
          <meta itemProp="name" content="Primăria Municipiului Salonta" />
          <meta itemProp="url" content="https://salonta.ro" />
          
          {/* Address Card */}
          <div 
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('address')}</h3>
                <address className="not-italic text-gray-600 text-sm leading-relaxed">
                  <span itemProp="streetAddress">{CONTACT_INFO.address.street}</span><br />
                  <span itemProp="addressLocality">{CONTACT_INFO.address.city}</span>, 
                  <span itemProp="addressRegion"> {CONTACT_INFO.address.county}</span><br />
                  <span itemProp="postalCode">{CONTACT_INFO.address.postalCode}</span>, 
                  <span itemProp="addressCountry"> România</span>
                </address>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-secondary-100 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('phone')}</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  {CONTACT_INFO.phone.landline.map((phone, index) => (
                    <a 
                      key={index}
                      href={`tel:${phone.replace(/-/g, '')}`}
                      className="block hover:text-primary-600 transition-colors"
                      itemProp="telephone"
                    >
                      {phone}
                    </a>
                  ))}
                  <div className="text-xs text-gray-500 mt-1">
                    FAX: {CONTACT_INFO.phone.fax}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('email')}</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  <a 
                    href={`mailto:${CONTACT_INFO.email.primary}`}
                    className="block hover:text-primary-600 transition-colors break-all"
                    itemProp="email"
                  >
                    {CONTACT_INFO.email.primary}
                  </a>
                  <a 
                    href={`mailto:${CONTACT_INFO.email.secondary}`}
                    className="block hover:text-primary-600 transition-colors break-all"
                    itemProp="email"
                  >
                    {CONTACT_INFO.email.secondary}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hours Card */}
          <div 
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            itemProp="openingHoursSpecification"
            itemScope
            itemType="https://schema.org/OpeningHoursSpecification"
          >
            <meta itemProp="dayOfWeek" content="Monday Tuesday Wednesday Thursday Friday" />
            <meta itemProp="opens" content="08:00" />
            <meta itemProp="closes" content="16:00" />
            
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('program')}</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  <div>
                    <span className="font-medium">Luni - Vineri:</span><br />
                    08:00 - 16:00
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Sâmbătă - Duminică: Închis
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View More Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            {t('contactPage')}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

