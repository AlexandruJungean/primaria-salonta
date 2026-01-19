/**
 * Layout Data Service
 * 
 * Provides a single function to fetch all layout-wide data in parallel.
 */

import { getInstitutionsForNav, type InstitutionNavItem } from './institutions';
import { getProgramsForNav, type ProgramNavItem } from './programs';
import { getContactInfo, type ContactInfo } from './settings';

export interface LayoutData {
  institutions: InstitutionNavItem[];
  programs: ProgramNavItem[];
  contactInfo: ContactInfo;
}

/**
 * Get all layout data in parallel
 * No caching - changes in admin appear immediately
 */
export async function getLayoutData(): Promise<LayoutData> {
  // Fetch all data in parallel for speed
  const [institutions, programs, contactInfo] = await Promise.all([
    getInstitutionsForNav(),
    getProgramsForNav(),
    getContactInfo(),
  ]);

  return {
    institutions,
    programs,
    contactInfo,
  };
}
