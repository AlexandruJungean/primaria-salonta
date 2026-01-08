// Client-side exports (for browser/client components)
export { supabase, type AdminProfile } from './client';

// Server-side exports (for server components, API routes, server actions)
export { createServerClient, createAnonServerClient } from './server';

// Re-export all data services
export * from './services';
