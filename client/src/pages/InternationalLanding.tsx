// @ts-nocheck
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Clock, Navigation, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import WallyPromo from "@/components/WallyPromo";
import { SEOHead } from "@/components/SEOHead";

interface InternationalLandingProps {
  language: "en" | "ro" | "pl" | "bg" | "ua";
  city: "oisterwijk" | "tilburg" | "boxtel" | "den-bosch";
  translations: {
    title: string;
    subtitle: string;
    description: string;
    howItWorks: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    locationTitle: string;
    address: string;
    openingHours: string;
    openingHoursValue: string;
    distance: string;
    distanceValue: string;
    viewRoute: string;
    alsoAvailable: string;
    vintedDesc: string;
    useTranslate: string;
  };
}

export default function InternationalLanding({ language, city, translations: t }: InternationalLandingProps) {
  const cityNames = {
    "oisterwijk": "Oisterwijk",
    "tilburg": "Tilburg",
    "boxtel": "Boxtel",
    "den-bosch": "'s-Hertogenbosch (Den Bosch)"
  };

  const distances = {
    "oisterwijk": "0 km",
    "tilburg": "7 km",
    "boxtel": "10 km",
    "den-bosch": "15 km"
  };

  const mapEmbedUrls = {
    "oisterwijk": `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2487.5!2d5.1897!3d51.5789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDM0JzQ0LjAiTiA1wrAxMScyMy4wIkU!5e0!3m2!1sen!2snl!4v1234567890!5m2!1sen!2snl`,
    "tilburg": `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Tilburg,Netherlands&destination=Sprendlingenstraat+20B,5061+KN+Oisterwijk,Netherlands`,
    "boxtel": `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Boxtel,Netherlands&destination=Sprendlingenstraat+20B,5061+KN+Oisterwijk,Netherlands`,
    "den-bosch": `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=s-Hertogenbosch,Netherlands&destination=Sprendlingenstraat+20B,5061+KN+Oisterwijk,Netherlands`
  };

  // SEO meta descriptions per language
  const seoDescriptions = {
    en: `Recycle bottles and cans at REPAYZ in ${cityNames[city]}. Get paid cash via Tikkie or support local welfare. Open daily 10:00-21:00.`,
    ro: `Reciclează sticle și doze la REPAYZ în ${cityNames[city]}. Primește bani cash prin Tikkie sau susține bunăstarea locală. Deschis zilnic 10:00-21:00.`,
    pl: `Oddaj butelki i puszki w REPAYZ w ${cityNames[city]}. Otrzymaj gotówkę przez Tikkie lub wesprzyj lokalną pomoc społeczną. Otwarte codziennie 10:00-21:00.`,
    bg: `Рециклирайте бутилки и кутии в REPAYZ в ${cityNames[city]}. Получете пари в брой чрез Tikkie или подкрепете местното благосъстояние. Отворено ежедневно 10:00-21:00.`,
    ua: `Здайте пляшки та банки в REPAYZ у ${cityNames[city]}. Отримайте готівку через Tikkie або підтримайте місцеве благополуччя. Відкрито щодня 10:00-21:00.`
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-[#0d1f2d] dark:to-[#1a3a52]">
      <SEOHead 
        title={`${t.title} ${cityNames[city]} | REPAYZ`}
        description={seoDescriptions[language]}
        keywords={`REPAYZ ${cityNames[city]}, deposit return ${cityNames[city]}, recycle ${language}`}
        ogTitle={`${t.title} ${cityNames[city]} | REPAYZ`}
        ogDescription={seoDescriptions[language]}
        canonicalUrl={`https://repayz.nl/${language}-${city}`}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-[#1a3a52] to-[#2d5a7b] dark:from-[#0d1f2d] dark:to-[#1a3a52]">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.title} <span className="text-[#4db8a8]">{cityNames[city]}</span>
            </h1>
            <p className="text-xl text-gray-200 dark:text-gray-300 mb-6">
              {t.subtitle}
            </p>
            <p className="text-lg text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>
        </section>

        {/* Location Info Cards */}
        <section className="py-12 px-4 bg-white dark:bg-[#0d1f2d]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="dark:bg-[#1a3a52] dark:border-[#4db8a8]/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-8 h-8 text-[#4db8a8] flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 dark:text-white">{t.address}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Sprendlingenstraat 20B<br />
                        5061 KN Oisterwijk<br />
                        Netherlands
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-[#1a3a52] dark:border-[#4db8a8]/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Clock className="w-8 h-8 text-[#4db8a8] flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 dark:text-white">{t.openingHours}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t.openingHoursValue}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-[#1a3a52] dark:border-[#4db8a8]/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Navigation className="w-8 h-8 text-[#4db8a8] flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 dark:text-white">{t.distance}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t.distanceValue.replace("{distance}", distances[city])}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Wally AI Promo */}
        <WallyPromo 
          title={language === 'en' ? 'Ask Wally - The First Deposit Return AI!' : 
                 language === 'ro' ? 'Întreabă pe Wally - Primul AI pentru Returnarea Garanției!' :
                 language === 'pl' ? 'Zapytaj Wally - Pierwszego AI do Zwrotu Kaucji!' :
                 language === 'bg' ? 'Попитай Wally - Първият AI за Връщане на Депозит!' :
                 'Запитай Wally - Перший AI для Повернення Депозиту!'}
          description={language === 'en' ? 'Questions? Ask Wally for instant answers. Available 24/7!' : 
                       language === 'ro' ? 'Întrebări? Întreabă pe Wally pentru răspunsuri instantanee. Disponibil 24/7!' :
                       language === 'pl' ? 'Pytania? Zapytaj Wally o natychmiastowe odpowiedzi. Dostępny 24/7!' :
                       language === 'bg' ? 'Въпроси? Попитай Wally за незабавни отговори. Наличен 24/7!' :
                       'Питання? Запитай Wally для миттєвих відповідей. Доступний 24/7!'}
          buttonText={language === 'en' ? '💬 Open Chat' : 
                      language === 'ro' ? '💬 Deschide Chat' :
                      language === 'pl' ? '💬 Otwórz Chat' :
                      language === 'bg' ? '💬 Отвори Чат' :
                      '💬 Відкрити Чат'}
        />

        {/* How It Works */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-[#1a3a52]">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">{t.howItWorks}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#4db8a8] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{t.step1Title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t.step1Desc}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#4db8a8] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{t.step2Title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t.step2Desc}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#4db8a8] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{t.step3Title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t.step3Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="py-12 px-4 bg-white dark:bg-[#0d1f2d]">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">{t.viewRoute}</h2>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={mapEmbedUrls[city]}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Route to REPAYZ"
              />
            </div>
          </div>
        </section>

        {/* Vinted Info */}
        <section className="py-12 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-[#1a3a52] dark:to-[#2d5a7b]">
          <div className="container mx-auto max-w-4xl">
            <Card className="dark:bg-[#0d1f2d]/50 dark:border-purple-500/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Package className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 dark:text-white">{t.alsoAvailable}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t.vintedDesc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Browser Translate Notice */}
        <section className="py-8 px-4 bg-blue-50 dark:bg-[#1a3a52] border-t border-blue-200 dark:border-blue-900">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-gray-700 dark:text-gray-300">
              🌍 {t.useTranslate}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
