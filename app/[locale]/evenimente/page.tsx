import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { PageHeader } from '@/components/pages/page-header';
import { getEvents } from '@/lib/supabase/services';
import { EventsGrid } from './events-grid';

export default async function EvenimentePage() {
  // Fetch all events from database
  const { data: events } = await getEvents({ limit: 100 });

  return (
    <>
      <PageHeader 
        titleKey="evenimente" 
        icon="calendar" 
        descriptionKey="evenimenteDesc"
      />

      <Section background="gray">
        <Container>
          <EventsGrid events={events} />
        </Container>
      </Section>
    </>
  );
}
