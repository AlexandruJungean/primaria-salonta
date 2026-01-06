import { redirect } from 'next/navigation';

// Root page redirects to default locale
// With Next.js 15+ and next-intl, proxy.ts handles locale routing
// This redirect is needed because content lives in [locale] segment
export default function RootPage() {
  redirect('/ro');
}

