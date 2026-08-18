// @ts-nocheck
import { ADDRESS, CONTACT } from "@shared/facts";
import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbsSchema } from "@/components/BreadcrumbsSchema";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0d1f2d] dark:to-[#1a2f3f]">
      {/* SEO Meta Tags */}
      <SEOHead 
        title="Contact REPAYZ Oisterwijk - Vragen over Recycling & Statiegeld"
        description="Neem contact op met REPAYZ Oisterwijk. Vragen over de recycling machine, statiegeld inleveren of technische problemen? Stuur een WhatsApp bericht of bezoek onze winkel."
        keywords="REPAYZ contact, recycling machine hulp Oisterwijk, statiegeld vragen, REPAYZ WhatsApp, technische ondersteuning REPAYZ"
        ogTitle="Contact REPAYZ - We Helpen Je Graag!"
        ogDescription="Vragen over REPAYZ? Stuur ons een WhatsApp bericht of bezoek onze winkel in Oisterwijk. We helpen je graag verder!"
        canonicalUrl="https://repayz.nl/contact"
      />
      <BreadcrumbsSchema items={[
        { name: "Home", url: "https://repayz.nl/" },
        { name: "Contact", url: "https://repayz.nl/contact" }
      ]} />
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a52] dark:text-white mb-6">
            Neem Contact Op
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Heb je vragen over REPAYZ? We helpen je graag verder!
          </p>
        </div>

        {/* Contact Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          {/* WhatsApp */}
          <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f] hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1a3a52] dark:text-white">
                <Phone className="w-5 h-5 text-[#4db8a8]" />
                WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Stuur ons een bericht</p>
              <Button asChild className="w-full bg-[#25D366] hover:bg-[#1da851]">
                <a href="https://wa.me/31642346115" target="_blank" rel="noopener noreferrer">
                  Chat met ons
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f] hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1a3a52] dark:text-white">
                <Mail className="w-5 h-5 text-[#4db8a8]" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Stuur ons een email</p>
              <Button asChild variant="outline" className="w-full border-[#4db8a8] text-[#4db8a8] hover:bg-[#4db8a8] hover:text-white">
                <a href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f] hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1a3a52] dark:text-white">
                <MapPin className="w-5 h-5 text-[#4db8a8]" />
                Locatie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{ADDRESS.street}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">5061 KN Oisterwijk</p>
              <p className="text-sm text-[#4db8a8] dark:text-[#4db8a8] font-semibold">
                Binnenkort open
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a3a52] dark:text-white mb-8 text-center">
            Veelgestelde Vragen
          </h2>
          
          <div className="space-y-6">
            <Card className="dark:bg-[#1a2f3f]">
              <CardHeader>
                <CardTitle className="text-lg text-[#1a3a52] dark:text-white">
                  Hoe werkt REPAYZ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Breng je lege flessen en blikjes naar onze machine, scan ze, en ontvang direct je beloning via Tikkie of doneer aan een lokaal goed doel.
                </p>
              </CardContent>
            </Card>

            <Card className="dark:bg-[#1a2f3f]">
              <CardHeader>
                <CardTitle className="text-lg text-[#1a3a52] dark:text-white">
                  Welke materialen accepteren jullie?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We accepteren PET flessen en aluminium blikjes. Zorg ervoor dat ze leeg en schoon zijn voor optimale verwerking.
                </p>
              </CardContent>
            </Card>

            <Card className="dark:bg-[#1a2f3f]">
              <CardHeader>
                <CardTitle className="text-lg text-[#1a3a52] dark:text-white">
                  Wanneer gaat de machine live?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We zijn momenteel bezig met de voorbereidingen. Meld je aan voor updates om als eerste te horen wanneer we live gaan!
                </p>
              </CardContent>
            </Card>

            <Card className="dark:bg-[#1a2f3f]">
              <CardHeader>
                <CardTitle className="text-lg text-[#1a3a52] dark:text-white">
                  Wat is de Vinted Go locker?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Op dezelfde locatie als onze REPAYZ machine vind je een Vinted Go locker waar je tweedehands kleding kunt versturen en ontvangen. Perfect voor duurzaam winkelen!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
