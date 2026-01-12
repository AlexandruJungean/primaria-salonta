import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin client inside functions to ensure env vars are loaded
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(url, key);
}

// GET - List gallery images
export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('page_images')
      .select('*')
      .eq('page_slug', 'galerie')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error loading gallery:', error);
    return NextResponse.json(
      { error: 'Failed to load gallery' },
      { status: 500 }
    );
  }
}

// POST - Add new image
export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await request.json();
    const { image_url, alt_text, sort_order } = body;

    const { data, error } = await supabaseAdmin
      .from('page_images')
      .insert({
        page_slug: 'galerie',
        image_url,
        alt_text,
        sort_order,
        published: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error adding image:', error);
    return NextResponse.json(
      { error: 'Failed to add image' },
      { status: 500 }
    );
  }
}

// DELETE - Remove image
export async function DELETE(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const imageUrl = searchParams.get('image_url');

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID required' },
        { status: 400 }
      );
    }

    // Delete from database
    const { error } = await supabaseAdmin
      .from('page_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    // Try to delete from storage too
    if (imageUrl) {
      try {
        const urlParts = imageUrl.split('/photos/');
        if (urlParts.length > 1) {
          const storagePath = urlParts[1];
          await supabaseAdmin.storage.from('photos').remove([storagePath]);
        }
      } catch (storageError) {
        console.warn('Could not delete from storage:', storageError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
