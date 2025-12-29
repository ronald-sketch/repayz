import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp, MessageCircle, HelpCircle, Recycle, CreditCard, MapPin, Clock, Gift, Smartphone } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Machine & Recycling
  {
    category: "Machine & Recycling",
    question: "Hoe werkt de REPAYZ machine?",
    answer: "De REPAYZ machine is een bulkmachine waar je tot 120 flessen en blikjes per minuut kunt inleveren. Je stort ze gewoon uit je tas in de machine - geen gedoe met één voor één invoeren. De machine telt automatisch alles en je ontvangt direct je geld via Tikkie."
  },
  {
    category: "Machine & Recycling",
    question: "Welke flessen en blikjes worden geaccepteerd?",
    answer: "We accepteren alle plastic flessen (PET) en blikjes met het officiële statiegeld logo. Dit zijn kleine plastic flesjes (€0,15), grote plastic flessen (€0,25) en blikjes (€0,15). Let op: glazen flessen, kratten en verpakkingen zonder statiegeld logo worden niet geaccepteerd."
  },
  {
    category: "Machine & Recycling",
    question: "Moet ik de flessen schoonmaken voordat ik ze inlever?",
    answer: "Nee, de flessen hoeven niet schoon te zijn. Wel vragen we je om ze leeg in te leveren. Flessen met veel vloeistof kunnen de machine verstoren."
  },
  {
    category: "Machine & Recycling",
    question: "Hoeveel items kan ik tegelijk inleveren?",
    answer: "Er is geen limiet! Of je nu 10 of 1000 flessen hebt, je kunt ze allemaal in één keer inleveren. Onze bulkmachine verwerkt tot 120 items per minuut, dus zelfs grote hoeveelheden zijn snel geteld."
  },
  // Betaling
  {
    category: "Betaling",
    question: "Hoe ontvang ik mijn geld via Tikkie?",
    answer: "Na het inleveren kies je op het scherm voor 'Tikkie'. Je scant de QR-code met je telefoon en het geld wordt direct op je bankrekening gestort. Je hebt de Tikkie app nodig, maar geen account - de betaling werkt via iDEAL."
  },
  {
    category: "Betaling",
    question: "Hoeveel statiegeld krijg ik per fles of blikje?",
    answer: "De statiegeldtarieven zijn: kleine plastic flesjes (tot 1 liter) = €0,15, grote plastic flessen (vanaf 1 liter) = €0,25, en blikjes = €0,15. Dit zijn de officiële tarieven van Statiegeld Nederland."
  },
  {
    category: "Betaling",
    question: "Kan ik ook contant geld krijgen?",
    answer: "Nee, we werken uitsluitend met Tikkie voor directe bankbetalingen. Dit is veiliger, sneller en milieuvriendelijker dan contant geld of bonnetjes."
  },
  // Locatie & Openingstijden
  {
    category: "Locatie & Openingstijden",
    question: "Waar staat de REPAYZ machine?",
    answer: "De REPAYZ machine staat bij Scooterpoint Oisterwijk, Sprendlingenstraat 20B, 5061 JX Oisterwijk. Er is gratis parkeergelegenheid direct voor de deur."
  },
  {
    category: "Locatie & Openingstijden",
    question: "Wat zijn de openingstijden?",
    answer: "We zijn dagelijks geopend van 10:00 tot 21:00 uur, 7 dagen per week. Ook op feestdagen!"
  },
  {
    category: "Locatie & Openingstijden",
    question: "Is er parkeergelegenheid?",
    answer: "Ja, er is gratis parkeergelegenheid direct voor de deur bij Scooterpoint. Je kunt makkelijk met de auto komen, ook met grote hoeveelheden flessen."
  },
  // Doneren
  {
    category: "Doneren",
    question: "Kan ik mijn statiegeld doneren?",
    answer: "Ja! Je kunt ervoor kiezen om je statiegeld te doneren aan Stichting Sociaal Huis Oisterwijk. 100% van je donatie gaat naar hulp voor inwoners met armoede, sociale uitsluiting of praktische problemen."
  },
  {
    category: "Doneren",
    question: "Wat doet Sociaal Huis Oisterwijk?",
    answer: "Sociaal Huis Oisterwijk biedt hulp aan inwoners die het moeilijk hebben. Ze helpen met financiële begeleiding, voedselpakketten, administratieve ondersteuning en sociale activiteiten. Door te doneren maak je direct impact in je eigen gemeenschap."
  },
  // Vinted Go
  {
    category: "Vinted Go",
    question: "Wat is de Vinted Go locker?",
    answer: "Op dezelfde locatie als de REPAYZ machine vind je een Vinted Go locker. Hier kun je pakketten versturen en ontvangen voor Vinted. Handig als je toch al komt om statiegeld in te leveren!"
  },
  // Technisch
  {
    category: "Technisch",
    question: "Wat als de machine niet werkt?",
    answer: "Check eerst de live status op onze website - daar zie je of de machine operationeel is. Bij problemen kun je contact opnemen via WhatsApp of langsgaan bij Scooterpoint voor assistentie."
  },
  {
    category: "Technisch",
    question: "Heb ik een app nodig?",
    answer: "Je hebt alleen de Tikkie app nodig om je betaling te ontvangen. De REPAYZ machine zelf werkt zonder app - je kunt direct beginnen met inleveren."
  }
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

