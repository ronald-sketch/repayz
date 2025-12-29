// @ts-nocheck
import { useEffect } from "react";

interface StructuredDataProps {
  data: object;
}

export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);

  return null;
}

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "REPAYZ",
  alternateName: "REPAYZ - Recycle, Get Paid, Zero Waste",
  url: "https://repayz.nl",
  logo: "https://repayz.nl/repayz-logo-512.png",
  description:
    "Recycle je flessen en blikjes, ontvang CASH of steun een lokaal goed doel! REPAYZ maakt recycling eenvoudig en lonend in Oisterwijk.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oisterwijk",
    addressCountry: "NL",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    availableLanguage: ["Dutch", "English"],
  },
  sameAs: [
    "https://www.instagram.com/repayz.nl",
    "https://www.tiktok.com/@repayz.nl",
    "https://www.facebook.com/repayz.nl",
    "https://www.linkedin.com/company/repayz"
  ],
};

// LocalBusiness & RecyclingCenter Schema
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "RecyclingCenter"],
  name: "REPAYZ",
  image: "https://repayz.nl/repayz-logo-512.png",
  description:
    "Statiegeld inzamelpunt in Oisterwijk. Breng je lege flessen en blikjes, ontvang cash of doneer aan Sociaal Huis Oisterwijk.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sprendlingenstraat 20B",
    addressLocality: "Oisterwijk",
    postalCode: "5061 KE",
    addressCountry: "NL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.5783, // Update with actual coordinates
    longitude: 5.1889,
  },
  url: "https://repayz.nl",
  telephone: "+31-XXX-XXXXXX", // Update with actual phone
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "18:00",
    },
  ],
  priceRange: "Free",
  paymentAccepted: ["Cash", "Tikkie"],
};

// WebSite Schema with Search Action
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "REPAYZ",
  url: "https://repayz.nl",
  description: "Recycle, Get Paid, Zero Waste - Statiegeld recycling in Oisterwijk",
  publisher: {
    "@type": "Organization",
    name: "REPAYZ",
    logo: {
      "@type": "ImageObject",
      url: "https://repayz.nl/repayz-statiegeld-logo.png",
    },
  },
};

// FAQPage Schema for How It Works
export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Hoe werkt REPAYZ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Breng je lege flessen en blikjes naar onze machine. Je kunt ze zo uit de zak storten, wij tellen ze allemaal! Daarna kies je of je het statiegeld op je rekening wilt via Tikkie, of dat je het wilt doneren aan Stichting Sociaal Huis Oisterwijk.",
      },
    },
    {
      "@type": "Question",
      name: "Hoe krijg ik mijn geld?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Je ontvangt je verdiensten direct op je bankrekening via de Tikkie app. Kies Tikkie aan de machine, ontvang geld direct, zonder verborgen kosten.",
      },
    },
    {
      "@type": "Question",
      name: "Kan ik ook doneren?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja! Je kunt ervoor kiezen om je verdiensten te doneren aan Stichting Sociaal Huis Oisterwijk. 100% van je statiegeld gaat naar hulp aan inwoners met armoede, sociale uitsluiting of praktische problemen.",
      },
    },
    {
      "@type": "Question",
      name: "Welke flessen en blikjes accepteert REPAYZ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "REPAYZ accepteert alle lege flessen en blikjes met statiegeld. Breng ze gewoon mee en de machine telt ze automatisch.",
      },
    },
    {
      "@type": "Question",
      name: "Wat zijn de openingstijden?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "De REPAYZ machine is dagelijks beschikbaar van 10:00 tot 21:00 uur, 7 dagen per week. Scooterpoint (op dezelfde locatie) is open dinsdag t/m zaterdag van 10:00 tot 18:00 uur. Maandag en zondag gesloten.",
      },
    },
  ],
};


// Product Schema for Statiegeld Service
export const statiegeldProductSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Statiegeld Inleveren",
  description: "Lever je lege flessen en blikjes in en ontvang direct je statiegeld via Tikkie of doneer aan een goed doel.",
  provider: {
    "@type": "LocalBusiness",
    name: "REPAYZ",
    url: "https://repayz.nl",
  },
  areaServed: {
    "@type": "City",
    name: "Oisterwijk",
    containedInPlace: {
      "@type": "Country",
      name: "Netherlands",
    },
  },
  offers: [
    {
      "@type": "Offer",
      name: "Klein Statiegeld (tot 1L)",
      description: "Statiegeld voor kleine flessen en blikjes tot 1 liter",
      price: "0.15",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Groot Statiegeld (1L+)",
      description: "Statiegeld voor grote flessen vanaf 1 liter",
      price: "0.25",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  ],
  serviceType: "Recycling Service",
  termsOfService: "https://repayz.nl/algemene-voorwaarden",
};
