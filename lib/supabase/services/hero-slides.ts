import { createServerClient } from '@/lib/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export interface HeroSlide {
  id: string;
  slug: string;
  image_url: string;
  alt: string;
  title: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSlideTranslated {
  id: string;
  slug: string;
  image: string;
  alt: string;
  title?: string;
}

/**
 * Get all active hero slides ordered by sort_order
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  noStore();

  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching hero slides:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
}

/**
 * Get hero slides formatted for the carousel component
 */
export async function getHeroSlidesForLocale(_locale: 'ro' | 'hu' | 'en'): Promise<HeroSlideTranslated[]> {
  const slides = await getHeroSlides();

  return slides.map(slide => ({
    id: slide.slug,
    slug: slide.slug,
    image: slide.image_url,
    alt: slide.alt,
    title: slide.title || undefined,
  }));
}

/**
 * Get all hero slides (including inactive) for admin
 */
export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  noStore();

  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching all hero slides:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all hero slides:', error);
    return [];
  }
}
