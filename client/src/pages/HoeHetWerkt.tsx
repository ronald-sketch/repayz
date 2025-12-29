// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, ArrowRight, Recycle, Coins, Shield } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData, { faqPageSchema } from "@/components/StructuredData";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbsSchema } from "@/components/BreadcrumbsSchema";
import { videoSchema, howToSchema } from "@/components/HowToSchema";
import { useSEO } from "@/hooks/useSEO";

export default function HoeHetWerkt() {
  // Dynamic SEO
  useSEO({
    title: 'Hoe Werkt REPAYZ? - Bulk Recycling in 3 Stappen | Envipco Quantum Oisterwijk',
    description: 'Ontdek hoe de Envipco Quantum machine werkt bij REPAYZ Oisterwijk. Stort je zak leeg, machine telt automatisch tot 120 items/min, ontvang direct statiegeld via Tikkie. Bulk recycling gemaakt gemakkelijk!',
    canonical: 'https://repayz.nl/hoe-het-werkt'
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1f2d] transition-colors">
      {/* SEO Meta Tags */}
      <SEOHead 
        title="Hoe Werkt REPAYZ? - Envipco Quantum Bulk Recycling Machine Oisterwijk"
        description="Ontdek hoe je flessen en blikjes in bulk kunt inleveren bij REPAYZ Oisterwijk. Envipco Quantum machine telt tot 120 items per minuut. Ontvang direct statiegeld via Tikkie of doneer aan Sociaal Huis."
        keywords="Envipco Quantum, bulk recycling, statiegeld machine, hoe werkt REPAYZ, flessen inleveren Oisterwijk, blikjes recyclen, Tikkie statiegeld"
        ogTitle="Hoe Werkt REPAYZ? - Bulk Recycling in 3 Stappen"
        ogDescription="Stort je zak leeg, machine telt automatisch, ontvang direct je statiegeld. Zo werkt de Envipco Quantum bij REPAYZ Oisterwijk!"
        canonicalUrl="https://repayz.nl/hoe-het-werkt"
      />
      {/* FAQ Structured Data for SEO */}
      <StructuredData data={faqPageSchema} />
      {/* Video Schema for YouTube video */}
      <StructuredData data={videoSchema} />
      {/* HowTo Schema for 3 steps */}
      <StructuredData data={howToSchema} />
      <BreadcrumbsSchema items={[
        { name: "Home", url: "https://repayz.nl/" },
        { name: "Hoe het werkt", url: "https://repayz.nl/hoe-het-werkt" }
      ]} />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1a3a52] to-[#0d1f2d] text-white py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hoe Werkt REPAYZ?
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Recyclen was nog nooit zo makkelijk! Onze geavanceerde Envipco Quantum machine maakt het mogelijk om in bulk te recyclen en direct je statiegeld terug te krijgen.
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
        <section className="py-16 bg-gray-50 dark:bg-[#1a2f3f]">
          <div className="container">
            <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-8 text-center">
              Zie Hoe Het Werkt
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
              Bekijk deze voorbeeldvideo van een concurrent om te zien hoe eenvoudig het is om flessen en blikjes in bulk in te leveren. REPAYZ gebruikt dezelfde Envipco Quantum technologie.
            </p>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8 italic">
              Let op: Dit is een video van een concurrent, niet van REPAYZ zelf.
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/DZ_0aqg3Zhg"
                  title="REPAYZ - Hoe Het Werkt"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Step by Step Process */}
        <section className="py-16 bg-white dark:bg-[#0d1f2d]">
          <div className="container">
            <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-12 text-center">
              In 3 Simpele Stappen
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Step 1 */}
              <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8] text-white flex items-center justify-center text-2xl font-bold mb-6">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-[#1a3a52] dark:text-white mb-4">Stort Je Zak Leeg</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Geen gedoe met één voor één inleveren! Stort je hele zak met lege flessen en blikjes direct in de machine. De open feed area maakt het super makkelijk - geen plakkerige flessen of blikjes hoeven aangeraakt te worden.
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8] text-white flex items-center justify-center text-2xl font-bold mb-6">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-[#1a3a52] dark:text-white mb-4">Machine Telt Automatisch</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Onze Quantum machine scant en telt tot 120 flessen en blikjes per minuut! PET flessen en blikjes worden automatisch herkend, gecompacteerd en opgeslagen. Items die niet geaccepteerd worden, krijg je meteen terug.
                  </p>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8] text-white flex items-center justify-center text-2xl font-bold mb-6">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-[#1a3a52] dark:text-white mb-4">Ontvang Je Geld</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Je krijgt een voucher met barcode die je via tikkie kunt inwisselen voor geld op je rekening. Of kies ervoor om het bedrag te doneren aan een lokaal goed doel. Jij bepaalt!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Accepted Items */}
        <section className="py-16 bg-gray-50 dark:bg-[#1a2f3f]">
          <div className="container">
            <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-4 text-center">
              Wat Accepteren We?
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Onze machine accepteert de meeste PET flessen en aluminium/stalen blikjes met statiegeld. Hieronder vind je een overzicht.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Accepted */}
              <Card className="border-2 border-green-500 dark:bg-[#1a2f3f]">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1a3a52] dark:text-white">Wel Geaccepteerd</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">PET flessen (klein en groot formaat)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Aluminium blikjes (frisdrank, bier, energy drinks)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Stalen blikjes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Flessen en blikjes van 100ml tot 3 liter</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Bekende merken met statiegeld</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Not Accepted */}
              <Card className="border-2 border-red-500 dark:bg-[#1a2f3f]">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1a3a52] dark:text-white">Niet Geaccepteerd</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Glazen flessen (van elk formaat)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Flessen en blikjes zonder statiegeld</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Beschadigde of vervormde flessen en blikjes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Flessen groter dan 3 liter</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Verpakkingen van voedsel of andere producten</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 max-w-4xl mx-auto">
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-[#1a3a52] dark:text-white">Let op:</strong> Items die niet aan de eisen voldoen worden automatisch teruggestuurd via de machine. Je kunt ze dan meteen uit de retour-opening halen en apart weggooien.
              </p>
            </div>
          </div>
        </section>

        {/* Machine Features */}
        <section className="py-16 bg-white dark:bg-[#0d1f2d]">
          <div className="container">
            <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-4 text-center">
              Onze Geavanceerde Technologie
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              De Envipco Quantum is een van de snelste en meest gebruiksvriendelijke recycling machines ter wereld.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-gray-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8]/10 flex items-center justify-center mx-auto mb-6">
                    <Recycle className="w-8 h-8 text-[#4db8a8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Super Snel</h3>
                  <p className="text-gray-600">
                    Tot <strong>120 flessen en blikjes per minuut</strong> - geen lange wachttijden meer!
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8]/10 flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-[#4db8a8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Touchless & Hygiënisch</h3>
                  <p className="text-gray-600">
                    Geen aanraking nodig - stort je zak leeg en de machine doet de rest.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#4db8a8]/10 flex items-center justify-center mx-auto mb-6">
                    <Coins className="w-8 h-8 text-[#4db8a8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">100% Statiegeld Terug</h3>
                  <p className="text-gray-600">
                    Je krijgt het volledige statiegeld terug voor elke geaccepteerde fles of blikje.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How Payment Works */}
        <section className="py-16 bg-gray-50 dark:bg-[#1a2f3f]">
          <div className="container">
            <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-12 text-center">
              Hoe Werkt De Uitbetaling?
            </h2>

            <div className="max-w-3xl mx-auto">
              <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#4db8a8] text-white flex items-center justify-center font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1a3a52] dark:text-white mb-2">QR-Code Scannen</h4>
                        <p className="text-gray-600">
                          Na het inleveren toont de machine een QR-code op het scherm met het totaalbedrag van je statiegeld.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#4db8a8] text-white flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1a3a52] dark:text-white mb-2">Kies Je Optie</h4>
                        <p className="text-gray-600">
                          <strong>Geld ontvangen:</strong> Scan de QR-code met je telefoon en open de Tikkie app. Het bedrag wordt direct naar je bankrekening overgemaakt.<br/><br/>
                          <strong>Doneren:</strong> Kies op het scherm voor donatie aan een lokaal goed doel. Het bedrag wordt automatisch gedoneerd.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-blue-700">Snel & Veilig:</strong> Met Tikkie ontvang je je statiegeld binnen enkele seconden direct op je bankrekening. Geen gedoe met vouchers of wachten bij de kassa!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-[#1a3a52] to-[#0d1f2d] text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">
              Klaar Om Te Beginnen Met Recyclen?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Bezoek onze locatie in Oisterwijk en ervaar zelf hoe makkelijk recyclen kan zijn met REPAYZ!
            </p>
            <Link href="/">
              <Button size="lg" className="bg-[#4db8a8] hover:bg-[#3da090] text-white">
                Vind Onze Locatie
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