const categoryIcons: Record<string, React.ReactNode> = {
  "Machine & Recycling": <Recycle className="w-5 h-5" />,
  "Betaling": <CreditCard className="w-5 h-5" />,
  "Locatie & Openingstijden": <MapPin className="w-5 h-5" />,
  "Doneren": <Gift className="w-5 h-5" />,
  "Vinted Go": <Clock className="w-5 h-5" />,
  "Technisch": <Smartphone className="w-5 h-5" />
};

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFaqs = activeCategory 
    ? faqs.filter(faq => faq.category === activeCategory)
    : faqs;

  // Generate FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const openWallyChat = () => {
    const wallyButton = document.querySelector('[aria-label="Open chat met Wally"]') as HTMLButtonElement;
    if (wallyButton) wallyButton.click();
  };

  return (
    <>
      <Helmet>
        <title>Veelgestelde Vragen (FAQ) - REPAYZ Oisterwijk | Statiegeld Inleveren</title>
        <meta name="description" content="Antwoorden op veelgestelde vragen over REPAYZ: hoe de machine werkt, welke flessen geaccepteerd worden, betaling via Tikkie, openingstijden en meer." />
        <link rel="canonical" href="https://repayz.nl/faq" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-[#e8f4f2] to-white dark:from-[#0d1f2d] dark:to-[#1a3a52]">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-[#4db8a8]/10 text-[#4db8a8] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Veelgestelde Vragen
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a52] dark:text-white mb-6">
              Hoe kunnen we je helpen?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Vind antwoorden op de meest gestelde vragen over REPAYZ, statiegeld inleveren en onze machine.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="pb-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? "bg-[#4db8a8] text-white"
                    : "bg-white dark:bg-[#1a3a52] text-gray-600 dark:text-gray-300 hover:bg-[#4db8a8]/10"
                }`}
              >
                Alle vragen
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-[#4db8a8] text-white"
                      : "bg-white dark:bg-[#1a3a52] text-gray-600 dark:text-gray-300 hover:bg-[#4db8a8]/10"
                  }`}
                >
                  {categoryIcons[category]}
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => {
                const globalIndex = faqs.indexOf(faq);
                const isOpen = openItems.has(globalIndex);
                
                return (
                  <div
                    key={globalIndex}
                    className="bg-white dark:bg-[#1a3a52] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(globalIndex)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-[#0d1f2d]/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-[#4db8a8] mt-0.5">
                          {categoryIcons[faq.category]}
                        </span>
                        <span className="font-semibold text-[#1a3a52] dark:text-white">
                          {faq.question}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#4db8a8] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pl-16">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Wally CTA Section */}
        <section className="pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-gradient-to-r from-[#1a3a52] to-[#2a5a72] rounded-2xl p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4db8a8] rounded-full mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Vraag niet gevonden?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Stel je vraag aan Wally, onze AI-assistent! Wally weet alles over REPAYZ, 
                statiegeld en kan je helpen met specifieke vragen over de machine status.
              </p>
              <button
                onClick={openWallyChat}
                className="inline-flex items-center gap-2 bg-[#4db8a8] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#3da898] transition-colors text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Vraag het aan Wally
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
