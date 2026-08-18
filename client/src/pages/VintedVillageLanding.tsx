// @ts-nocheck
import { ADDRESS, OPENING_HOURS } from "@shared/facts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, ArrowRight, Navigation, Package, ParkingCircle } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import WallyPromo from "@/components/WallyPromo";

interface VintedVillageData {
  name: string;
  distance: string;
  driveTime: string;
  directions: string;
  mapEmbedUrl: string;
  slug: string;
}

interface VintedVillageLandingProps {
  village: VintedVillageData;
}

export default function VintedVillageLanding({ village }: VintedVillageLandingProps) {
  // Structured data for local SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Vinted Go Locker bij REPAYZ Oisterwijk",
    "description": `Vinted Go Locker voor inwoners van ${village.name}. Verstuur en ontvang je Vinted pakketten eenvoudig bij REPAYZ in Oisterwijk.`,
    "areaServed": {
      "@type": "City",
      "name": village.name
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": ADDRESS.street,
      "addressLocality": "Oisterwijk",
      "postalCode": "5061 KN",
      "addressCountry": "NL"
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1f2d] transition-colors">
      <SEOHead 
        title={`Vinted Go Locker ${village.name} | REPAYZ Oisterwijk`}
        description={`Vinted Go Locker in ${village.name}? Verstuur en ontvang je Vinted pakketten bij REPAYZ in Oisterwijk, op slechts ${village.driveTime} rijden. Dagelijks open ${OPENING_HOURS.range}.`}
        keywords={`Vinted Go Locker ${village.name}, Vinted ${village.name}, Vinted pakketpunt ${village.name}, tweedehands kleding ${village.name}`}
        ogTitle={`Vinted Go Locker ${village.name} | REPAYZ`}
        ogDescription={`Vinted Go Locker bij REPAYZ Oisterwijk - makkelijk bereikbaar met gratis parkeren. Slechts ${village.driveTime} vanaf ${village.name}.`}
        canonicalUrl={`https://repayz.nl/${village.slug}`}
      />
      <StructuredData data={localBusinessSchema} />
      
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full mb-6">
            <Package className="w-4 h-4" />
            <span className="text-sm font-semibold">Vanuit {village.name}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a52] dark:text-white mb-6">
            Vinted Go Locker in <span className="text-purple-600 dark:text-purple-400">{village.name}</span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Woon je in {village.name}? De Vinted Go Locker bij REPAYZ in Oisterwijk is makkelijk bereikbaar vanuit {village.name}. 
            Verstuur en ontvang je Vinted pakketten eenvoudig. 
            <strong className="text-purple-600 dark:text-purple-400">Gratis parkeren direct naast de locker</strong> - geen gedoe met betaald parkeren of ver lopen!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/locatie">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                <MapPin className="w-5 h-5 mr-2" />
                Bekijk Locatie & Route
              </Button>
            </Link>
            <Link href="/vinted">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                Meer Over Vinted Go
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Wally AI Promo */}
      <WallyPromo 
        title="Vraag Wally - De Eerste Statiegeld AI!"
        description="Vragen over Vinted Go? Vraag Wally voor directe antwoorden over de locker, verzending en ophalen. 24/7 beschikbaar!"
        buttonText="💬 Open Chat"
      />

      {/* Distance & Info */}
      <section className="bg-purple-50 dark:bg-[#1a3a52] border-y border-purple-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-purple-500 dark:bg-[#1a2f3f] text-center">
              <CardContent className="p-6">
                <Navigation className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1a3a52] dark:text-white mb-2">Afstand</h3>
                <p className="text-3xl font-bold text-purple-600">{village.distance}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">vanaf {village.name}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500 dark:bg-[#1a2f3f] text-center">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1a3a52] dark:text-white mb-2">Reistijd</h3>
                <p className="text-3xl font-bold text-purple-600">{village.driveTime}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">met de auto</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500 dark:bg-[#1a2f3f] text-center">
              <CardContent className="p-6">
                <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1a3a52] dark:text-white mb-2">Adres</h3>
                <p className="text-lg font-semibold text-[#1a3a52] dark:text-white">{ADDRESS.street}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">5061 KN Oisterwijk</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 dark:bg-[#1a2f3f] text-center">
              <CardContent className="p-6">
                <ParkingCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1a3a52] dark:text-white mb-2">Parkeren</h3>
                <p className="text-3xl font-bold text-green-500">Gratis</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Auto parkeren naast locker</p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto mt-8">
            <Card className="border-purple-500 dark:bg-[#1a2f3f]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#1a3a52] dark:text-white mb-3 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-purple-600" />
                  Route vanaf {village.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {village.directions}
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
            Route naar Vinted Go Locker
          </h2>
          <div className="rounded-xl overflow-hidden border-2 border-purple-500 shadow-lg">
            <iframe
              src={village.mapEmbedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Route van ${village.name} naar Vinted Go Locker Oisterwijk`}
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-purple-50 dark:bg-[#1a3a52] border-y border-purple-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-12 text-center">
            Hoe Werkt Vinted Go?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-purple-500 dark:bg-[#1a2f3f]">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Verkoop op Vinted</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Plaats je tweedehands kleding op Vinted en kies Vinted Go als verzendmethode
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500 dark:bg-[#1a2f3f]">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Breng naar Locker</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Parkeer gratis bij REPAYZ en drop je pakket in de Vinted Go Locker
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500 dark:bg-[#1a2f3f]">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Ontvang Pakketten</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Gekocht op Vinted? Haal je pakket op bij dezelfde locker wanneer het je uitkomt
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500 dark:bg-[#1a2f3f]">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
                <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Dagelijks Open</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {OPENING_HOURS.range} uur, 7 dagen per week. Altijd tijd om je pakket op te halen!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-6">
            Klaar om te Vinted?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Vanaf {village.name} ben je binnen {village.driveTime} bij de Vinted Go Locker. 
            Gratis parkeren, makkelijk bereikbaar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/locatie">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                <MapPin className="w-5 h-5 mr-2" />
                Bekijk Openingstijden
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
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
