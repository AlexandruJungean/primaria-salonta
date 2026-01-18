import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth/verify-admin';
import { revalidatePath } from 'next/cache';
import { deleteFile } from '@/lib/cloudflare/r2-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - List all hero slides (including inactive)
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching hero slides:', error);
      return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET hero-slides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new hero slide
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { slug, image_url, alt, title, sort_order, is_active } = body;

    if (!slug || !image_url || !alt) {
      return NextResponse.json(
        { error: 'Slug, imagine și text alternativ sunt obligatorii' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('hero_slides')
      .insert({
        slug,
        image_url,
        alt,
        title: title || null,
        sort_order: sort_order ?? 0,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating hero slide:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Un slide cu acest slug există deja' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to create hero slide' }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/ro');
    revalidatePath('/hu');
    revalidatePath('/en');

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST hero-slides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update hero slide
export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { id, slug, image_url, alt, title, sort_order, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (slug !== undefined) updateData.slug = slug;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (alt !== undefined) updateData.alt = alt;
    if (title !== undefined) updateData.title = title || null;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabase
      .from('hero_slides')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating hero slide:', error);
      return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/ro');
    revalidatePath('/hu');
    revalidatePath('/en');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT hero-slides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update sort order for multiple slides
export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { slides } = body; // Array of { id, sort_order }

    if (!Array.isArray(slides)) {
      return NextResponse.json({ error: 'Slides array is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Update each slide's sort_order
    for (const slide of slides) {
      const { error } = await supabase
        .from('hero_slides')
        .update({ sort_order: slide.sort_order, updated_at: new Date().toISOString() })
        .eq('id', slide.id);

      if (error) {
        console.error('Error updating slide order:', error);
        return NextResponse.json({ error: 'Failed to update slide order' }, { status: 500 });
      }
    }

    revalidatePath('/');
    revalidatePath('/ro');
    revalidatePath('/hu');
    revalidatePath('/en');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PATCH hero-slides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete hero slide
export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get the slide first to get the image URL for cleanup
    const { data: slide } = await supabase
      .from('hero_slides')
      .select('image_url')
      .eq('id', id)
      .single();

    // Delete from database
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting hero slide:', error);
      return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
    }

    // Try to delete the image from R2 if it's stored there (not a /images/ path)
    if (slide?.image_url && !slide.image_url.startsWith('/images/')) {
      try {
        // Extract key from URL
        const url = new URL(slide.image_url);
        const key = url.pathname.substring(1); // Remove leading /
        await deleteFile(key);
      } catch (deleteError) {
        // Log but don't fail the request
        console.warn('Failed to delete image from R2:', deleteError);
      }
    }

    revalidatePath('/');
    revalidatePath('/ro');
    revalidatePath('/hu');
    revalidatePath('/en');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE hero-slides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
