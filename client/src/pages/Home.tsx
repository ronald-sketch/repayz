// @ts-nocheck
import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import { Leaf, Package } from "lucide-react";
import { useState, useEffect, lazy, Suspense } from "react";
import StructuredData, { organizationSchema, localBusinessSchema, websiteSchema } from "@/components/StructuredData";
import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import { useSEO } from "@/hooks/useSEO";


// Lazy load below-the-fold content for better performance
const BelowTheFold = lazy(() => import("@/components/home/BelowTheFold"));

export default function Home() {
  // Dynamic SEO
  useSEO({
    title: 'REPAYZ - Statiegeld & Geld Verdienen met Recycling',
    description: 'Recycle makkelijk statiegeld flessen en blikjes bij REPAYZ Oisterwijk. Tot 120 items per minuut! Ontvang CASH via Tikkie of steun Sociaal Huis Oisterwijk.',
    canonical: 'https://repayz.nl/'
  });
  
  // Defer welfare partners query - not needed for initial render
  const { data: welfarePartners } = trpc.welfare.list.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // Machine status with optimized caching
  const { data: machineStatus } = trpc.machine.getStatus.useQuery(
    { machineId: '090373' },
    { 
      refetchInterval: 60000, // Update every 60 seconds
      staleTime: 30000, // Consider data fresh for 30 seconds
      refetchOnWindowFocus: false,
    }
  );
  const [totalCollected, setTotalCollected] = useState(10023); // Initial value to prevent layout shift
  const [showAppSection, setShowAppSection] = useState(false);

  // Use all-time total for hero card
  useEffect(() => {
    if (machineStatus?.allTimeTotal !== undefined) {
      setTotalCollected(machineStatus.allTimeTotal);
    }
  }, [machineStatus]);

  // Machine is operational when ready or processing (not service/error/unknown)
  const isOperational = machineStatus?.statusType === 'ready' || machineStatus?.statusType === 'processing';

  const whatsappNumber = '31642346115';
  const whatsappMessage = encodeURIComponent('Hallo, ik heb assistentie nodig bij de REPAYZ machine in Oisterwijk.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1f2d] transition-colors">
      {/* SEO Meta Tags - Updated 2025-01-21 */}
      <SEOHead 
        title="REPAYZ - Statiegeld & Geld Verdienen met Recycling"
        description="Recycle makkelijk statiegeld flessen en blikjes bij REPAYZ Oisterwijk. Tot 120 items per minuut! Ontvang CASH via Tikkie of steun Sociaal Huis Oisterwijk."
        keywords="statiegeld, statiegeld nederland, statiegeld inleveren Oisterwijk, recycling machine Oisterwijk, flessen inleveren Brabant, blikjes recyclen, Envipco Quantum, REPAYZ, Sociaal Huis Oisterwijk"
        ogTitle="REPAYZ Oisterwijk - Statiegeld Inleveren & Recycling"
        ogDescription="Recycle makkelijk statiegeld flessen en blikjes bij REPAYZ Oisterwijk. Tot 120 items per minuut! Ontvang CASH via Tikkie of steun Sociaal Huis Oisterwijk."
        canonicalUrl="https://repayz.nl/"
      />
      {/* Structured Data for SEO */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={localBusinessSchema} />
      <StructuredData data={websiteSchema} />
      
      <Header />

      {/* Hero Section - Above the Fold (Critical) */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#4db8a8]/10 dark:bg-[#4db8a8]/20 text-[#1a3a52] dark:text-white px-4 py-2 rounded-full mb-6">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-semibold">Duurzaam Recyclen</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#1a3a52] dark:text-white mb-6 leading-tight">
              Recycle,<br />
              <span className="text-[#4db8a8]">Get Payed,</span><br />
              <span className="text-gray-400 dark:text-gray-500">Zero Waste.</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Recycle makkelijk statiegeld flessen en blikjes bij REPAYZ Oisterwijk. Tot 120 items per minuut! Ontvang CASH via Tikkie of steun Sociaal Huis Oisterwijk.
            </p>
          </div>
          <div className="relative">
            <a href="#machine-status" className="block bg-gradient-to-br from-[#4db8a8]/20 to-[#1a3a52]/10 rounded-2xl p-8 border border-[#4db8a8]/30 hover:border-[#4db8a8]/50 transition-all cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-[#4db8a8] to-[#1a3a52] rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                {/* Animated background circles - using transform for GPU acceleration */}
                <div className="absolute inset-0 opacity-20" style={{ willChange: 'transform' }}>
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full" style={{animation: 'pulse-scale 3s ease-in-out infinite', transform: 'translateZ(0)'}}></div>
                  <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full" style={{animation: 'pulse-scale 4s ease-in-out infinite 1s', transform: 'translateZ(0)'}}></div>
                </div>
                <div className="text-center text-white relative z-10 flex-1 flex flex-col items-center justify-center">
                  {/* Spinning recycle icon - using transform for GPU acceleration */}
                  <div className="inline-block" style={{animation: 'spin-smooth 8s linear infinite', transform: 'translateZ(0)'}}>
                    <Package className="w-32 h-32 mx-auto opacity-80" />
                  </div>
                  {/* Live counter */}
                  <div className="mt-6">
                    <p className="text-4xl font-bold mb-2">{totalCollected}</p>
                    <p className="text-lg font-semibold">Items Gerecycled</p>
                  </div>
                </div>
                {/* Status badge at bottom */}
                <div className="relative z-20 pb-4">
                  {machineStatus?.statusType === 'ready' ? (
                    <span className="text-white/90 text-sm font-semibold flex items-center gap-1">
                      <span className="text-lg">✅</span> Operationeel
                    </span>
                  ) : machineStatus?.statusType === 'processing' ? (
                    <span className="text-white/90 text-sm font-semibold flex items-center gap-1">
                      <span className="text-lg">⚙️</span> Bezig met verwerken
                    </span>
                  ) : machineStatus?.statusType === 'service' ? (
                    <span className="text-white/90 text-sm font-semibold flex items-center gap-1">
                      <span className="text-lg">🔧</span> Onderhoud
                    </span>
                  ) : machineStatus?.statusType === 'error' ? (
                    <span className="text-white/90 text-sm font-semibold flex items-center gap-1">
                      <span className="text-lg">❌</span> Storing
                    </span>
                  ) : machineStatus?.statusType === 'door_open' ? (
                    <span className="text-white/90 text-sm font-semibold flex items-center gap-1">
                      <span className="text-lg">🚪</span> Deur Open
                    </span>
                  ) : machineStatus?.statusType === 'full' ? (
                    <span className="text-white/90 text-sm font-semibold flex items-center gap-1">
                      <span className="text-lg">📦</span> Bin Vol
                    </span>
                  ) : machineStatus?.statusType === 'offline' ? (
                    <span className="text-white/90 text-sm font-semibold flex items-center gap-1">
                      <span className="text-lg">⚫</span> Offline
                    </span>
                  ) : (
                    <span className="text-white/90 text-sm font-semibold flex items-center gap-1">
                      <span className="text-lg">❓</span> Status onbekend
                    </span>
                  )}
                </div>
              </div>
            </a>
          </div>
        </div>
        {/* Scroll Indicator - GPU accelerated */}
        <div className="flex justify-center mt-12 md:hidden" style={{animation: 'bounce-smooth 1s ease-in-out infinite', transform: 'translateZ(0)'}}>
          <div className="flex flex-col items-center gap-2 text-[#4db8a8]">
            <span className="text-sm font-semibold">Scroll voor meer</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Below the Fold Content - Lazy Loaded */}
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4db8a8]"></div>
        </div>
      }>
        <BelowTheFold
          totalCollected={totalCollected}
          machineStatus={machineStatus}
          isOperational={isOperational}
          whatsappUrl={whatsappUrl}
          welfarePartners={welfarePartners}
          showAppSection={showAppSection}
          setShowAppSection={setShowAppSection}
        />
      </Suspense>
    </div>
  );
}
