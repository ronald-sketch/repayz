import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
}

/**
 * Hook to manage SEO meta tags dynamically for each page
 * Updates title, description, canonical URL, and robots meta tag
 */
export function useSEO(props: SEOProps = {}) {
  const [location] = useLocation();

  useEffect(() => {
    // Update title
    if (props.title) {
      document.title = props.title;
    }

    // Update or create meta description
    if (props.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', props.description);
    }

    // IMPORTANT: Always use non-www canonical URL
    // Remove ALL existing canonical tags first to prevent duplicates
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach(tag => tag.remove());
    
    // Create single canonical tag with correct non-www URL
    const canonicalUrl = props.canonical || `https://repayz.nl${location}`;
    const canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', canonicalUrl);
    document.head.appendChild(canonicalLink);

    // Update or create robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    const robotsContent = props.noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    robotsMeta.setAttribute('content', robotsContent);
  }, [location, props.title, props.description, props.canonical, props.noindex]);
}
