'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/components/ui/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('errors.404');

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Container className="text-center">
        <div className="max-w-md mx-auto">
          {/* 404 Number */}
          <h1 className="text-[150px] font-bold text-primary-100 leading-none select-none">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-gray-900 -mt-8 mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('description')}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild>
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="w-4 h-4" />
                {t('backHome')}
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4" />
              {t('back')}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

