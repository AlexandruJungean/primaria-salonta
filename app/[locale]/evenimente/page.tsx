import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { PageHeader } from '@/components/pages/page-header';
import { getEvents } from '@/lib/supabase/services';
import { EventsGrid } from './events-grid';
import { translateContentArray } from '@/lib/google-translate/cache';
import { AdminEditButton } from '@/components/admin-edit-button';
import { AddPageCard } from '@/components/add-page-card';

export default async function EvenimentePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Fetch all events from database
  const { data: eventsData } = await getEvents();

  // Translate event titles and descriptions based on locale
  const events = await translateContentArray(
    eventsData,
    ['title', 'description', 'location'],
    locale as 'ro' | 'hu' | 'en'
  );

  return (
    <>
      <PageHeader 
        titleKey="evenimente" 
        icon="calendar" 
        descriptionKey="evenimenteDesc"
      />

      <Section background="gray">
        <Container>
          <div className="mb-6">
            <AddPageCard adminHref="/admin/evenimente/nou" label="Adaugă eveniment" />
          </div>
          <EventsGrid events={events} />
        </Container>
      </Section>
      <AdminEditButton href="/admin/evenimente" />
    </>
  );
}
