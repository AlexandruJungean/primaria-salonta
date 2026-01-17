'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { InstitutionNavItem } from '@/lib/supabase/services/institutions';
import type { ProgramNavItem } from '@/lib/supabase/services/programs';

interface NavigationContextType {
  dynamicInstitutions: InstitutionNavItem[];
  dynamicPrograms: ProgramNavItem[];
}

const NavigationContext = createContext<NavigationContextType>({
  dynamicInstitutions: [],
  dynamicPrograms: [],
});

export function NavigationProvider({
  children,
  institutions,
  programs,
}: {
  children: ReactNode;
  institutions: InstitutionNavItem[];
  programs: ProgramNavItem[];
}) {
  return (
    <NavigationContext.Provider value={{ dynamicInstitutions: institutions, dynamicPrograms: programs }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  return useContext(NavigationContext);
}
