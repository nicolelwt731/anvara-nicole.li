'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackNavigation } from '@/lib/analytics';

/**
 * Client component that tracks page views for client-side navigation
 * This works alongside the automatic page view tracking from GA4
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view on route change
    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    trackNavigation(fullPath, document.referrer);
  }, [pathname, searchParams]);

  return null;
}
