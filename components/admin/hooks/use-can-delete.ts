/**
 * Hook pentru verificarea dacă un element poate fi șters
 * bazat pe timpul trecut de la creare
 */

export interface CanDeleteResult {
  canDelete: boolean;
  hoursRemaining: number;
  reason: string | null;
}

/**
 * Verifică dacă un item poate fi șters bazat pe created_at
 * @param createdAt - Data creării (ISO string)
 * @param hoursLimit - Limita în ore (default 24)
 * @returns Obiect cu canDelete, hoursRemaining și reason
 */
export function useCanDelete(
  createdAt: string | Date | null | undefined,
  hoursLimit: number = 24
): CanDeleteResult {
  if (!createdAt) {
    return {
      canDelete: true,
      hoursRemaining: hoursLimit,
      reason: null,
    };
  }

  const createdDate = new Date(createdAt);
  const now = new Date();
  const hoursSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
  
  const canDelete = hoursSinceCreation <= hoursLimit;
  const hoursRemaining = Math.max(0, hoursLimit - hoursSinceCreation);
  
  return {
    canDelete,
    hoursRemaining: Math.round(hoursRemaining * 10) / 10,
    reason: canDelete 
      ? null 
      : `Nu se poate șterge. Au trecut mai mult de ${hoursLimit} ore de la creare.`,
  };
}

/**
 * Verifică dacă un item poate fi șters (versiune funcție simplă)
 */
export function canDeleteItem(
  createdAt: string | Date | null | undefined,
  hoursLimit: number = 24
): boolean {
  if (!createdAt) return true;
  
  const createdDate = new Date(createdAt);
  const now = new Date();
  const hoursSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceCreation <= hoursLimit;
}

/**
 * Formatează timpul rămas pentru ștergere
 */
export function formatDeleteTimeRemaining(hoursRemaining: number): string {
  if (hoursRemaining <= 0) return 'Timp expirat';
  
  if (hoursRemaining < 1) {
    const minutes = Math.round(hoursRemaining * 60);
    return `${minutes} minute rămase`;
  }
  
  const hours = Math.floor(hoursRemaining);
  const minutes = Math.round((hoursRemaining - hours) * 60);
  
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'oră rămasă' : 'ore rămase'}`;
  }
  
  return `${hours}h ${minutes}m rămase`;
}

// Configurație pentru tipurile de documente și limitele lor
export const DELETE_TIME_LIMITS: Record<string, number> = {
  // Documente oficiale - 24 ore
  'council_decisions': 24,
  'council_sessions': 24,
  'documents_buget': 24,
  'documents_dispozitii': 24,
  'documents_regulamente': 24,
  'asset_declarations': 24,
  
  // Fără limită (Infinity = poate fi șters oricând)
  'news': Infinity,
  'events': Infinity,
  'staff_members': Infinity,
  'office_hours': Infinity,
  'webcams': Infinity,
  'institutions': Infinity,
  'job_vacancies': Infinity,
};

/**
 * Obține limita de ștergere pentru un tip de document
 */
export function getDeleteLimit(documentType: string): number {
  return DELETE_TIME_LIMITS[documentType] ?? 24;
}
