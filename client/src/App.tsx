// @ts-nocheck
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CookieConsent from "./components/CookieConsent";
import GlobalSEO from "./components/GlobalSEO";
import Home from "./pages/Home";

// Lazy load heavy components that are not needed for initial render
const WallyChat = lazy(() => import("./components/WallyChat"));
const TrialPopup = lazy(() => import("./components/TrialPopup"));

// Lazy load non-critical routes for better performance
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Contact = lazy(() => import("./pages/Contact"));
const HoeHetWerkt = lazy(() => import("./pages/HoeHetWerkt"));
const Vinted = lazy(() => import("./pages/Vinted"));
const Locatie = lazy(() => import("./pages/Locatie"));
const StatiegeldInleveren = lazy(() => import("./pages/StatiegeldInleveren"));
const StatiegeldNederland = lazy(() => import("./pages/StatiegeldNederland"));
const ApiDebug = lazy(() => import("./pages/ApiDebug"));
const Privacy = lazy(() => import("./pages/Privacy"));
const AlgemeneVoorwaarden = lazy(() => import("./pages/AlgemeneVoorwaarden"));
const FAQ = lazy(() => import("./pages/FAQ"));

// SEO landing pages for surrounding villages
const Udenhout = lazy(() => import("./pages/villages/Udenhout"));
const Moergestel = lazy(() => import("./pages/villages/Moergestel"));
const Biezenmortel = lazy(() => import("./pages/villages/Biezenmortel"));
const BerkelEnschot = lazy(() => import("./pages/villages/BerkelEnschot"));
const Haaren = lazy(() => import("./pages/villages/Haaren"));
const Helvoirt = lazy(() => import("./pages/villages/Helvoirt"));
const Boxtel = lazy(() => import("./pages/villages/Boxtel"));
const Tilburg = lazy(() => import("./pages/villages/Tilburg"));
const LoonOpZand = lazy(() => import("./pages/villages/LoonOpZand"));
const Hilvarenbeek = lazy(() => import("./pages/villages/Hilvarenbeek"));

// Vinted Go Locker landing pages
const VintedOisterwijk = lazy(() => import("./pages/vinted/Oisterwijk"));
const VintedUdenhout = lazy(() => import("./pages/vinted/Udenhout"));
const VintedMoergestel = lazy(() => import("./pages/vinted/Moergestel"));
const VintedBiezenmortel = lazy(() => import("./pages/vinted/Biezenmortel"));
const VintedBerkelEnschot = lazy(() => import("./pages/vinted/BerkelEnschot"));
const VintedHaaren = lazy(() => import("./pages/vinted/Haaren"));
const VintedHelvoirt = lazy(() => import("./pages/vinted/Helvoirt"));
const VintedBoxtel = lazy(() => import("./pages/vinted/Boxtel"));
const VintedTilburg = lazy(() => import("./pages/vinted/Tilburg"));
const VintedLoonOpZand = lazy(() => import("./pages/vinted/LoonOpZand"));
const VintedHilvarenbeek = lazy(() => import("./pages/vinted/Hilvarenbeek"));

// International landing pages (EN/RO/PL/BG/UA)
const EnOisterwijk = lazy(() => import("./pages/international/en-oisterwijk"));
const EnTilburg = lazy(() => import("./pages/international/en-tilburg"));
const EnBoxtel = lazy(() => import("./pages/international/en-boxtel"));
const EnDenBosch = lazy(() => import("./pages/international/en-den-bosch"));
const RoOisterwijk = lazy(() => import("./pages/international/ro-oisterwijk"));
const RoTilburg = lazy(() => import("./pages/international/ro-tilburg"));
const RoBoxtel = lazy(() => import("./pages/international/ro-boxtel"));
const RoDenBosch = lazy(() => import("./pages/international/ro-den-bosch"));
const PlOisterwijk = lazy(() => import("./pages/international/pl-oisterwijk"));
const PlTilburg = lazy(() => import("./pages/international/pl-tilburg"));
const PlBoxtel = lazy(() => import("./pages/international/pl-boxtel"));
const PlDenBosch = lazy(() => import("./pages/international/pl-den-bosch"));
const BgOisterwijk = lazy(() => import("./pages/international/bg-oisterwijk"));
const BgTilburg = lazy(() => import("./pages/international/bg-tilburg"));
const BgBoxtel = lazy(() => import("./pages/international/bg-boxtel"));
const BgDenBosch = lazy(() => import("./pages/international/bg-den-bosch"));
const UaOisterwijk = lazy(() => import("./pages/international/ua-oisterwijk"));
const UaTilburg = lazy(() => import("./pages/international/ua-tilburg"));
const UaBoxtel = lazy(() => import("./pages/international/ua-boxtel"));
const UaDenBosch = lazy(() => import("./pages/international/ua-den-bosch"));

