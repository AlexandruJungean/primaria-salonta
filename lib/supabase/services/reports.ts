import { createAnonServerClient } from '../server';

export interface Report {
  id: string;
  slug: string;
  report_type: 'raport_primar' | 'raport_activitate' | 'studiu' | 'analiza' | 'audit' | 'altele' | 'raport_curtea_conturi' | 'studiu_fezabilitate' | 'studiu_impact';
  category: string | null;
  title: string;
  summary: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  report_year: number | null;
  report_date: string | null;
  author: string | null;
  published: boolean;
  source_url: string | null;
  created_at: string;
}

interface ReportsFilter {
  page?: number;
  limit?: number;
  reportType?: Report['report_type'];
  category?: string;
  reportYear?: number;
}

/**
 * Get paginated reports
 */
export async function getReports(filter: ReportsFilter = {}): Promise<{
  data: Report[];
  count: number;
}> {
  const supabase = createAnonServerClient();
  const { page = 1, limit = 20, reportType, category, reportYear } = filter;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('reports')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('report_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (reportType) {
    query = query.eq('report_type', reportType);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (reportYear) {
    query = query.eq('report_year', reportYear);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching reports:', error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
}

/**
 * Get reports by type
 */
export async function getReportsByType(reportType: Report['report_type']): Promise<Report[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('published', true)
    .eq('report_type', reportType)
    .order('report_date', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching reports by type:', error);
    return [];
  }

  return data || [];
}

/**
 * Get report by slug
 */
export async function getReportBySlug(slug: string): Promise<Report | null> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching report:', error);
    return null;
  }

  return data;
}

/**
 * Get available years for reports
 */
export async function getReportYears(reportType?: Report['report_type']): Promise<number[]> {
  const supabase = createAnonServerClient();

  let query = supabase
    .from('reports')
    .select('report_year')
    .eq('published', true)
    .not('report_year', 'is', null);

  if (reportType) {
    query = query.eq('report_type', reportType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching report years:', error);
    return [];
  }

  const years = new Set<number>();
  data?.forEach(r => {
    if (r.report_year) years.add(r.report_year);
  });

  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Get all report slugs for static generation
 */
export async function getAllReportSlugs(): Promise<string[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('reports')
    .select('slug')
    .eq('published', true);

  if (error) {
    console.error('Error fetching report slugs:', error);
    return [];
  }

  return data?.map(r => r.slug) || [];
}

// ============================================
// ACTIVITY REPORTS (for rapoarte-activitate page)
// ============================================

export interface ActivityReportItem {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  year: number | null;
  file_url: string | null;
}

export interface YearGroupedReports {
  year: number | string;
  committees: ActivityReportItem[];
  councilors: ActivityReportItem[];
}

export interface MandateGroupedReports {
  mandate: string;
  years: YearGroupedReports[];
}

/**
 * Get activity reports grouped by mandate and year
 */
export async function getActivityReportsGrouped(): Promise<MandateGroupedReports[]> {
  const supabase = createAnonServerClient();

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('published', true)
    .eq('report_type', 'raport_activitate')
    .order('report_year', { ascending: false })
    .order('author', { ascending: true });

  if (error) {
    console.error('Error fetching activity reports:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Group reports by mandate period
  const mandates: Record<string, YearGroupedReports[]> = {};
  
  data.forEach(report => {
    const year = report.report_year || new Date().getFullYear();
    const mandate = getMandatePeriod(year);
    
    if (!mandates[mandate]) {
      mandates[mandate] = [];
    }

    // Find or create year group
    let yearGroup = mandates[mandate].find(y => y.year === year);
    if (!yearGroup) {
      yearGroup = { year, committees: [], councilors: [] };
      mandates[mandate].push(yearGroup);
    }

    const item: ActivityReportItem = {
      id: report.id,
      title: report.title,
      author: report.author,
      category: report.category,
      year: report.report_year,
      file_url: report.file_url,
    };

    // Categorize as committee or councilor report
    if (report.category === 'comisie' || report.title.toLowerCase().includes('comisi')) {
      yearGroup.committees.push(item);
    } else {
      yearGroup.councilors.push(item);
    }
  });

  // Convert to array and sort
  const result: MandateGroupedReports[] = Object.entries(mandates)
    .map(([mandate, years]) => ({
      mandate,
      years: years.sort((a, b) => {
        const yearA = typeof a.year === 'number' ? a.year : 0;
        const yearB = typeof b.year === 'number' ? b.year : 0;
        return yearB - yearA;
      }),
    }))
    .sort((a, b) => b.mandate.localeCompare(a.mandate));

  return result;
}

/**
 * Helper to determine mandate period for a given year
 */
function getMandatePeriod(year: number): string {
  if (year >= 2024) return '2024-2028';
  if (year >= 2020) return '2020-2024';
  if (year >= 2016) return '2016-2020';
  if (year >= 2012) return '2012-2016';
  return '2008-2012';
}
