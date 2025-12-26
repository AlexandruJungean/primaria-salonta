'use client';

import { Link as NextIntlLink } from '@/i18n/navigation';
import { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof NextIntlLink>;

/**
 * Custom Link component that wraps next-intl's Link
 * with prefetch disabled by default for better performance
 */
export function Link({ prefetch = false, ...props }: LinkProps) {
  return <NextIntlLink prefetch={prefetch} {...props} />;
}

export default Link;