function Router() {
  const [location] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4db8a8]"></div>
      </div>
    }>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/hoe-het-werkt"} component={HoeHetWerkt} />
        <Route path={"/vinted"} component={Vinted} />
        <Route path={"/leaderboard"} component={Leaderboard} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/locatie"} component={Locatie} />
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/api-debug"} component={ApiDebug} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/algemene-voorwaarden"} component={AlgemeneVoorwaarden} />
        <Route path={"/faq"} component={FAQ} />
        
        {/* SEO Landing Pages - REPAYZ Statiegeld */}
        <Route path={"/statiegeld-udenhout"} component={Udenhout} />
        <Route path={"/statiegeld-moergestel"} component={Moergestel} />
        <Route path={"/statiegeld-biezenmortel"} component={Biezenmortel} />
        <Route path={"/statiegeld-berkel-enschot"} component={BerkelEnschot} />
        <Route path={"/statiegeld-haaren"} component={Haaren} />
        <Route path={"/statiegeld-helvoirt"} component={Helvoirt} />
        <Route path={"/statiegeld-boxtel"} component={Boxtel} />
        <Route path={"/statiegeld-tilburg"} component={Tilburg} />
        <Route path={"/statiegeld-loon-op-zand"} component={LoonOpZand} />
        <Route path={"/statiegeld-hilvarenbeek"} component={Hilvarenbeek} />
        
        {/* Vinted Go Locker Landing Pages */}
        <Route path={"/vinted-locker-oisterwijk"} component={VintedOisterwijk} />
        <Route path={"/vinted-locker-udenhout"} component={VintedUdenhout} />
        <Route path={"/vinted-locker-moergestel"} component={VintedMoergestel} />
        <Route path={"/vinted-locker-biezenmortel"} component={VintedBiezenmortel} />
        <Route path={"/vinted-locker-berkel-enschot"} component={VintedBerkelEnschot} />
        <Route path={"/vinted-locker-haaren"} component={VintedHaaren} />
        <Route path={"/vinted-locker-helvoirt"} component={VintedHelvoirt} />
        <Route path={"/vinted-locker-boxtel"} component={VintedBoxtel} />
        <Route path={"/vinted-locker-tilburg"} component={VintedTilburg} />
        <Route path={"/vinted-locker-loon-op-zand"} component={VintedLoonOpZand} />
        <Route path={"/vinted-locker-hilvarenbeek"} component={VintedHilvarenbeek} />
        
        {/* National Landing Pages */}
        <Route path={"/statiegeld-inleveren"} component={StatiegeldInleveren} />
        <Route path={"/statiegeld-nederland"} component={StatiegeldNederland} />
        
        {/* International Landing Pages - English */}
        <Route path={"/en"} component={EnOisterwijk} />
        <Route path={"/en-tilburg"} component={EnTilburg} />
        <Route path={"/en-boxtel"} component={EnBoxtel} />
        <Route path={"/en-den-bosch"} component={EnDenBosch} />
        
        {/* International Landing Pages - Romanian */}
        <Route path={"/ro"} component={RoOisterwijk} />
        <Route path={"/ro-tilburg"} component={RoTilburg} />
        <Route path={"/ro-boxtel"} component={RoBoxtel} />
        <Route path={"/ro-den-bosch"} component={RoDenBosch} />
        
        {/* International Landing Pages - Polish */}
        <Route path={"/pl"} component={PlOisterwijk} />
        <Route path={"/pl-tilburg"} component={PlTilburg} />
        <Route path={"/pl-boxtel"} component={PlBoxtel} />
        <Route path={"/pl-den-bosch"} component={PlDenBosch} />
        
        {/* International Landing Pages - Bulgarian */}
        <Route path={"/bg"} component={BgOisterwijk} />
        <Route path={"/bg-tilburg"} component={BgTilburg} />
        <Route path={"/bg-boxtel"} component={BgBoxtel} />
        <Route path={"/bg-den-bosch"} component={BgDenBosch} />
        
        {/* International Landing Pages - Ukrainian */}
        <Route path={"/ua"} component={UaOisterwijk} />
        <Route path={"/ua-tilburg"} component={UaTilburg} />
        <Route path={"/ua-boxtel"} component={UaBoxtel} />
        <Route path={"/ua-den-bosch"} component={UaDenBosch} />
        
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="system"
        switchable
      >
        <TooltipProvider>
          <GlobalSEO />
          <Toaster />
          <Router />
          <CookieConsent />
          <Suspense fallback={null}>
            <WallyChat />
          </Suspense>
          <Suspense fallback={null}>
            <TrialPopup />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

