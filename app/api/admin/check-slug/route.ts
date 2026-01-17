import { NextRequest, NextResponse } from 'next/server';
import { validateSlugComplete, SlugTable, generateSlug } from '@/lib/validations/slug';
import { requireAdmin } from '@/lib/auth/verify-admin';

/**
 * API pentru verificarea unicității slug-urilor
 * 
 * GET /api/admin/check-slug?table=news&slug=my-slug&excludeId=xxx
 */
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table') as SlugTable;
    const slug = searchParams.get('slug');
    const excludeId = searchParams.get('excludeId') || undefined;

    if (!table || !slug) {
      return NextResponse.json(
        { error: 'Parametrii table și slug sunt obligatorii' },
        { status: 400 }
      );
    }

    // Validează că tabela e una permisă
    const validTables: SlugTable[] = [
      'news', 'events', 'programs', 'council_sessions',
      'job_vacancies', 'institutions', 'pages',
      'regional_projects', 'european_projects'
    ];

    if (!validTables.includes(table)) {
      return NextResponse.json(
        { error: 'Tabelă invalidă' },
        { status: 400 }
      );
    }

    const result = await validateSlugComplete(table, slug, excludeId);

    return NextResponse.json({
      valid: result.valid,
      error: result.error,
      slug: slug,
      normalizedSlug: generateSlug(slug),
    });
  } catch (error) {
    console.error('Error checking slug:', error);
    return NextResponse.json(
      { error: 'Eroare la verificarea slug-ului' },
      { status: 500 }
    );
  }
}
