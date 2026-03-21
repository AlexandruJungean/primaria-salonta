/**
 * Layout Data Service
 * 
 * Provides a single function to fetch all layout-wide data in parallel.
 */

import { getInstitutionsForNav, type InstitutionNavItem } from './institutions';
import { getProgramsForNav, type ProgramNavItem } from './programs';
import { getContactInfo, type ContactInfo } from './settings';
import { getPublicMenuData, type PublicMenuData } from './navigation';

export interface LayoutData {
  institutions: InstitutionNavItem[];
  programs: ProgramNavItem[];
  contactInfo: ContactInfo;
  navPages: PublicMenuData;
}

/**
 * Get all layout data in parallel
 * No caching - changes in admin appear immediately
 */
export async function getLayoutData(): Promise<LayoutData> {
  const [institutions, programs, contactInfo, navPages] = await Promise.all([
    getInstitutionsForNav(),
    getProgramsForNav(),
    getContactInfo(),
    getPublicMenuData(),
  ]);

  return {
    institutions,
    programs,
    contactInfo,
    navPages,
  };
}
