/**
 * Google Analytics 4 Event Tracking Utility
 *
 * Provides type-safe event tracking functions for GA4.
 * All events follow GA4 recommended event naming conventions.
 */

// eslint-disable-next-line no-undef
declare const gtag: (
  command: 'event' | 'config' | 'set',
  targetId: string | { [key: string]: unknown },
  config?: { [key: string]: unknown }
) => void;

/**
 * Check if Google Analytics is available
 */
export const isGAEnabled = (): boolean => {
  return typeof window !== 'undefined' && typeof gtag !== 'undefined';
};

/**
 * Track a custom event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: {
    [key: string]: string | number | boolean | undefined;
  }
): void => {
  if (!isGAEnabled()) {
    return;
  }

  try {
    gtag('event', eventName, {
      ...eventParams,
      timestamp: Date.now(),
    });
  } catch (error) {
    // Silently fail in production, but could log in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('GA4 tracking error:', error);
    }
  }
};

/**
 * Track button click events
 */
export const trackButtonClick = (
  buttonName: string,
  location?: string,
  additionalParams?: { [key: string]: string | number | boolean | undefined }
): void => {
  trackEvent('button_click', {
    button_name: buttonName,
    location,
    ...additionalParams,
  });
};

/**
 * Track form submission events
 */
export const trackFormSubmit = (
  formName: string,
  formType: 'create' | 'update' | 'delete',
  success: boolean,
  additionalParams?: { [key: string]: string | number | boolean | undefined }
): void => {
  trackEvent('form_submit', {
    form_name: formName,
    form_type: formType,
    success,
    ...additionalParams,
  });
};

/**
 * Track navigation events
 */
export const trackNavigation = (
  destination: string,
  source?: string,
  additionalParams?: { [key: string]: string | number | boolean | undefined }
): void => {
  trackEvent('page_view', {
    page_path: destination,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    source,
    ...additionalParams,
  });
};

/**
 * Track user engagement events
 */
export const trackUserEngagement = (
  action: 'login' | 'logout' | 'signup',
  userRole?: 'sponsor' | 'publisher',
  additionalParams?: { [key: string]: string | number | boolean | undefined }
): void => {
  trackEvent('user_engagement', {
    engagement_type: action,
    user_role: userRole,
    ...additionalParams,
  });
};

/**
 * Track marketplace-specific events
 */
export const trackMarketplaceEvent = (
  eventType: 'view_listing' | 'book_placement' | 'unbook_placement' | 'view_detail',
  listingId?: string,
  listingType?: string,
  additionalParams?: { [key: string]: string | number | boolean | undefined }
): void => {
  trackEvent('marketplace_interaction', {
    interaction_type: eventType,
    listing_id: listingId,
    listing_type: listingType,
    ...additionalParams,
  });
};

/**
 * Track campaign/ad slot management events
 */
export const trackManagementEvent = (
  action: 'create' | 'update' | 'delete',
  resourceType: 'campaign' | 'ad_slot',
  resourceId?: string,
  additionalParams?: { [key: string]: string | number | boolean | undefined }
): void => {
  trackEvent('resource_management', {
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    ...additionalParams,
  });
};
