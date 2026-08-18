// @ts-nocheck
import { ADDRESS, OPENING_HOURS } from "@shared/facts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { FileText, CheckCircle, AlertTriangle, Scale, Clock, HelpCircle } from "lucide-react";

export default function AlgemeneVoorwaarden() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0d1f2d] dark:to-[#1a3a52]">
      <SEOHead
        title="Algemene Voorwaarden | REPAYZ"
        description="Lees de algemene voorwaarden van REPAYZ voor het gebruik van onze statiegeld inlevermachine en diensten."
        canonicalUrl="https://repayz.nl/algemene-voorwaarden"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4db8a8]/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-[#4db8a8]" />
          </div>
          <h1 className="text-4xl font-bold text-[#1a3a52] dark:text-white mb-4">
            Algemene Voorwaarden
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Laatst bijgewerkt: December 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                1. Algemeen
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Deze algemene voorwaarden zijn van toepassing op het gebruik van de REPAYZ 
              statiegeld inlevermachine en bijbehorende diensten, gevestigd aan de 
              {ADDRESS.full}.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Door gebruik te maken van onze diensten, gaat u akkoord met deze voorwaarden.
            </p>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                2. Geaccepteerde Materialen
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Onze machine accepteert uitsluitend:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>PET flessen met statiegeld (klein en groot formaat)</li>
              <li>Aluminium en stalen blikjes met statiegeld</li>
              <li>Verpakkingen van 100ml tot 3 liter</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              <strong>Niet geaccepteerd:</strong> Glazen flessen, verpakkingen zonder statiegeld, 
              beschadigde of vervormde items, verpakkingen groter dan 3 liter.
            </p>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                3. Statiegeld Uitbetaling
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Na het inleveren van uw statiegeldverpakkingen ontvangt u een QR-code waarmee u:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>Direct uw statiegeld kunt ontvangen via Tikkie</li>
              <li>Het bedrag kunt doneren aan een lokaal goed doel</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Het statiegeld bedraagt €0,15 per klein item en €0,25 per groot item, 
              conform de wettelijke statiegeldregeling in Nederland.
            </p>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                4. Aansprakelijkheid
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              REPAYZ is niet aansprakelijk voor:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>Schade aan items die niet worden geaccepteerd door de machine</li>
              <li>Technische storingen of onderhoud aan de machine</li>
              <li>Vertragingen in de uitbetaling via Tikkie door externe factoren</li>
              <li>Verlies of diefstal van items voordat ze in de machine zijn geplaatst</li>
            </ul>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                5. Openingstijden
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              De REPAYZ machine is beschikbaar tijdens de openingstijden van de locatie:
            </p>
            <div className="mt-4 p-4 bg-[#4db8a8]/10 rounded-lg">
              <p className="text-gray-700 dark:text-gray-200 m-0">
                <strong>Dagelijks:</strong> {OPENING_HOURS.range}
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Openingstijden kunnen afwijken op feestdagen. Raadpleeg onze website of 
              social media voor actuele informatie.
            </p>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                6. Leaderboard & Gamification
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Deelname aan het REPAYZ leaderboard is vrijwillig. Door uw naam in te vullen:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>Geeft u toestemming voor het tonen van uw naam op het publieke leaderboard</li>
              <li>Kunt u meedingen naar prijzen en beloningen</li>
              <li>Kunt u op elk moment verzoeken om verwijdering van uw gegevens</li>
            </ul>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                7. Toepasselijk Recht
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Op deze algemene voorwaarden is Nederlands recht van toepassing. 
              Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
            </p>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                8. Contact
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Heeft u vragen over deze voorwaarden? Neem dan contact met ons op:
            </p>
            <div className="mt-4 p-4 bg-[#4db8a8]/10 rounded-lg">
              <p className="text-gray-700 dark:text-gray-200 m-0">
                <strong>REPAYZ</strong><br />
                {ADDRESS.street}<br />
                5061 KN Oisterwijk<br />
                E-mail: <a href="mailto:info@repayz.nl" className="text-[#4db8a8] hover:underline">info@repayz.nl</a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
