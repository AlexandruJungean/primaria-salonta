import { supabase } from './supabase/client';

/**
 * Client pentru API-uri admin
 * Adaugă automat token-ul de autentificare la request-uri
 */
export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Obține sesiunea curentă
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  
  // Adaugă token-ul de autentificare dacă există
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  // Setează Content-Type pentru JSON dacă avem body și nu e FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies pentru fallback
  });
}

/**
 * Helper pentru GET requests
 */
export async function adminGet(url: string): Promise<Response> {
  return adminFetch(url, { method: 'GET' });
}

/**
 * Helper pentru POST requests
 */
export async function adminPost(
  url: string,
  body: unknown
): Promise<Response> {
  const isFormData = body instanceof FormData;
  return adminFetch(url, {
    method: 'POST',
    body: isFormData ? body : JSON.stringify(body),
  });
}

/**
 * Helper pentru PUT requests
 */
export async function adminPut(
  url: string,
  body: unknown
): Promise<Response> {
  const isFormData = body instanceof FormData;
  return adminFetch(url, {
    method: 'PUT',
    body: isFormData ? body : JSON.stringify(body),
  });
}

/**
 * Helper pentru PATCH requests
 */
export async function adminPatch(
  url: string,
  body: unknown
): Promise<Response> {
  const isFormData = body instanceof FormData;
  return adminFetch(url, {
    method: 'PATCH',
    body: isFormData ? body : JSON.stringify(body),
  });
}

/**
 * Helper pentru DELETE requests
 */
export async function adminDelete(url: string): Promise<Response> {
  return adminFetch(url, { method: 'DELETE' });
}
