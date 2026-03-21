'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { InstitutionNavItem } from '@/lib/supabase/services/institutions';
import type { ProgramNavItem } from '@/lib/supabase/services/programs';
import type { NavPageWithSection } from '@/lib/supabase/services/navigation';

export interface NavPagesData {
  cetateni: NavPageWithSection[];
  firme: NavPageWithSection[];
  primarie: NavPageWithSection[];
  turist: NavPageWithSection[];
}

interface NavigationContextType {
  dynamicInstitutions: InstitutionNavItem[];
  dynamicPrograms: ProgramNavItem[];
  navPages: NavPagesData;
}

const NavigationContext = createContext<NavigationContextType>({
  dynamicInstitutions: [],
  dynamicPrograms: [],
  navPages: { cetateni: [], firme: [], primarie: [], turist: [] },
});

export function NavigationProvider({
  children,
  institutions,
  programs,
  navPages,
}: {
  children: ReactNode;
  institutions: InstitutionNavItem[];
  programs: ProgramNavItem[];
  navPages: NavPagesData;
}) {
  return (
    <NavigationContext.Provider value={{ dynamicInstitutions: institutions, dynamicPrograms: programs, navPages }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  return useContext(NavigationContext);
}
