// @ts-nocheck
import { ADDRESS, GEO, OPENING_HOURS } from "@shared/facts";
import { useEffect } from 'react';

interface SchemaOrgProps {
  type: 'homepage' | 'village' | 'vinted' | 'international' | 'national';
  villageName?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country?: string;
  };
  openingHours?: string;
  isVinted?: boolean;
}

export default function SchemaOrg({ 
  type, 
  villageName, 
  address,
  openingHours = OPENING_HOURS.schema,
  isVinted = false
}: SchemaOrgProps) {
  useEffect(() => {
    // Remove existing schema script if any
    const existingScript = document.getElementById('schema-org-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Base organization schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "REPAYZ",
      "url": "https://repayz.nl",
      "logo": "https://repayz.nl/repayz-statiegeld-logo.png",
      "description": "REPAYZ - Recycle, Get Paid, Zero Waste. Statiegeld inleveren in Nederland.",
      "sameAs": [
        "https://www.facebook.com/repayz",
        "https://www.instagram.com/repayz"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "availableLanguage": ["nl", "en"]
      }
    };

    let schema: any = organizationSchema;

    // Add LocalBusiness schema for village pages
    if (type === 'village' || type === 'vinted') {
      const businessName = isVinted 
        ? `REPAYZ & Vinted Go Locker ${villageName || 'Oisterwijk'}`
        : `REPAYZ ${villageName || 'Oisterwijk'}`;

      const businessDescription = isVinted
        ? `Statiegeld inleveren en Vinted Go locker in ${villageName || 'Oisterwijk'}. Tot 120 items per minuut! Ontvang cash via Tikkie of steun lokaal welzijn.`
        : `Statiegeld inleveren in ${villageName || 'Oisterwijk'}. Tot 120 items per minuut! Ontvang cash via Tikkie of steun Sociaal Huis Oisterwijk.`;

      schema = {
        "@context": "https://schema.org",
        "@graph": [
          organizationSchema,
          {
            "@type": "LocalBusiness",
            "name": businessName,
            "image": "https://repayz.nl/repayz-statiegeld-logo.png",
            "description": businessDescription,
            "@id": `https://repayz.nl/${isVinted ? 'vinted-locker' : 'statiegeld'}-${villageName?.toLowerCase() || 'oisterwijk'}`,
            "url": `https://repayz.nl/${isVinted ? 'vinted-locker' : 'statiegeld'}-${villageName?.toLowerCase() || 'oisterwijk'}`,
            "telephone": "+31642346115",
            "priceRange": "€",
            "address": address ? {
              "@type": "PostalAddress",
              "streetAddress": address.street,
              "addressLocality": address.city,
              "postalCode": address.postalCode,
              "addressCountry": address.country || "NL"
            } : {
              "@type": "PostalAddress",
              "streetAddress": ADDRESS.street,
              "addressLocality": ADDRESS.city,
              "postalCode": ADDRESS.postalCode,
              "addressCountry": ADDRESS.country
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": GEO.latitude,
              "longitude": GEO.longitude
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": OPENING_HOURS.schemaDays,
                "opens": OPENING_HOURS.opens,
                "closes": OPENING_HOURS.closes
              }
            ],
            "openingHours": openingHours,
            "hasMap": `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address?.street || ADDRESS.street)}+${encodeURIComponent(address?.city || ADDRESS.city)}`,
            "areaServed": {
              "@type": "City",
              "name": villageName || "Oisterwijk"
            }
          }
        ]
      };

      // Add RecyclingCenter for non-Vinted pages
      if (!isVinted) {
        schema["@graph"].push({
          "@type": "RecyclingCenter",
          "name": `REPAYZ Statiegeld Inlever Punt ${villageName || 'Oisterwijk'}`,
          "description": "Geautomatiseerd statiegeld inlever punt. Accepteert flessen en blikjes.",
          "address": address ? {
            "@type": "PostalAddress",
            "streetAddress": address.street,
            "addressLocality": address.city,
            "postalCode": address.postalCode,
            "addressCountry": address.country || "NL"
          } : {
            "@type": "PostalAddress",
            "streetAddress": ADDRESS.street,
            "addressLocality": ADDRESS.city,
            "postalCode": ADDRESS.postalCode,
            "addressCountry": ADDRESS.country
          }
        });
      }
    }

    // Add FAQ schema for homepage
    if (type === 'homepage' || type === 'national') {
      const faqSchema = {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Hoe werkt REPAYZ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Breng je lege flessen en blikjes naar onze machine, stort ze erin, en ontvang je statiegeld direct via Tikkie of doneer aan Sociaal Huis Oisterwijk."
            }
          },
          {
            "@type": "Question",
            "name": "Welke items accepteert REPAYZ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "REPAYZ accepteert alle statiegeld flessen en blikjes. De machine telt tot 120 items per minuut."
            }
          },
          {
            "@type": "Question",
            "name": "Hoe krijg ik mijn geld?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Je kunt kiezen voor directe uitbetaling via Tikkie op je bankrekening, of je kunt het bedrag doneren aan Sociaal Huis Oisterwijk."
            }
          }
        ]
      };

      if (schema["@graph"]) {
        schema["@graph"].push(faqSchema);
      } else {
        schema = {
          "@context": "https://schema.org",
          "@graph": [organizationSchema, faqSchema]
        };
      }
    }

    // Add BreadcrumbList for all pages except homepage
    if (type !== 'homepage') {
      const breadcrumbItems = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://repayz.nl"
        }
      ];

      if (type === 'village') {
        breadcrumbItems.push({
          "@type": "ListItem",
          "position": 2,
          "name": `Statiegeld ${villageName}`,
          "item": `https://repayz.nl/statiegeld-${villageName?.toLowerCase()}`
        });
      } else if (type === 'vinted') {
        breadcrumbItems.push({
          "@type": "ListItem",
          "position": 2,
          "name": `Vinted Go ${villageName}`,
          "item": `https://repayz.nl/vinted-locker-${villageName?.toLowerCase()}`
        });
      }

      const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
      };

      if (schema["@graph"]) {
        schema["@graph"].push(breadcrumbSchema);
      }
    }

    // Inject schema into page
    const script = document.createElement('script');
    script.id = 'schema-org-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('schema-org-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, villageName, address, openingHours, isVinted]);

  return null;
}
