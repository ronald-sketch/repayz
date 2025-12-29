// @ts-nocheck
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { CheckCircle, Clock, Zap, Heart, Leaf, TrendingUp, HelpCircle, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect } from "react";
import WallyPromo from "@/components/WallyPromo";

export default function StatiegeldInleveren() {
  // Add structured data for SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": ["RecyclingCenter", "FAQPage"],
      "name": "REPAYZ - Officieel Statiegeld Nederland Inleverpunt",
      "description": "Een van de snelste Statiegeld Nederland inleverpunten. Partner van Verpact. 120 items per minuut, direct geld via Tikkie, recycle met maatschappelijke impact.",
      "url": "https://repayz.nl/statiegeld-inleveren",
      "areaServed": {
        "@type": "Country",
        "name": "Netherlands"
      },
      "memberOf": {
        "@type": "Organization",
        "name": "Statiegeld Nederland",
        "url": "https://www.statiegeldnederland.nl"
      },
      "parentOrganization": {
        "@type": "Organization",
        "name": "Verpact",
        "url": "https://www.verpact.nl"
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Processing Speed",
          "value": "120 items per minute"
        },
        {
          "@type": "PropertyValue",
          "name": "Payment Method",
          "value": "Tikkie instant payment"
        },
        {
          "@type": "PropertyValue",
          "name": "Certification",
          "value": "Official Statiegeld Nederland partner"
        }
      ],
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Wat is een Statiegeld Nederland inleverpunt?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Een officieel erkend inleverpunt waar je je statiegeld flessen en blikjes kunt inleveren. REPAYZ is een gecertificeerde partner locatie van Statiegeld Nederland en Verpact."
          }
        },
        {
          "@type": "Question",
          "name": "Hoe snel kan ik statiegeld inleveren bij REPAYZ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bij REPAYZ kun je tot 120 items per minuut inleveren - een van de snelste machines van Nederland. Geen lange wachttijden meer!"
          }
        },
        {
          "@type": "Question",
          "name": "Hoe ontvang ik mijn statiegeld?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Je ontvangt je statiegeld direct op je bankrekening via Tikkie. Geen vouchers, geen wachten bij de kassa - gewoon instant geld binnen enkele seconden."
          }
        },
        {
          "@type": "Question",
          "name": "Kan ik mijn statiegeld doneren?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ja! Bij REPAYZ kun je kiezen om je statiegeld te doneren aan goede doelen. Zo combineer je recycling met maatschappelijke impact."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-[#0d1f2d] dark:to-[#1a3a52]">
      <SEOHead
        title="Statiegeld Inleveren - REPAYZ Officieel Inleverpunt | 120 Items/Min"
        description="Een van de snelste Statiegeld Nederland inleverpunten. Partner van Verpact. 120 items per minuut, direct geld via Tikkie, recycle met maatschappelijke impact."
        canonicalUrl="https://repayz.nl/statiegeld-inleveren"
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-[#1a3a52] to-[#2d5a7b] dark:from-[#0d1f2d] dark:to-[#1a3a52]">
          <div className="container mx-auto max-w-6xl">
            {/* Partnership Badges */}
            <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-4 md:gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg border border-white/20 text-center">
                <p className="text-white/90 text-sm font-medium">✓ Officieel Statiegeld Nederland Inleverpunt</p>
              </div>
              <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg border border-white/20 text-center">
                <p className="text-white/90 text-sm font-medium">✓ Partner van Verpact</p>
              </div>
              <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg border border-white/20 text-center">
                <p className="text-white/90 text-sm font-medium">✓ Tikkie Betaling</p>
              </div>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Snelste <span className="text-[#4db8a8]">Bulkautomaat</span> voor Statiegeld Nederland
              </h1>
              <p className="text-2xl text-gray-200 dark:text-gray-300 mb-4">
                Bulkmachine 120 Items/Min | Gratis Parkeren | Direct Tikkie | Geen Wachtrij
              </p>
              <p className="text-xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto">
                Lever grote hoeveelheden statiegeld in bij onze <strong>bulkautomaat</strong> in Oisterwijk. Officieel erkend Statiegeld Nederland inleverpunt met <strong>gratis parkeren direct naast de machine</strong>. Perfect voor horeca, evenementen en iedereen die snel bulk statiegeld wil inleveren!
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-white/10 dark:bg-[#1a3a52]/50 border-[#4db8a8]/30 backdrop-blur">
                <CardContent className="pt-6 text-center">
                  <Zap className="w-12 h-12 text-[#4db8a8] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">120 Items/Minuut</h3>
                  <p className="text-gray-300">Snelste technologie beschikbaar</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 dark:bg-[#1a3a52]/50 border-[#4db8a8]/30 backdrop-blur">
                <CardContent className="pt-6 text-center">
                  <Clock className="w-12 h-12 text-[#4db8a8] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Direct Uitbetaling</h3>
                  <p className="text-gray-300">Geld binnen seconden via Tikkie</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 dark:bg-[#1a3a52]/50 border-[#4db8a8]/30 backdrop-blur">
                <CardContent className="pt-6 text-center">
                  <Heart className="w-12 h-12 text-[#4db8a8] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Sociale Impact</h3>
                  <p className="text-gray-300">Doneer aan goede doelen</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Wally AI Promo */}
        <WallyPromo 
          title="Vraag Wally - De Eerste Statiegeld AI van Nederland!"
          description="Vragen over statiegeld inleveren? Vraag Wally voor directe antwoorden. Beschikbaar 24/7!"
          buttonText="💬 Open Chat"
        />

        {/* Trust & Certification Section */}
        <section className="py-16 px-4 bg-white dark:bg-[#0d1f2d]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Award className="w-16 h-16 text-[#4db8a8] mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 dark:text-white">
                Erkend door Statiegeld Nederland
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                REPAYZ is een officieel partner van Statiegeld Nederland en Verpact. Dit betekent dat wij voldoen aan alle kwaliteitseisen en normen voor statiegeld inname in Nederland.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="dark:bg-[#1a3a52] border-2 border-[#4db8a8]/30">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-[#4db8a8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-[#4db8a8]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Officieel Erkend</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Gecertificeerd Statiegeld Nederland inleverpunt sinds 2025
                  </p>
                </CardContent>
              </Card>

              <Card className="dark:bg-[#1a3a52] border-2 border-[#4db8a8]/30">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-[#4db8a8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-[#4db8a8]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Verpact Partner</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Partner van Verpact, beheerder van het statiegeld systeem
                  </p>
                </CardContent>
              </Card>

              <Card className="dark:bg-[#1a3a52] border-2 border-[#4db8a8]/30">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-[#4db8a8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-[#4db8a8]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Moderne Technologie</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Innovatieve inname met Tikkie integratie
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Recycling Matters */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-[#1a3a52]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Leaf className="w-16 h-16 text-[#4db8a8] mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 dark:text-white">
                Waarom Statiegeld Belangrijk Is
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Elk flesje en blikje dat je inlevert maakt verschil voor onze planeet
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="dark:bg-[#0d1f2d]">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-4 text-[#4db8a8]">🌍 Milieu Impact</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <span><strong>90% recycling doelstelling</strong> - Statiegeld helpt Nederland deze Europese norm te halen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <span><strong>Minder zwerfafval</strong> - Flessen en blikjes belanden niet in de natuur</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <span><strong>Circulaire economie</strong> - Materialen worden hergebruikt voor nieuwe producten</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <span><strong>CO2 reductie</strong> - Recycling bespaart energie en vermindert uitstoot</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="dark:bg-[#0d1f2d]">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-4 text-[#4db8a8]">❤️ Sociale Impact</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <span><strong>Recycled met impact</strong> - Doneer jouw statiegeld aan goede doelen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <span><strong>Lokaal welzijn</strong> - Steun mensen in nood in jouw regio</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <span><strong>100% transparant</strong> - Elk gedoneerd bedrag gaat volledig naar het goede doel</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <span><strong>Jij kiest</strong> - Geld op je rekening of donatie, de keuze is aan jou</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why REPAYZ Better Than Supermarkets */}
        <section className="py-16 px-4 bg-white dark:bg-[#0d1f2d]">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-4 dark:text-white">
              REPAYZ vs Traditionele Inleverpunten
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg">
              Vergelijk onze service met supermarkt automaten
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* REPAYZ Column */}
              <Card className="border-2 border-[#4db8a8] dark:bg-[#1a3a52]">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-6 text-[#4db8a8] text-center">✅ REPAYZ</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <div>
                        <strong className="dark:text-white">120 items/minuut</strong>
                        <p className="text-gray-600 dark:text-gray-400">Supersnel inleveren</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <div>
                        <strong className="dark:text-white">Direct geld via Tikkie</strong>
                        <p className="text-gray-600 dark:text-gray-400">Binnen seconden op je rekening</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <div>
                        <strong className="dark:text-white">Gratis parkeren</strong>
                        <p className="text-gray-600 dark:text-gray-400">Makkelijk in- en uitladen</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <div>
                        <strong className="dark:text-white">Geen wachtrijen</strong>
                        <p className="text-gray-600 dark:text-gray-400">Altijd beschikbaar</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#4db8a8] flex-shrink-0 mt-1" />
                      <div>
                        <strong className="dark:text-white">Donatie optie</strong>
                        <p className="text-gray-600 dark:text-gray-400">Recycled met maatschappelijke impact</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Supermarket Column */}
              <Card className="border-2 border-gray-300 dark:bg-[#1a3a52] dark:border-gray-700">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-6 text-gray-600 dark:text-gray-400 text-center">❌ Supermarkt</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🐌</span>
                      <div>
                        <strong className="dark:text-white">Langzame machines</strong>
                        <p className="text-gray-600 dark:text-gray-400">Vaak kapot of vol</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🎫</span>
                      <div>
                        <strong className="dark:text-white">Voucher systeem</strong>
                        <p className="text-gray-600 dark:text-gray-400">Wachten bij kassa, voucher vergeten</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🚗</span>
                      <div>
                        <strong className="dark:text-white">Betaald parkeren</strong>
                        <p className="text-gray-600 dark:text-gray-400">Extra kosten en gedoe</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <strong className="dark:text-white">Lange wachttijden</strong>
                        <p className="text-gray-600 dark:text-gray-400">Druk in weekend</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">💸</span>
                      <div>
                        <strong className="dark:text-white">Geen donatie optie</strong>
                        <p className="text-gray-600 dark:text-gray-400">Alleen voucher mogelijk</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-[#1a3a52]">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-12 dark:text-white">Hoe Werkt Het?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#4db8a8] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white">Breng Je Statiegeld</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Verzamel je lege flessen en blikjes. Bezoek een REPAYZ locatie bij jou in de buurt.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#4db8a8] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white">Lever In</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Stop je items in de machine. Tot 120 per minuut! Kies Tikkie betaling of doneer aan een goed doel.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#4db8a8] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white">Ontvang of Doneer</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Scan de QR-code voor direct geld via Tikkie, of kies donatie voor maatschappelijke impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white dark:bg-[#0d1f2d]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <HelpCircle className="w-16 h-16 text-[#4db8a8] mx-auto mb-4" />
              <h2 className="text-4xl font-bold dark:text-white mb-4">
                Veelgestelde Vragen Over Statiegeld Inleveren
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-gray-50 dark:bg-[#1a3a52] rounded-lg px-6 border dark:border-gray-700">
                <AccordionTrigger className="text-left font-semibold dark:text-white hover:text-[#4db8a8]">
                  Wat is een Statiegeld Nederland inleverpunt?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Een officieel erkend inleverpunt waar je je statiegeld flessen en blikjes kunt inleveren. REPAYZ is een gecertificeerde partner locatie van Statiegeld Nederland en Verpact. Dit betekent dat wij voldoen aan alle kwaliteitseisen en normen.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-gray-50 dark:bg-[#1a3a52] rounded-lg px-6 border dark:border-gray-700">
                <AccordionTrigger className="text-left font-semibold dark:text-white hover:text-[#4db8a8]">
                  Hoe snel kan ik statiegeld inleveren?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Bij REPAYZ kun je tot 120 items per minuut inleveren - een van de snelste machines van Nederland. Geen lange wachttijden meer zoals bij traditionele supermarkt automaten die vaak 20-30 items per minuut doen.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-gray-50 dark:bg-[#1a3a52] rounded-lg px-6 border dark:border-gray-700">
                <AccordionTrigger className="text-left font-semibold dark:text-white hover:text-[#4db8a8]">
                  Hoe ontvang ik mijn statiegeld?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Je ontvangt je statiegeld direct op je bankrekening via Tikkie. Geen vouchers, geen wachten bij de kassa - gewoon instant geld binnen enkele seconden. Je hoeft geen Tikkie app te hebben, alleen een smartphone en je IBAN nummer.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-gray-50 dark:bg-[#1a3a52] rounded-lg px-6 border dark:border-gray-700">
                <AccordionTrigger className="text-left font-semibold dark:text-white hover:text-[#4db8a8]">
                  Welke flessen en blikjes worden geaccepteerd?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Wij accepteren alle flessen en blikjes met statiegeld: plastic flessen (klein €0,15 en groot €0,25) en aluminium blikjes (€0,15). De machine controleert automatisch of items geldig zijn voor statiegeld. Glas accepteren we niet - dat moet naar de glasbak.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-gray-50 dark:bg-[#1a3a52] rounded-lg px-6 border dark:border-gray-700">
                <AccordionTrigger className="text-left font-semibold dark:text-white hover:text-[#4db8a8]">
                  Kan ik mijn statiegeld doneren?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Ja! Bij REPAYZ kun je kiezen om je statiegeld te doneren aan goede doelen. Zo combineer je recycling met maatschappelijke impact. 100% van je donatie gaat naar het goede doel - wij houden niets in.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-gray-50 dark:bg-[#1a3a52] rounded-lg px-6 border dark:border-gray-700">
                <AccordionTrigger className="text-left font-semibold dark:text-white hover:text-[#4db8a8]">
                  Is REPAYZ echt erkend door Statiegeld Nederland?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Ja! We zijn een officiële partner van Statiegeld Nederland en Verpact. Je kunt ons vinden in de officiële locatiewijzer op statiegeldnederland.nl. We worden regelmatig gecontroleerd om te zorgen dat we aan alle kwaliteitseisen voldoen.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-gray-50 dark:bg-[#1a3a52] rounded-lg px-6 border dark:border-gray-700">
                <AccordionTrigger className="text-left font-semibold dark:text-white hover:text-[#4db8a8]">
                  Waarom is REPAYZ sneller dan supermarkt automaten?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  We gebruiken moderne bulk-inname technologie die tot 120 items per minuut kan verwerken. Traditionele supermarkt automaten verwerken items één voor één en halen meestal maar 20-30 items per minuut. Dat scheelt enorm als je veel flessen en blikjes hebt!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="bg-gray-50 dark:bg-[#1a3a52] rounded-lg px-6 border dark:border-gray-700">
                <AccordionTrigger className="text-left font-semibold dark:text-white hover:text-[#4db8a8]">
                  Wat gebeurt er met de flessen en blikjes na inleveren?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Ze worden gerecycled en gebruikt om nieuwe flessen en blikjes te maken. Dit is onderdeel van de circulaire economie: materialen worden hergebruikt in plaats van weggegooid. Zo besparen we grondstoffen, energie en CO2 uitstoot.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="bg-gray-50 dark:bg-[#1a3a52] rounded-lg px-6 border dark:border-gray-700">
                <AccordionTrigger className="text-left font-semibold dark:text-white hover:text-[#4db8a8]">
                  Hoeveel statiegeld krijg ik per fles/blikje?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Kleine flessen (tot 1 liter): €0,15 | Grote flessen (1 liter en meer): €0,25 | Blikjes: €0,15. Dit zijn de officiële Statiegeld Nederland tarieven die voor heel Nederland gelden.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="bg-gray-50 dark:bg-[#1a3a52] rounded-lg px-6 border dark:border-gray-700">
                <AccordionTrigger className="text-left font-semibold dark:text-white hover:text-[#4db8a8]">
                  Is er een maximum aantal flessen dat ik kan inleveren?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  Nee, geen limiet! Onze machine kan grote hoeveelheden aan. Perfect voor als je lange tijd hebt gespaard of als je flessen verzamelt van evenementen, kantoren of verenigingen.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#4db8a8] to-[#3da898]">
          <div className="container mx-auto max-w-4xl text-center">
            <Users className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Klaar Om Te Recyclen Met Impact?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Bezoek een REPAYZ locatie en ervaar de snelste manier om statiegeld in te leveren bij een officieel Statiegeld Nederland inleverpunt!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/locatie" 
                className="inline-block bg-white text-[#4db8a8] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Vind Een Locatie
              </a>
              <a 
                href="/hoe-het-werkt" 
                className="inline-block bg-[#1a3a52] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#2d5a7b] transition-colors"
              >
                Hoe Het Werkt
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
