// @ts-nocheck
import { APP_LOGO } from "@/const";
import { Mail, MapPin, Clock, Heart, Instagram, Facebook, MessageCircle, Newspaper, Download } from "lucide-react";

// Custom TikTok icon since lucide doesn't have it
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Custom LinkedIn icon
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#1a3a52] dark:bg-[#0d1f2d] text-white py-12 border-t-4 border-[#4db8a8]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <img src={APP_LOGO} alt="REPAYZ Logo - Recycle Statiegeld Flessen en Blikjes" className="h-20 w-auto mb-4" width="118" height="80" loading="lazy" />
            <p className="text-gray-300 text-sm mb-4">
              Zero Waste, Real Payz.
            </p>
            <a 
              href="#download"
              className="inline-flex items-center gap-2 bg-[#4db8a8] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#3da898] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download de App
            </a>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#4db8a8]">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/vinted" className="text-gray-300 hover:text-[#4db8a8] transition-colors">Vinted Go Locker</a></li>
              <li><a href="https://www.sociaalhuisoisterwijk.nl/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#4db8a8] transition-colors">Sociaal Huis Oisterwijk</a></li>
              <li><a href="/statiegeld-nederland" className="text-gray-300 hover:text-[#4db8a8] transition-colors">Officieel Partner Statiegeld Nederland</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-[#4db8a8] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#4db8a8]">Info</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/hoe-het-werkt" className="text-gray-300 hover:text-[#4db8a8] transition-colors">Hoe het werkt</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-[#4db8a8] transition-colors">Veelgestelde vragen</a></li>
              <li>
                <button 
                  onClick={() => {
                    const wallyButton = document.querySelector('[aria-label="Open chat met Wally"]') as HTMLButtonElement;
                    if (wallyButton) wallyButton.click();
                  }}
                  className="text-gray-300 hover:text-[#4db8a8] transition-colors text-left"
                >
                  Vraag Wally AI
                </button>
              </li>
              <li>
                <a 
                  href="https://wa.me/31642346115" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#4db8a8] transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:info@repayz.nl" className="text-gray-300 hover:text-[#4db8a8] transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* In het Nieuws */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#4db8a8]">In het Nieuws</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/statiegeld-nederland" 
                  className="text-gray-300 hover:text-[#4db8a8] transition-colors flex items-start gap-2"
                >
                  <Newspaper className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Statiegeld verdubbelt in 2025</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Volg ons */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#4db8a8]">Volg ons</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://www.facebook.com/repayz.nl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#4db8a8] transition-colors flex items-center gap-2"
                  aria-label="Volg REPAYZ op Facebook"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/repayz.nl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#4db8a8] transition-colors flex items-center gap-2"
                  aria-label="Volg REPAYZ op Instagram"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://www.tiktok.com/@repayz.nl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#4db8a8] transition-colors flex items-center gap-2"
                  aria-label="Volg REPAYZ op TikTok"
                >
                  <TikTokIcon className="w-4 h-4" />
                  TikTok
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/company/repayz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#4db8a8] transition-colors flex items-center gap-2"
                  aria-label="Volg REPAYZ op LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Word Partner */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#4db8a8]">Word Partner</h3>
            <div className="bg-[#4db8a8]/10 border border-[#4db8a8]/30 rounded-lg p-4">
              <Heart className="w-8 h-8 text-[#4db8a8] mb-3" />
              <p className="text-sm text-gray-300 mb-3">
                Wil je ook een REPAYZ locatie beginnen? Help mee aan een schoner Nederland!
              </p>
              <a 
                href="mailto:info@repayz.nl?subject=REPAYZ Franchise Aanvraag"
                className="inline-flex items-center gap-2 text-[#4db8a8] hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                info@repayz.nl
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} REPAYZ. Alle rechten voorbehouden.
            </p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="hover:text-[#4db8a8] transition-colors">Privacy</a>
              <a href="/algemene-voorwaarden" className="hover:text-[#4db8a8] transition-colors">Algemene Voorwaarden</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
