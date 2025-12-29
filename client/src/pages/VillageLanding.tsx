// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, ArrowRight, Navigation, Phone, ParkingCircle, Zap, Users, CheckCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import WallyPromo from "@/components/WallyPromo";

interface VillageData {
  name: string;
  distance: string;
  driveTime: string;
  directions: string;
  mapEmbedUrl: string;
  slug: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface VillageLandingProps {
  village: VillageData;
  faqs: FAQ[];
}

export default function VillageLanding({ village, faqs }: VillageLandingProps) {
  const [, setLocation] = useLocation();

  // Handle locale parameter redirects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const locale = params.get('locale');
    
    if (locale && ['en', 'ro', 'pl', 'bg', 'ua'].includes(locale)) {
      // Map city names to international page slugs
      const citySlugMap: Record<string, string> = {
        'Tilburg': 'tilburg',
        'Boxtel': 'boxtel',
        'Oisterwijk': 'oisterwijk',
        'Den Bosch': 'den-bosch',
        "'s-Hertogenbosch": 'den-bosch',
      };
      
      const citySlug = citySlugMap[village.name] || 'oisterwijk';
      const redirectUrl = `/${locale}-${citySlug}`;
      
      // Redirect to international page
      window.location.href = redirectUrl;
    }
  }, [village.name]);

  const whatsappNumber = '31642346115';
  const whatsappMessage = encodeURIComponent(`Hallo, ik kom uit ${village.name} en heb een vraag over REPAYZ.`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Structured data for local SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RecyclingCenter",
    "name": "REPAYZ Oisterwijk - Bulkautomaat voor Statiegeld",
    "description": `Snelste bulkautomaat voor statiegeld in ${village.name} en omgeving. 120 items per minuut, gratis parkeren direct naast de machine.`,
    "areaServed": {
      "@type": "City",
      "name": village.name
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sprendlingenstraat 20B",
      "addressLocality": "Oisterwijk",
      "postalCode": "5061 KN",
      "addressCountry": "NL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.5789",
      "longitude": "5.1892"
    },
    "openingHours": "Tu-Sa 10:00-18:00",
    "paymentAccepted": "Tikkie"
  };

  // FAQ Schema for rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1f2d] transition-colors">
      <SEOHead 
        title={`Snel Bulk Statiegeld Inleveren ${village.name} | REPAYZ Bulkautomaat`}
        description={`Bulk statiegeld inleveren in ${village.name}? REPAYZ bulkautomaat in Oisterwijk verwerkt 120 items/min. Gratis parkeren direct naast machine, ${village.driveTime} vanaf ${village.name}.`}
        keywords={`bulk statiegeld ${village.name}, bulkautomaat ${village.name}, statiegeld inleveren ${village.name}, bulkmachine, snel statiegeld, gratis parkeren, horeca statiegeld`}
        ogTitle={`Bulk Statiegeld Inleveren ${village.name} | REPAYZ Bulkautomaat`}
        ogDescription={`Snelste bulkautomaat voor statiegeld - 120 items/min. Gratis parkeren direct naast machine. Slechts ${village.driveTime} vanaf ${village.name}.`}
        canonicalUrl={`https://repayz.nl/${village.slug}`}
      />
      <StructuredData data={localBusinessSchema} />
      <StructuredData data={faqSchema} />
      
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#4db8a8]/10 dark:bg-[#4db8a8]/20 text-[#1a3a52] dark:text-white px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold">Vanuit {village.name}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a52] dark:text-white mb-6">
            Snel Bulk Statiegeld Inleveren <span className="text-[#4db8a8]">{village.name}</span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Woon je in {village.name} en wil je <strong className="text-[#4db8a8]">snel grote hoeveelheden statiegeld</strong> inleveren? 
            REPAYZ in Oisterwijk heeft de <strong className="text-[#4db8a8]">snelste bulkautomaat voor statiegeld</strong> in de regio. 
            Onze <strong>bulkmachine</strong> verwerkt tot <strong className="text-[#4db8a8]">120 items per minuut</strong> - 
            perfect voor <strong>bulk statiegeld inleveren</strong> zonder lange wachtrijen! 
            <strong className="text-green-600 dark:text-green-400">Gratis parkeren direct naast de machine</strong> - geen sjouwen!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href={village.mapEmbedUrl.replace('/embed?', '/dir/?').replace('&output=embed', '')} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-[#4db8a8] hover:bg-[#3da898] text-white w-full sm:w-auto">
                <Navigation className="w-5 h-5 mr-2" />
                Bekijk Route in Google Maps
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-[#4db8a8] text-[#4db8a8] hover:bg-[#4db8a8]/10 dark:border-[#4db8a8] dark:text-[#4db8a8] w-full sm:w-auto">
                <Phone className="w-5 h-5 mr-2" />
                Neem Contact Op
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Wally AI Promo */}
      <WallyPromo 
        title="Vraag Wally - De Eerste Statiegeld AI van Nederland!"
        description="Vragen over statiegeld inleveren? Vraag Wally voor directe antwoorden. Beschikbaar 24/7!"
        buttonText="💬 Open Chat"
      />

      {/* Comparison Table - Supermarkt vs REPAYZ Bulkautomaat */}
      <section className="bg-gray-50 dark:bg-[#1a2f3f] border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-4 text-center">
            Waarom Onze Bulkautomaat Voor Statiegeld?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            In tegenstelling tot supermarkt automaten die statiegeld één voor één verwerken, 
            kan onze <strong>bulkmachine</strong> grote hoeveelheden in enkele minuten verwerken.
          </p>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-[#0d1f2d] rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-[#1a3a52] dark:bg-[#1a3a52] text-white">
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4 text-center">Supermarkt</th>
                  <th className="p-4 text-center bg-[#4db8a8]">REPAYZ Bulkmachine</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-semibold text-[#1a3a52] dark:text-white">Snelheid</td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">10-30/min</td>
                  <td className="p-4 text-center font-bold text-[#4db8a8]">120/min ✅</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2f3f]">
                  <td className="p-4 font-semibold text-[#1a3a52] dark:text-white">Bulk inleveren</td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">❌ Eén voor één</td>
                  <td className="p-4 text-center font-bold text-[#4db8a8]">✅ Grote hoeveelheden</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-semibold text-[#1a3a52] dark:text-white">Wachtrij</td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">❌ Vaak lang</td>
                  <td className="p-4 text-center font-bold text-[#4db8a8]">✅ Geen wachtrij</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2f3f]">
                  <td className="p-4 font-semibold text-[#1a3a52] dark:text-white">Parkeren</td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">Ver lopen</td>
                  <td className="p-4 text-center font-bold text-[#4db8a8]">✅ Direct naast machine</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#1a3a52] dark:text-white">Wachttijd</td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">10-30 min</td>
                  <td className="p-4 text-center font-bold text-[#4db8a8]">2-5 min ✅</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="max-w-3xl mx-auto mt-12">
            <h3 className="text-2xl font-bold text-[#1a3a52] dark:text-white mb-6 text-center">Perfect voor:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-6 flex items-start gap-3">
                  <Users className="w-6 h-6 text-[#4db8a8] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#1a3a52] dark:text-white mb-1">Horeca & Evenementen</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Bars, restaurants, cafés en evenementen organisatoren met grote voorraden statiegeld
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-6 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#4db8a8] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#1a3a52] dark:text-white mb-1">Families & Bedrijven</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Iedereen die snel grote hoeveelheden statiegeld wil inleveren zonder gedoe
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Parking & Unloading Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-6 text-center">
            Makkelijk Parkeren & Uitladen
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center leading-relaxed">
            In tegenstelling tot supermarkten waar je vaak ver moet lopen met zware tassen, 
            parkeer je bij REPAYZ <strong className="text-[#4db8a8]">direct naast de bulkautomaat</strong>.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-green-500 dark:bg-[#1a2f3f]">
              <CardContent className="p-6">
                <ParkingCircle className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Gratis Parkeren</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Gratis parkeren</strong> - geen parkeergeld</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Direct naast de machine</strong> - geen sjouwen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Ruime parkeerplaats</strong> - makkelijk uitladen vanuit je auto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Geen drukke parkeerplaats</strong> - altijd plek</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f]">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-[#4db8a8] mb-4" />
                <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Supersnel</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Perfect voor wie met de auto komt met grote hoeveelheden statiegeld! 
                  Onze <strong>bulkmachine</strong> verwerkt <strong className="text-[#4db8a8]">120 items per minuut</strong> - 
                  dat is <strong>4x sneller</strong> dan een supermarkt automaat.
                </p>
                <div className="bg-[#4db8a8]/10 dark:bg-[#4db8a8]/20 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-[#1a3a52] dark:text-white">
                    500 flessen inleveren? Bij REPAYZ: 5 minuten. Bij supermarkt: 20-30 minuten.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Distance & Directions */}
      <section className="bg-gray-50 dark:bg-[#1a2f3f] border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-12 text-center">
            Vanaf {village.name} Naar REPAYZ
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
            <Card className="border-2 border-[#4db8a8] dark:bg-[#0d1f2d] text-center">
              <CardContent className="p-6">
                <Navigation className="w-12 h-12 text-[#4db8a8] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1a3a52] dark:text-white mb-2">Afstand</h3>
                <p className="text-3xl font-bold text-[#4db8a8]">{village.distance}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">vanaf {village.name}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#4db8a8] dark:bg-[#0d1f2d] text-center">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-[#4db8a8] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1a3a52] dark:text-white mb-2">Reistijd</h3>
                <p className="text-3xl font-bold text-[#4db8a8]">{village.driveTime}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">met de auto</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#4db8a8] dark:bg-[#0d1f2d] text-center">
              <CardContent className="p-6">
                <MapPin className="w-12 h-12 text-[#4db8a8] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1a3a52] dark:text-white mb-2">Adres</h3>
                <p className="text-lg font-semibold text-[#1a3a52] dark:text-white">Sprendlingenstraat 20B</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">5061 KN Oisterwijk</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 dark:bg-[#0d1f2d] text-center">
              <CardContent className="p-6">
                <ParkingCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1a3a52] dark:text-white mb-2">Parkeren</h3>
                <p className="text-3xl font-bold text-green-500">Gratis</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Direct naast machine</p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-[#4db8a8] dark:bg-[#0d1f2d]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#1a3a52] dark:text-white mb-3 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#4db8a8]" />
                  Route vanaf {village.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {village.directions} <strong className="text-[#4db8a8]">Gratis en makkelijk parkeren 
                  direct naast de machine</strong> - ideaal voor het <strong>gemakkelijk uitladen</strong> van 
                  grote hoeveelheden statiegeld zonder sjouwen!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Adres:</strong> Sprendlingenstraat 20B, 5061 KN Oisterwijk
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-8 text-center">
            Route naar REPAYZ Bulkautomaat
          </h2>
          <div className="rounded-xl overflow-hidden border-2 border-[#4db8a8] shadow-lg">
            <iframe
              src={village.mapEmbedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Route van ${village.name} naar REPAYZ Oisterwijk`}
            />
          </div>
        </div>
      </section>

      {/* Direct Betaling via Tikkie */}
      <section className="bg-gray-50 dark:bg-[#1a2f3f] border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-6">
              Direct Betaling via Tikkie
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Na het inleveren ontvang je direct een <strong className="text-[#4db8a8]">Tikkie</strong> op je telefoon. 
              Binnen enkele seconden staat het geld op je rekening. Geen bonnetje, geen wachten bij de kassa - 
              gewoon <strong>direct geld</strong> of <strong>doneer aan Sociaal Huis Oisterwijk</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-12 text-center">
            Veelgestelde Vragen
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Openingstijden */}
      <section className="bg-gray-50 dark:bg-[#1a2f3f] border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-8">
              Openingstijden
            </h2>
            <Card className="border-[#4db8a8] dark:bg-[#0d1f2d] mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a3a52] dark:text-white">REPAYZ Machine</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1a3a52] dark:text-white">Alle dagen</span>
                    <span className="text-[#4db8a8] font-bold">10:00 - 21:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#4db8a8] dark:bg-[#0d1f2d]">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a3a52] dark:text-white">
                  <a href="https://scooter-point.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#4db8a8] transition-colors">Scooterpoint</a>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1a3a52] dark:text-white">Dinsdag - Zaterdag</span>
                    <span className="text-[#4db8a8] font-bold">10:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1a3a52] dark:text-white">Maandag & Zondag</span>
                    <span className="text-gray-500 dark:text-gray-400">Gesloten</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ook Interessant - Internal Links */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white mb-8 text-center">
            Ook Interessant
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/hoe-het-werkt">
              <Card className="border-[#4db8a8] dark:bg-[#1a2f3f] hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 text-[#4db8a8] mx-auto mb-4" />
                  <h3 className="font-bold text-[#1a3a52] dark:text-white mb-2">Hoe werkt de bulkautomaat?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Ontdek hoe onze bulkmachine werkt en wat je kunt inleveren
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contact">
              <Card className="border-[#4db8a8] dark:bg-[#1a2f3f] hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <Phone className="w-12 h-12 text-[#4db8a8] mx-auto mb-4" />
                  <h3 className="font-bold text-[#1a3a52] dark:text-white mb-2">Neem contact op</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Vragen over bulk statiegeld inleveren? We helpen je graag!
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/">
              <Card className="border-[#4db8a8] dark:bg-[#1a2f3f] hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-12 h-12 text-[#4db8a8] mx-auto mb-4" />
                  <h3 className="font-bold text-[#1a3a52] dark:text-white mb-2">Meer info over REPAYZ</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Ontdek alle voordelen van onze bulkautomaat
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-6">
            Klaar Om Te Recyclen Met Onze Bulkautomaat?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Vanaf {village.name} ben je binnen <strong className="text-[#4db8a8]">{village.driveTime}</strong> bij REPAYZ. 
            Lever je <strong>bulk statiegeld</strong> in en verdien direct geld via Tikkie!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={village.mapEmbedUrl.replace('/embed?', '/dir/?').replace('&output=embed', '')} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-[#4db8a8] hover:bg-[#3da898] text-white w-full sm:w-auto">
                <Navigation className="w-5 h-5 mr-2" />
                Bekijk Route in Google Maps
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-[#4db8a8] text-[#4db8a8] hover:bg-[#4db8a8]/10 dark:border-[#4db8a8] dark:text-[#4db8a8] w-full sm:w-auto">
                Stel Een Vraag
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
