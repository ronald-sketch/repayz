// @ts-nocheck
/**
 * HowTo and Video Schema Components for SEO
 */

// Video Schema for YouTube video
export const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Hoe Werkt de Envipco Quantum Recycling Machine?",
  "description": "Bekijk hoe eenvoudig het is om je flessen en blikjes in bulk in te leveren bij REPAYZ met de Envipco Quantum machine. Tot 120 items per minuut!",
  "thumbnailUrl": "https://repayz.nl/og-image.png",
  "uploadDate": "2025-01-01T00:00:00Z",
  "contentUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "duration": "PT2M30S"
};

// HowTo Schema for "3 Simpele Stappen"
export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Hoe Lever Je Flessen en Blikjes In bij REPAYZ",
  "description": "Leer in 3 simpele stappen hoe je flessen en blikjes kunt inleveren bij REPAYZ Oisterwijk met de Envipco Quantum machine",
  "image": "https://repayz.nl/og-image.png",
  "totalTime": "PT2M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "EUR",
    "value": "0"
  },
  "tool": [{
    "@type": "HowToTool",
    "name": "Envipco Quantum Recycling Machine"
  }],
  "supply": [{
    "@type": "HowToSupply",
    "name": "Lege PET flessen en aluminium blikjes met statiegeld"
  }],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Stort Je Zak Leeg",
      "text": "Geen gedoe met één voor één inleveren! Stort je hele zak met lege flessen en blikjes direct in de machine. De open feed area maakt het super makkelijk - geen plakkerige flessen of blikjes hoeven aangeraakt te worden.",
      "image": "https://repayz.nl/icon-recycle-1763750184.png",
      "url": "https://repayz.nl/hoe-het-werkt#stap-1"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Machine Telt Automatisch",
      "text": "Onze Quantum machine scant en telt tot 120 flessen en blikjes per minuut! PET flessen en blikjes worden automatisch herkend, gecompacteerd en opgeslagen. Items die niet geaccepteerd worden, krijg je meteen terug.",
      "image": "https://repayz.nl/icon-recycle-1763750184.png",
      "url": "https://repayz.nl/hoe-het-werkt#stap-2"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Ontvang Je Geld",
      "text": "Je krijgt een voucher met barcode die je via Tikkie kunt inwisselen voor geld op je rekening. Of kies ervoor om het bedrag te doneren aan een lokaal goed doel. Jij bepaalt!",
      "image": "https://repayz.nl/icon-money-1763750184.png",
      "url": "https://repayz.nl/hoe-het-werkt#stap-3"
    }
  ]
};
