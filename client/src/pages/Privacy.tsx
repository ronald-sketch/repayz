// @ts-nocheck
import { ADDRESS } from "@shared/facts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Shield, Eye, Lock, UserCheck, Mail, Trash2 } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0d1f2d] dark:to-[#1a3a52]">
      <SEOHead
        title="Privacybeleid | REPAYZ"
        description="Lees ons privacybeleid. REPAYZ respecteert uw privacy en beschermt uw persoonsgegevens conform de AVG."
        canonicalUrl="https://repayz.nl/privacy"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4db8a8]/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-[#4db8a8]" />
          </div>
          <h1 className="text-4xl font-bold text-[#1a3a52] dark:text-white mb-4">
            Privacybeleid
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Laatst bijgewerkt: December 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                1. Welke gegevens verzamelen wij?
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              REPAYZ verzamelt minimale gegevens om onze diensten te kunnen leveren:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li><strong>Recycling statistieken:</strong> Aantal ingeleverde flessen en blikjes (anoniem)</li>
              <li><strong>Leaderboard:</strong> Alleen als u vrijwillig uw naam invult voor het klassement</li>
              <li><strong>Contact:</strong> E-mailadres en naam wanneer u contact met ons opneemt</li>
              <li><strong>Analytische cookies:</strong> Alleen met uw toestemming (zie cookiebeleid)</li>
            </ul>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                2. Hoe gebruiken wij uw gegevens?
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Wij gebruiken uw gegevens uitsluitend voor:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>Het verwerken van uw statiegeld uitbetalingen via Tikkie</li>
              <li>Het tonen van recycling statistieken op onze website</li>
              <li>Het beantwoorden van uw vragen via e-mail of WhatsApp</li>
              <li>Het verbeteren van onze dienstverlening</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              <strong>Wij verkopen of delen uw gegevens nooit met derden voor commerciële doeleinden.</strong>
            </p>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                3. Tikkie Betalingen
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Voor uitbetalingen via Tikkie worden uw gegevens verwerkt door ABN AMRO Bank N.V. 
              REPAYZ heeft geen toegang tot uw bankgegevens. De betaling verloopt volledig via 
              het beveiligde Tikkie-platform. Raadpleeg het{" "}
              <a 
                href="https://www.tikkie.me/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#4db8a8] hover:underline"
              >
                privacybeleid van Tikkie
              </a>{" "}
              voor meer informatie.
            </p>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                4. Cookies
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Onze website gebruikt cookies:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li><strong>Functionele cookies:</strong> Noodzakelijk voor de werking van de website (geen toestemming vereist)</li>
              <li><strong>Analytische cookies:</strong> Om websitegebruik te analyseren (alleen met uw toestemming)</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              U kunt uw cookievoorkeuren op elk moment aanpassen via de cookiebanner onderaan de pagina.
            </p>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                5. Uw Rechten
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Conform de AVG (Algemene Verordening Gegevensbescherming) heeft u het recht om:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>Inzage te vragen in uw persoonsgegevens</li>
              <li>Uw gegevens te laten corrigeren of verwijderen</li>
              <li>Bezwaar te maken tegen de verwerking van uw gegevens</li>
              <li>Uw gegevens over te dragen naar een andere partij</li>
            </ul>
          </section>

          <section className="mb-10 bg-white dark:bg-[#1a3a52]/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-[#4db8a8]" />
              <h2 className="text-2xl font-bold text-[#1a3a52] dark:text-white m-0">
                6. Contact
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Heeft u vragen over ons privacybeleid of wilt u gebruik maken van uw rechten? 
              Neem dan contact met ons op:
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
