// @ts-nocheck
import { ADDRESS, CONTACT, OPENING_HOURS } from "@shared/facts";
import { CheckCircle2, ExternalLink, ArrowRight, Zap, Heart } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function StatiegeldNederland() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "REPAYZ - Officieel Statiegeld Nederland Partner",
    "image": "https://repayz.nl/repayz-logo-vertical.png",
    "description": "REPAYZ is een officieel erkend statiegeld innamepunt van Statiegeld Nederland en Verpact. De snelste bulkmachine van Nederland met 120 items per minuut.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": ADDRESS.street,
      "addressLocality": "Oisterwijk",
      "postalCode": "5061 KN",
      "addressCountry": "NL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.5792,
      "longitude": 5.1889
    },
    "url": "https://repayz.nl/statiegeld-nederland",
    // telephone weggelaten zolang CONTACT.telephone niet bevestigd is;
    // hier stond een verzonnen nummer in gepubliceerde JSON-LD.
    ...(CONTACT.telephone ? { telephone: CONTACT.telephone } : {}),
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": OPENING_HOURS.schemaDays,
        "opens": OPENING_HOURS.opens,
        "closes": OPENING_HOURS.closes
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Sunday"],
        "opens": "00:00",
        "closes": "00:00"
      }
    ],
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Statiegeld Nederland",
        "url": "https://www.statiegeldnederland.nl"
      },
      {
        "@type": "Organization",
        "name": "Verpact",
        "url": "https://www.verpact.nl"
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Statiegeld Nederland - REPAYZ Officieel Partner | Snelste Bulkmachine</title>
        <meta 
          name="description" 
          content="REPAYZ is officieel erkend door Statiegeld Nederland en Verpact. De snelste statiegeld bulkmachine van Nederland: 120 items/min, direct uitbetaling via Tikkie, gratis parkeren."
        />
        <meta name="keywords" content="statiegeld nederland, verpact, officieel innamepunt, statiegeld inleveren, bulkmachine, snelste automaat, tikkie betaling" />
        <link rel="canonical" href="https://repayz.nl/statiegeld-nederland" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Statiegeld Nederland - REPAYZ Officieel Partner" />
        <meta property="og:description" content="Officieel erkend door Statiegeld Nederland en Verpact. De snelste bulkmachine: 120 items/min, Tikkie betaling, gratis parkeren." />
        <meta property="og:url" content="https://repayz.nl/statiegeld-nederland" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://repayz.nl/og-image.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Header />

      <main className="flex-1">
        {/* Hero Section - Clean & Modern */}
        <section className="relative bg-gradient-to-br from-[#1a3a52] via-[#1a3a52] to-[#0d2538] py-20 md:py-28 overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container relative">
            {/* Partner logos - Clean row */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <div className="bg-white rounded-xl p-3 shadow-lg w-[140px] h-[60px] flex items-center justify-center">
                <img 
                  src="/statiegeld-nederland-logo.png" 
                  alt="Statiegeld Nederland" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="bg-white rounded-xl p-3 shadow-lg w-[120px] h-[60px] flex items-center justify-center">
                <img 
                  src="/verpact-logo.jpg" 
                  alt="Verpact" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Officieel Erkend Innamepunt</span>
              </div>
            </div>

            {/* Main heading */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Officieel Partner van
                <span className="block text-[#4ecdc4]">Statiegeld Nederland</span>
              </h1>

              <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                De snelste statiegeld bulkmachine van Nederland. 120 items per minuut, direct uitbetaling via Tikkie.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/locatie">
                  <Button size="lg" className="bg-[#4ecdc4] hover:bg-[#3db8b0] text-white px-8">
                    Vind Onze Locatie
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/hoe-het-werkt">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                    Hoe Het Werkt
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mt-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#4ecdc4]">120</div>
                <div className="text-xs md:text-sm text-white/60 mt-1">items/min</div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-[#4ecdc4]">4x</div>
                <div className="text-xs md:text-sm text-white/60 mt-1">sneller</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#4ecdc4]">Direct</div>
                <div className="text-xs md:text-sm text-white/60 mt-1">via Tikkie</div>
              </div>
            </div>
          </div>
        </section>

        {/* What is Statiegeld Nederland - Two Column */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Content */}
              <div>
                <div className="inline-flex items-center gap-2 text-[#4ecdc4] text-sm font-semibold mb-4">
                  <div className="w-8 h-px bg-[#4ecdc4]"></div>
                  OVER STATIEGELD NEDERLAND
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] mb-6">
                  Wat is Statiegeld Nederland?
                </h2>
                
                <p className="text-gray-600 text-lg mb-4">
                  <strong className="text-[#1a3a52]">Statiegeld Nederland</strong> is de uitvoerende partij van het statiegeldsysteem in Nederland. Sinds maart 2024 is Statiegeld Nederland onderdeel van <strong className="text-[#1a3a52]">Verpact</strong>, de organisatie die verantwoordelijk is voor het circulair maken van de verpakkingsketen.
                </p>
                
                <p className="text-gray-600 mb-8">
                  Het statiegeldsysteem zorgt ervoor dat plastic flessen en blikjes worden ingezameld en gerecycled, zodat er weer nieuwe verpakkingen van gemaakt kunnen worden. Dit vermindert zwerfafval en draagt bij aan een circulaire economie.
                </p>

                <div className="flex flex-wrap gap-3">
                  <a href="https://www.statiegeldnederland.nl" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-[#1a3a52]/20 text-[#1a3a52] hover:bg-[#1a3a52] hover:text-white">
                      Statiegeld Nederland
                      <ExternalLink className="ml-2 w-3.5 h-3.5" />
                    </Button>
                  </a>
                  <a href="https://www.verpact.nl/nl/statiegeld" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-[#1a3a52]/20 text-[#1a3a52] hover:bg-[#1a3a52] hover:text-white">
                      Verpact
                      <ExternalLink className="ml-2 w-3.5 h-3.5" />
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right - Stats Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-[#1a3a52] mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Resultaten Statiegeld Nederland
                </h3>
                
                <div className="space-y-5">
                  {[
                    { value: "6+ miljard", label: "flessen ingeleverd", sub: "Sinds juni 2021" },
                    { value: "4,5+ miljard", label: "blikjes ingeleverd", sub: "Sinds april 2023" },
                    { value: "93%", label: "van Nederland levert in", sub: "En dit percentage groeit" },
                    { value: "90%", label: "inzameldoel", sub: "Wettelijk vastgelegd" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-bold text-[#1a3a52]">{stat.value} <span className="font-normal text-gray-600">{stat.label}</span></div>
                        <div className="text-sm text-gray-500">{stat.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section - Simplified */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] mb-4">
                Hoe Werkt Het Retourproces?
              </h2>
              <p className="text-gray-600">
                Bekijk de officiële uitlegvideo van Statiegeld Nederland over het complete retourproces.
              </p>
            </div>

            {/* YouTube Embed */}
            <div className="max-w-3xl mx-auto">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/56lpeye8a1s"
                  title="Hoe werkt het statiegeld retourproces?"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Why REPAYZ - Feature Cards */}
        <section className="py-20 bg-[#1a3a52]">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Waarom REPAYZ Kiezen?
              </h2>
              <p className="text-white/70">
                Als officieel erkend innamepunt bieden we de snelste en meest innovatieve manier om je statiegeld in te leveren.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "120 Items/Min",
                  desc: "4x sneller dan traditionele supermarkt automaten. Bulk storten in plaats van stuk voor stuk."
                },
                {
                  icon: "💰",
                  title: "Direct via Tikkie",
                  desc: "Ontvang je statiegeld direct op je bankrekening. Geen bonnetjes, geen gedoe."
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: "Steun Lokaal",
                  desc: "Doneer je statiegeld aan Sociaal Huis Oisterwijk en maak direct impact in je gemeenschap."
                }
              ].map((feature, i) => (
                <Card key={i} className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-[#4ecdc4]/20 flex items-center justify-center text-[#4ecdc4] mb-4">
                    {typeof feature.icon === 'string' ? <span className="text-2xl">{feature.icon}</span> : feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/hoe-het-werkt">
                <Button size="lg" className="bg-[#4ecdc4] hover:bg-[#3db8b0] text-white">
                  Ontdek Hoe REPAYZ Werkt
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Comparison Table - Cleaner */}
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] text-center mb-12">
              REPAYZ vs Traditioneel
            </h2>

            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-5 text-gray-500 font-medium text-sm">Kenmerk</th>
                      <th className="text-center p-5 bg-[#4ecdc4]/10">
                        <div className="font-bold text-[#1a3a52]">REPAYZ</div>
                      </th>
                      <th className="text-center p-5">
                        <div className="font-medium text-gray-600">Supermarkt</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { label: "Snelheid", repayz: "120 items/min", other: "30 items/min" },
                      { label: "Methode", repayz: "Bulk storten", other: "Stuk voor stuk" },
                      { label: "Uitbetaling", repayz: "Direct Tikkie", other: "Bonnetje → Kassa" },
                      { label: "Doneren", repayz: "✓ Sociaal Huis", other: "Beperkt" },
                      { label: "Parkeren", repayz: "✓ Gratis", other: "Variabel" },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="p-5 text-gray-600">{row.label}</td>
                        <td className="text-center p-5 bg-[#4ecdc4]/10 font-semibold text-emerald-600">{row.repayz}</td>
                        <td className="text-center p-5 text-gray-500">{row.other}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] text-center mb-12">
              Veelgestelde Vragen
            </h2>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: "Wat is statiegeld?",
                  a: "Statiegeld is een bedrag dat je betaalt bij aankoop van een drankverpakking en terugkrijgt wanneer je de lege verpakking inlevert. Er zit €0,25 statiegeld op grote plastic flessen, €0,15 op kleine plastic flesjes en €0,15 op blikjes."
                },
                {
                  q: "Waar kan ik statiegeld inleveren?",
                  a: "Je kunt statiegeld inleveren bij verschillende inleverlocaties in heel Nederland. REPAYZ in Oisterwijk heeft de snelste bulkmachine in de regio."
                },
                {
                  q: "Hoe herken ik verpakkingen met statiegeld?",
                  a: "Verpakkingen met statiegeld herken je aan het officiële statiegeldlogo op het etiket. Dit is een cirkel met een fles/blikje en pijlen die het retourproces symboliseren."
                },
                {
                  q: "Is REPAYZ officieel erkend?",
                  a: "Ja! REPAYZ is een officieel erkend innamepunt van Statiegeld Nederland en voldoet aan alle richtlijnen van Verpact. We zijn onderdeel van het landelijke statiegeldsysteem."
                }
              ].map((faq, i) => (
                <Card key={i} className="p-6 bg-white">
                  <h3 className="text-lg font-bold text-[#1a3a52] mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <a href="https://www.statiegeldnederland.nl/consumenten/veelgestelde-vragen" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-[#1a3a52]/20 text-[#1a3a52] hover:bg-[#1a3a52] hover:text-white">
                  Meer FAQ's op Statiegeld Nederland
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Social Links - Consolidated & Clean */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {/* Statiegeld Nederland */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Statiegeld Nederland:</span>
                <div className="flex gap-2">
                  <a href="https://www.youtube.com/@statiegeldnederland" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-600 hover:text-white flex items-center justify-center text-gray-600 transition-colors" aria-label="YouTube">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/statiegeldnederland" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white flex items-center justify-center text-gray-600 transition-colors" aria-label="Instagram">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="https://www.facebook.com/statiegeld.nederland" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white flex items-center justify-center text-gray-600 transition-colors" aria-label="Facebook">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                </div>
              </div>

              {/* Verpact */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Verpact:</span>
                <div className="flex gap-2">
                  <a href="https://twitter.com/Verpact" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center text-gray-600 transition-colors" aria-label="X/Twitter">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/verpact" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#0077b5] hover:text-white flex items-center justify-center text-gray-600 transition-colors" aria-label="LinkedIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="https://www.verpact.nl" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#4ecdc4] hover:text-white flex items-center justify-center text-gray-600 transition-colors" aria-label="Website">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                  </a>
                </div>
              </div>

              {/* REPAYZ */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">REPAYZ:</span>
                <a href="https://www.instagram.com/repayz.nl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ecdc4] text-white rounded-full text-sm font-medium hover:bg-[#3db8b0] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  @repayz.nl
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[#4ecdc4] to-[#3db8b0]">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Klaar om Te Recyclen?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
              Bezoek REPAYZ en ervaar de snelste manier om statiegeld in te leveren.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/locatie">
                <Button size="lg" className="bg-white text-[#1a3a52] hover:bg-gray-100 px-8">
                  Vind Onze Locatie
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
