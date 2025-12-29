export const translations = {
  nl: {
    // Header
    "nav.home": "Home",
    "nav.howItWorks": "Hoe het werkt",
    "nav.vinted": "Vinted Go",
    "nav.location": "Locatie",
    "nav.gameOn": "Game On!",
    "nav.contact": "Contact",
    "nav.comingSoon": "Binnenkort Beschikbaar",
    
    // Common
    "common.learnMore": "Meer informatie",
    "common.getStarted": "Start Nu",
    "common.contact": "Contact",
    "common.viewLocation": "Bekijk Locatie & Route",
    "common.whatsapp": "WhatsApp Contact",
    
    // Homepage
    "home.hero.title": "Recycle, Get Payed.",
    "home.hero.subtitle": "Zero Waste.",
    "home.hero.description": "Lever je lege flessen en blikjes in bij REPAYZ en ontvang direct geld via Tikkie of steun Sociaal Huis Oisterwijk. Snel, makkelijk en goed voor het milieu!",
    "home.hero.cta": "Ontdek Hoe Het Werkt",
    
    // Footer
    "footer.about": "Over REPAYZ",
    "footer.links": "Links",
    "footer.legal": "Juridisch",
    "footer.privacy": "Privacy",
    "footer.terms": "Voorwaarden",
    "footer.contact": "Contact",
    
  },
  en: {
    // Header
    "nav.home": "Home",
    "nav.howItWorks": "How it Works",
    "nav.vinted": "Vinted Go",
    "nav.location": "Location",
    "nav.gameOn": "Game On!",
    "nav.contact": "Contact",
    "nav.comingSoon": "Coming Soon",
    
    // Common
    "common.learnMore": "Learn More",
    "common.getStarted": "Get Started",
    "common.contact": "Contact",
    "common.viewLocation": "View Location & Route",
    "common.whatsapp": "WhatsApp Contact",
    
    // Homepage
    "home.hero.title": "Recycle, Get Paid.",
    "home.hero.subtitle": "Zero Waste.",
    "home.hero.description": "Return your empty bottles and cans at REPAYZ and receive instant cash via Tikkie or support Sociaal Huis Oisterwijk. Fast, easy, and good for the environment!",
    "home.hero.cta": "Discover How It Works",
    
    // Footer
    "footer.about": "About REPAYZ",
    "footer.links": "Links",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.contact": "Contact",
  },
};

export type TranslationKey = keyof typeof translations.nl;

export function getTranslation(language: "nl" | "en", key: string): string {
  const translation = translations[language][key as TranslationKey];
  return translation || key;
}
