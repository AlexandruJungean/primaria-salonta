import { createAnonServerClient } from '../server';
import type { Event, EventWithImages, PaginatedResponse } from '@/lib/types/database';

const DEFAULT_LIMIT = 12;

interface EventsFilter {
  page?: number;
  limit?: number;
  eventType?: Event['event_type'];
  upcoming?: boolean;
}

/**
 * Get paginated events list
 */
export async function getEvents(filter: EventsFilter = {}): Promise<PaginatedResponse<Event>> {
  const supabase = createAnonServerClient();
  const { page = 1, limit = DEFAULT_LIMIT, eventType, upcoming } = filter;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .eq('published', true);

  if (eventType) {
    query = query.eq('event_type', eventType);
  }

  if (upcoming) {
    const today = new Date().toISOString().split('T')[0];
    query = query.gte('start_date', today);
  }

  query = query.order('start_date', { ascending: upcoming ?? true });

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching events:', error);
    return { data: [], count: 0, page, limit, totalPages: 0 };
  }

  const totalCount = count || 0;

  return {
    data: data || [],
    count: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Get upcoming events for homepage
 */
export async function getUpcomingEvents(count: number = 4): Promise<Event[]> {
  const supabase = createAnonServerClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .gte('start_date', today)
    .order('start_date', { ascending: true })
    .limit(count);

  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }

  return data || [];
}

/**
 * Get featured events
 */
export async function getFeaturedEvents(count: number = 4): Promise<Event[]> {
  const supabase = createAnonServerClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .gte('start_date', today)
    .order('start_date', { ascending: true })
    .limit(count);

  if (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }

  return data || [];
}

/**
 * Get single event by slug with images
 */
export async function getEventBySlug(slug: string): Promise<EventWithImages | null> {
  const supabase = createAnonServerClient();

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (eventError || !event) {
    console.error('Error fetching event by slug:', eventError);
    return null;
  }

  // Get images for this event
  const { data: images } = await supabase
    .from('event_images')
    .select('*')
    .eq('event_id', event.id)
    .order('sort_order');

  return {
    ...event,
    images: images || [],
  };
}

/**
 * Get events by type
 */
export async function getEventsByType(
  eventType: Event['event_type']
): Promise<Event[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .eq('event_type', eventType)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching events by type:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all event slugs for static generation
 */
export async function getAllEventSlugs(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('events')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('Error fetching event slugs:', error);
    return [];
  }

  return data?.map(e => e.slug) || [];
}

/**
 * Event type categories with translations and colors
 */
export const EVENT_TYPE_CONFIG = {
  cultural: {
    color: 'bg-purple-100 text-purple-800',
    translations: {
      ro: 'Cultural',
      hu: 'Kulturális',
      en: 'Cultural',
    },
  },
  sportiv: {
    color: 'bg-red-100 text-red-800',
    translations: {
      ro: 'Sportiv',
      hu: 'Sport',
      en: 'Sports',
    },
  },
  civic: {
    color: 'bg-green-100 text-green-800',
    translations: {
      ro: 'Civic',
      hu: 'Közösségi',
      en: 'Civic',
    },
  },
  educational: {
    color: 'bg-blue-100 text-blue-800',
    translations: {
      ro: 'Educațional',
      hu: 'Oktatási',
      en: 'Educational',
    },
  },
  administrativ: {
    color: 'bg-slate-100 text-slate-800',
    translations: {
      ro: 'Administrativ',
      hu: 'Adminisztratív',
      en: 'Administrative',
    },
  },
  festival: {
    color: 'bg-orange-100 text-orange-800',
    translations: {
      ro: 'Festival',
      hu: 'Fesztivál',
      en: 'Festival',
    },
  },
  altele: {
    color: 'bg-gray-100 text-gray-800',
    translations: {
      ro: 'Altele',
      hu: 'Egyéb',
      en: 'Other',
    },
  },
} as const;
