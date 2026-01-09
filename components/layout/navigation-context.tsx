'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { InstitutionNavItem } from '@/lib/supabase/services/institutions';

interface NavigationContextType {
  dynamicInstitutions: InstitutionNavItem[];
}

const NavigationContext = createContext<NavigationContextType>({
  dynamicInstitutions: [],
});

export function NavigationProvider({
  children,
  institutions,
}: {
  children: ReactNode;
  institutions: InstitutionNavItem[];
}) {
  return (
    <NavigationContext.Provider value={{ dynamicInstitutions: institutions }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  return useContext(NavigationContext);
}
