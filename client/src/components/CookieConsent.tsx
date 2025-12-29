// @ts-nocheck
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      // Load Google Analytics if already accepted
      loadGoogleAnalytics();
    }
  }, []);

  const loadGoogleAnalytics = () => {
    // Load Google Analytics script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-TPCWYQL60J";
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-TPCWYQL60J');
    `;
    document.head.appendChild(script2);
  };

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    loadGoogleAnalytics();
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#4db8a8] shadow-2xl z-50" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#1a3a52] mb-2">
              🍪 We gebruiken cookies
            </h3>
            <p className="text-sm text-gray-600">
              We gebruiken cookies om je ervaring te verbeteren en om te begrijpen hoe onze website wordt gebruikt. 
              Door op "Accepteren" te klikken, stem je in met het gebruik van analytische cookies.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              onClick={handleReject}
              className="border-gray-300 hover:bg-gray-100"
              aria-label="Weiger cookies"
            >
              Weigeren
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-[#4db8a8] hover:bg-[#3d9a8f] text-white"
              aria-label="Accepteer cookies"
            >
              Accepteren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
