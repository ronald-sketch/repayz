// @ts-nocheck
import { useEffect } from 'react';
import { useLocation } from 'wouter';

// International page mappings for hreflang
const INTERNATIONAL_ROUTES = {
  // Main international pages (Oisterwijk base)
  '/': { nl: '/', en: '/en', ro: '/ro', pl: '/pl', bg: '/bg', ua: '/ua' },
  '/en': { nl: '/', en: '/en', ro: '/ro', pl: '/pl', bg: '/bg', ua: '/ua' },
  '/ro': { nl: '/', en: '/en', ro: '/ro', pl: '/pl', bg: '/bg', ua: '/ua' },
  '/pl': { nl: '/', en: '/en', ro: '/ro', pl: '/pl', bg: '/bg', ua: '/ua' },
  '/bg': { nl: '/', en: '/en', ro: '/ro', pl: '/pl', bg: '/bg', ua: '/ua' },
  '/ua': { nl: '/', en: '/en', ro: '/ro', pl: '/pl', bg: '/bg', ua: '/ua' },
  // Tilburg pages
  '/en-tilburg': { nl: '/', en: '/en-tilburg', ro: '/ro-tilburg', pl: '/pl-tilburg', bg: '/bg-tilburg', ua: '/ua-tilburg' },
  '/ro-tilburg': { nl: '/', en: '/en-tilburg', ro: '/ro-tilburg', pl: '/pl-tilburg', bg: '/bg-tilburg', ua: '/ua-tilburg' },
  '/pl-tilburg': { nl: '/', en: '/en-tilburg', ro: '/ro-tilburg', pl: '/pl-tilburg', bg: '/bg-tilburg', ua: '/ua-tilburg' },
  '/bg-tilburg': { nl: '/', en: '/en-tilburg', ro: '/ro-tilburg', pl: '/pl-tilburg', bg: '/bg-tilburg', ua: '/ua-tilburg' },
  '/ua-tilburg': { nl: '/', en: '/en-tilburg', ro: '/ro-tilburg', pl: '/pl-tilburg', bg: '/bg-tilburg', ua: '/ua-tilburg' },
  // Boxtel pages
  '/en-boxtel': { nl: '/', en: '/en-boxtel', ro: '/ro-boxtel', pl: '/pl-boxtel', bg: '/bg-boxtel', ua: '/ua-boxtel' },
  '/ro-boxtel': { nl: '/', en: '/en-boxtel', ro: '/ro-boxtel', pl: '/pl-boxtel', bg: '/bg-boxtel', ua: '/ua-boxtel' },
  '/pl-boxtel': { nl: '/', en: '/en-boxtel', ro: '/ro-boxtel', pl: '/pl-boxtel', bg: '/bg-boxtel', ua: '/ua-boxtel' },
  '/bg-boxtel': { nl: '/', en: '/en-boxtel', ro: '/ro-boxtel', pl: '/pl-boxtel', bg: '/bg-boxtel', ua: '/ua-boxtel' },
  '/ua-boxtel': { nl: '/', en: '/en-boxtel', ro: '/ro-boxtel', pl: '/pl-boxtel', bg: '/bg-boxtel', ua: '/ua-boxtel' },
  // Den Bosch pages
  '/en-den-bosch': { nl: '/', en: '/en-den-bosch', ro: '/ro-den-bosch', pl: '/pl-den-bosch', bg: '/bg-den-bosch', ua: '/ua-den-bosch' },
  '/ro-den-bosch': { nl: '/', en: '/en-den-bosch', ro: '/ro-den-bosch', pl: '/pl-den-bosch', bg: '/bg-den-bosch', ua: '/ua-den-bosch' },
  '/pl-den-bosch': { nl: '/', en: '/en-den-bosch', ro: '/ro-den-bosch', pl: '/pl-den-bosch', bg: '/bg-den-bosch', ua: '/ua-den-bosch' },
  '/bg-den-bosch': { nl: '/', en: '/en-den-bosch', ro: '/ro-den-bosch', pl: '/pl-den-bosch', bg: '/bg-den-bosch', ua: '/ua-den-bosch' },
  '/ua-den-bosch': { nl: '/', en: '/en-den-bosch', ro: '/ro-den-bosch', pl: '/pl-den-bosch', bg: '/bg-den-bosch', ua: '/ua-den-bosch' },
};

// Language code to hreflang mapping
const LANG_CODES = {
  nl: 'nl-NL',
  en: 'en',
  ro: 'ro',
  pl: 'pl',
  bg: 'bg',
  ua: 'uk', // Ukrainian uses 'uk' in hreflang
};

/**
 * Global SEO component that automatically updates canonical URL and hreflang tags
 * This ensures every page has the correct canonical tag and language alternates
 */
export default function GlobalSEO() {
  const [location] = useLocation();

  useEffect(() => {
    // Build canonical URL based on current location
    const canonicalUrl = `https://repayz.nl${location}`;
    
    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Ensure robots meta tag exists
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      document.head.appendChild(robotsMeta);
    }

    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    // Add hreflang tags for international pages
    const routeMapping = INTERNATIONAL_ROUTES[location];
    if (routeMapping) {
      Object.entries(routeMapping).forEach(([lang, path]) => {
        const hreflangLink = document.createElement('link');
        hreflangLink.setAttribute('rel', 'alternate');
        hreflangLink.setAttribute('hreflang', LANG_CODES[lang]);
        hreflangLink.setAttribute('href', `https://repayz.nl${path}`);
        document.head.appendChild(hreflangLink);
      });

      // Add x-default (points to Dutch version)
      const xDefaultLink = document.createElement('link');
      xDefaultLink.setAttribute('rel', 'alternate');
      xDefaultLink.setAttribute('hreflang', 'x-default');
      xDefaultLink.setAttribute('href', `https://repayz.nl${routeMapping.nl}`);
      document.head.appendChild(xDefaultLink);
    }

    // Update html lang attribute based on current page
    const htmlElement = document.documentElement;
    if (location.startsWith('/en')) {
      htmlElement.setAttribute('lang', 'en');
    } else if (location.startsWith('/ro')) {
      htmlElement.setAttribute('lang', 'ro');
    } else if (location.startsWith('/pl')) {
      htmlElement.setAttribute('lang', 'pl');
    } else if (location.startsWith('/bg')) {
      htmlElement.setAttribute('lang', 'bg');
    } else if (location.startsWith('/ua')) {
      htmlElement.setAttribute('lang', 'uk');
    } else {
      htmlElement.setAttribute('lang', 'nl');
    }
  }, [location]);

  return null; // This component doesn't render anything
}
