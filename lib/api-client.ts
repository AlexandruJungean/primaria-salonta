/**
 * Client pentru API-uri admin
 * Foloseste cookie-ul HttpOnly admin-session (trimis automat prin credentials: include)
 */
export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}

export async function adminGet(url: string): Promise<Response> {
  return adminFetch(url, { method: 'GET' });
}

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

export async function adminDelete(url: string): Promise<Response> {
  return adminFetch(url, { method: 'DELETE' });
}
