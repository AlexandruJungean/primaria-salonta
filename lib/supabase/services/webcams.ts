import { createAnonServerClient } from '../server';

export interface Webcam {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  stream_url: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

/**
 * Get all active webcams
 */
export async function getWebcams(): Promise<Webcam[]> {
  const supabase = createAnonServerClient();
  
  const { data, error } = await supabase
    .from('webcams')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching webcams:', error);
    return [];
  }

  return data || [];
}
