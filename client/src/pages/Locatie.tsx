// @ts-nocheck
import { MapPin } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbsSchema } from "@/components/BreadcrumbsSchema";

export default function Locatie() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-[#0d1f2d] dark:to-[#1a2f3f]">
      {/* SEO Meta Tags */}
      <SEOHead 
        title="REPAYZ Locatie Oisterwijk - Adres, Openingstijden & Routebeschrijving"
        description="Vind de REPAYZ recycling machine in Oisterwijk. Bekijk ons adres, openingstijden (dagelijks 10:00-21:00) en routebeschrijving. Lever je flessen en blikjes in bij onze Envipco Quantum machine."
        keywords="REPAYZ locatie, REPAYZ Oisterwijk adres, recycling machine Oisterwijk, openingstijden REPAYZ, statiegeld inleveren Oisterwijk centrum"
        ogTitle="REPAYZ Locatie - Oisterwijk Centrum"
        ogDescription="Bezoek REPAYZ in Oisterwijk centrum. Dagelijks 10:00-21:00. Lever je flessen en blikjes in en ontvang direct statiegeld!"
        canonicalUrl="https://repayz.nl/locatie"
      />
      <BreadcrumbsSchema items={[
        { name: "Home", url: "https://repayz.nl/" },
        { name: "Locatie", url: "https://repayz.nl/locatie" }
      ]} />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Binnenkort Beschikbaar
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-navy-900 dark:text-white mb-6">
              Waar vind je REPAYZ?
            </h1>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Sprendlingenstraat 20B
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              5061 KN Oisterwijk
            </p>
          </div>
        </section>

        {/* Map Section with Green Circle */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl">
            <div className="relative bg-white dark:bg-[#1a2f3f] rounded-2xl shadow-xl overflow-hidden">
              {/* Map Image - Using OpenStreetMap static image */}
              <div className="relative w-full h-[500px] md:h-[600px]">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=5.1845%2C51.5795%2C5.2045%2C51.5895&layer=mapnik&marker=51.5845%2C5.1945"
                  style={{ border: 0 }}
                  title="REPAYZ Oisterwijk - Sprendlingenstraat 20B"
                />
              </div>



              {/* Info Card at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1a2f3f]/95 backdrop-blur-sm p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">
                    📍 Sprendlingenstraat 20B
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-200 mb-2">
                    5061 KN Oisterwijk
                  </p>
                  <p className="text-sm text-[#4db8a8] dark:text-[#4db8a8] font-semibold">
                    dagelijks open van 10:00 tot 21:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Klaar voor Verandering?
            </h2>
            <p className="text-xl mb-8 text-teal-100">
              Bied je aan als REPAYZ-gemeenschap en maak het verschil voor jouw buurt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hoe-het-werkt">
                <button className="px-8 py-4 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 dark:bg-gray-800 transition-colors">
                  Lees Hoe Het Werkt
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
