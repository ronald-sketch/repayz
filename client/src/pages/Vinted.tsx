// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shirt, Recycle, TrendingUp, Heart, Package, Clock } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbsSchema } from "@/components/BreadcrumbsSchema";

export default function Vinted() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1f2d] transition-colors">
      {/* SEO Meta Tags */}
      <SEOHead 
        title="Vinted Go Locker Oisterwijk - Tweedehands Kleding Verkopen & Versturen"
        description="Vinted Go locker bij REPAYZ Oisterwijk. Verkoop je tweedehands kleding via Vinted en gebruik de locker 24/7 voor versturen en ophalen van pakketten. Duurzaam en lokaal!"
        keywords="Vinted Go locker Oisterwijk, Vinted pakketpunt, tweedehands kleding verkopen, Vinted versturen Brabant, circulaire economie Oisterwijk"
        ogTitle="Vinted Go Locker bij REPAYZ Oisterwijk"
        ogDescription="Verkoop je tweedehands kleding via Vinted en gebruik onze 24/7 locker voor versturen en ophalen. Duurzaam en makkelijk!"
        canonicalUrl="https://repayz.nl/vinted-go"
      />
      <BreadcrumbsSchema items={[
        { name: "Home", url: "https://repayz.nl/" },
        { name: "Vinted Go", url: "https://repayz.nl/vinted-go" }
      ]} />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1a3a52] to-[#0d1f2d] text-white py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Vinted Go Locker bij REPAYZ
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mb-4">
              Draag je het niet? Verkoop het dan en get REPAYZ!
            </p>
            <p className="text-lg text-gray-400 dark:text-gray-200 max-w-3xl">
              Tweedehands kleding verkopen via Vinted is niet alleen goed voor je portemonnee, maar ook voor het milieu. Bij dezelfde locatie als onze recycling machine vind je de Vinted Go Locker - super handig!
            </p>
          </div>
          {/* Scroll Indicator */}
          <div className="container flex justify-center mt-8 animate-bounce md:hidden">
            <div className="flex flex-col items-center gap-2 text-[#4db8a8]">
              <span className="text-sm font-semibold">Scroll voor meer</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section className="py-16 bg-gray-50 dark:bg-[#1a3a52]">
          <div className="container">
            <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-8 text-center">
              Zie Hoe Vinted Go Werkt
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Bekijk deze video om te zien hoe eenvoudig het is om je tweedehands kleding te verkopen via de Vinted Go Locker.
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/BkcnDGfEOck"
                  title="Vinted Go Locker - Hoe Het Werkt"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-white dark:bg-[#0d1f2d]">
          <div className="container">
            <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-4 text-center">
              De Impact van Tweedehands Kleding
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Door kleding die je niet meer draagt te verkopen in plaats van weg te gooien, maak je een enorm verschil voor het milieu én je portemonnee.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Environmental Impact */}
              <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8]/10 flex items-center justify-center mx-auto mb-6">
                    <Recycle className="w-8 h-8 text-[#4db8a8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Minder Afval</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Elk kledingstuk dat een tweede leven krijgt, is er één die niet op de vuilnisbelt belandt. De mode-industrie produceert jaarlijks miljoenen tonnen textielafval.
                  </p>
                </CardContent>
              </Card>

              {/* CO2 Reduction */}
              <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8]/10 flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-8 h-8 text-[#4db8a8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Lagere CO₂-uitstoot</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Het produceren van nieuwe kleding kost enorm veel water en energie. Tweedehands kopen en verkopen vermindert de vraag naar nieuwe productie.
                  </p>
                </CardContent>
              </Card>

              {/* Extra Income */}
              <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8]/10 flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-[#4db8a8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Extra Geld</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Verdien geld met kleding die toch in je kast hangt! Geef je oude favorieten een nieuw leven bij iemand anders en verdien er nog aan ook.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-[#4db8a8] to-[#3a9688] text-white rounded-lg p-8 text-center max-w-3xl mx-auto">
              <Shirt className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Draag Je Het Niet? Verkoop Het Dan!</h3>
              <p className="text-lg mb-6">
                Combineer je recycling trip met het versturen van je Vinted verkopen. Beide machines staan op dezelfde locatie - dubbel duurzaam, dubbel handig!
              </p>
              <a 
                href="https://www.vinted.nl" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="bg-white text-[#1a3a52] dark:text-white hover:bg-gray-100 dark:bg-gray-800 border-white">
                  Start met Verkopen op Vinted
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50 dark:bg-[#1a3a52]">
          <div className="container">
            <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-12 text-center">
              Hoe Werkt De Vinted Go Locker?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-[#1a2f3f]">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8] text-white flex items-center justify-center text-2xl font-bold mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-4">Verkoop op Vinted</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Plaats je kleding te koop op Vinted. Zodra iemand je item koopt, krijg je een verzendlabel en instructies voor de Vinted Go Locker.
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-[#1a2f3f]">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8] text-white flex items-center justify-center text-2xl font-bold mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-4">Pak Je Item In</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Verpak je verkochte kledingstuk stevig en plak het verzendlabel erop. Zorg dat het pakket goed dicht zit en het label goed leesbaar is.
                  </p>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-[#1a2f3f]">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8] text-white flex items-center justify-center text-2xl font-bold mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-4">Drop Bij De Locker</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Scan de QR-code bij de Vinted Go Locker, volg de instructies op het scherm, en leg je pakket in het vakje. Klaar!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Location Info */}
        <section className="py-16 bg-white dark:bg-[#0d1f2d]">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-[#4db8a8]/10 flex items-center justify-center">
                      <Package className="w-8 h-8 text-[#4db8a8]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1a3a52] dark:text-white mb-4">
                        Vinted Go Locker bij REPAYZ
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        De Vinted Go Locker staat op dezelfde locatie als onze REPAYZ recycling machine. Zo kun je in één keer je flessen en blikjes recyclen én je Vinted verkopen versturen!
                      </p>
                      <div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-100">
                        <Clock className="w-5 h-5 text-[#4db8a8]" />
                        <span className="font-semibold">Openingstijden:</span>
                        <span>10:00 - 21:00 (dagelijks)</span>
                      </div>
                      <div className="mt-6">
                        <Link href="/locatie">
                          <Button className="bg-[#4db8a8] hover:bg-[#3a9688]">
                            Bekijk Locatie & Contact
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-to-br from-[#1a3a52] to-[#0d1f2d] text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Klaar om Duurzaam te Worden?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Recycle je flessen en blikjes, verkoop je ongebruikte kleding, en maak impact. Alles op één plek!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.vinted.nl" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-[#4db8a8] hover:bg-[#3a9688]">
                  Start op Vinted
                </Button>
              </a>
              <Link href="/hoe-het-werkt">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Leer over REPAYZ Recycling
                </Button>
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
