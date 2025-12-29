// @ts-nocheck
import { ChevronDown, MapPin, Package, Globe, Flag } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const statiegeldCities = [
  { name: "Tilburg", slug: "tilburg" },
  { name: "Boxtel", slug: "boxtel" },
  { name: "Udenhout", slug: "udenhout" },
  { name: "Moergestel", slug: "moergestel" },
  { name: "Biezenmortel", slug: "biezenmortel" },
  { name: "Berkel-Enschot", slug: "berkel-enschot" },
  { name: "Haaren", slug: "haaren" },
  { name: "Helvoirt", slug: "helvoirt" },
  { name: "Loon op Zand", slug: "loon-op-zand" },
  { name: "Hilvarenbeek", slug: "hilvarenbeek" },
];

const vintedCities = [
  { name: "Oisterwijk", slug: "oisterwijk" },
  { name: "Tilburg", slug: "tilburg" },
  { name: "Boxtel", slug: "boxtel" },
  { name: "Udenhout", slug: "udenhout" },
  { name: "Moergestel", slug: "moergestel" },
  { name: "Biezenmortel", slug: "biezenmortel" },
  { name: "Berkel-Enschot", slug: "berkel-enschot" },
  { name: "Haaren", slug: "haaren" },
  { name: "Helvoirt", slug: "helvoirt" },
  { name: "Loon op Zand", slug: "loon-op-zand" },
  { name: "Hilvarenbeek", slug: "hilvarenbeek" },
];

const internationalPages = [
  { name: "English", slug: "en", flag: "🇬🇧" },
  { name: "Română", slug: "ro", flag: "🇷🇴" },
  { name: "Polski", slug: "pl", flag: "🇵🇱" },
  { name: "Български", slug: "bg", flag: "🇧🇬" },
  { name: "Українська", slug: "ua", flag: "🇺🇦" },
];

interface CityDropdownProps {
  isMobile?: boolean;
}

export default function CityDropdown({ isMobile = false }: CityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (isMobile) {
    // Mobile version - expandable sections
    return (
      <div className="py-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-[#1a3a52] dark:text-white font-semibold hover:text-[#4db8a8] transition-colors py-2"
        >
          <span>Vind Jouw Stad</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="pl-4 mt-2 space-y-3">
            {/* REPAYZ Statiegeld Section */}
            <div>
              <div className="flex items-center gap-2 text-[#4db8a8] font-semibold text-sm mb-2">
                <MapPin className="w-4 h-4" />
                <span>REPAYZ Statiegeld</span>
              </div>
              <div className="space-y-1 pl-6">
                {statiegeldCities.map((city) => (
                  <a
                    key={city.slug}
                    href={`/statiegeld-${city.slug}`}
                    className="block text-[#1a3a52] dark:text-gray-300 hover:text-[#4db8a8] transition-colors py-1 text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Statiegeld {city.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Vinted Go Section */}
            <div>
              <div className="flex items-center gap-2 text-[#4db8a8] font-semibold text-sm mb-2">
                <Package className="w-4 h-4" />
                <span>Vinted Go Locker</span>
              </div>
              <div className="space-y-1 pl-6">
                {vintedCities.map((city) => (
                  <a
                    key={city.slug}
                    href={`/vinted-locker-${city.slug}`}
                    className="block text-[#1a3a52] dark:text-gray-300 hover:text-[#4db8a8] transition-colors py-1 text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Vinted {city.name}
                  </a>
                ))}
              </div>
            </div>

            {/* International Section */}
            <div className="mt-3">
              <div className="flex items-center gap-2 text-[#4db8a8] font-semibold text-sm mb-2">
                <Globe className="w-4 h-4" />
                <span>International</span>
              </div>
              <div className="space-y-1 pl-6">
                {internationalPages.map((lang) => (
                  <a
                    key={lang.slug}
                    href={`/${lang.slug}`}
                    className="block text-[#1a3a52] dark:text-gray-300 hover:text-[#4db8a8] transition-colors py-1 text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {lang.flag} {lang.name}
                  </a>
                ))}
              </div>
            </div>

            {/* National Page */}
            <div className="mt-3">
              <div className="flex items-center gap-2 text-[#4db8a8] font-semibold text-sm mb-2">
                <Flag className="w-4 h-4" />
                <span>Nationaal</span>
              </div>
              <div className="pl-6">
                <a
                  href="/statiegeld-inleveren"
                  className="block text-[#1a3a52] dark:text-gray-300 hover:text-[#4db8a8] transition-colors py-1 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  🇳🇱 Statiegeld Inleveren Nederland
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version - hover dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-1 text-[#1a3a52] dark:text-white font-semibold hover:text-[#4db8a8] transition-colors"
      >
        Vind Jouw Stad
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-[#1a3a52] rounded-lg shadow-xl border-2 border-[#4db8a8] z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {/* REPAYZ Statiegeld Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-[#4db8a8] font-bold text-sm mb-3 pb-2 border-b border-[#4db8a8]/30">
                <MapPin className="w-5 h-5" />
                <span>REPAYZ Statiegeld Inleveren</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {statiegeldCities.map((city) => (
                  <a
                    key={city.slug}
                    href={`/statiegeld-${city.slug}`}
                    className="text-[#1a3a52] dark:text-gray-300 hover:text-[#4db8a8] hover:bg-[#4db8a8]/10 transition-all px-3 py-2 rounded-md text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Statiegeld {city.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Vinted Go Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-[#4db8a8] font-bold text-sm mb-3 pb-2 border-b border-[#4db8a8]/30">
                <Package className="w-5 h-5" />
                <span>Vinted Go Locker</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {vintedCities.map((city) => (
                  <a
                    key={city.slug}
                    href={`/vinted-locker-${city.slug}`}
                    className="text-[#1a3a52] dark:text-gray-300 hover:text-[#4db8a8] hover:bg-[#4db8a8]/10 transition-all px-3 py-2 rounded-md text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Vinted {city.name}
                  </a>
                ))}
              </div>
            </div>

            {/* International Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-[#4db8a8] font-bold text-sm mb-3 pb-2 border-b border-[#4db8a8]/30">
                <Globe className="w-5 h-5" />
                <span>International</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {internationalPages.map((lang) => (
                  <a
                    key={lang.slug}
                    href={`/${lang.slug}`}
                    className="text-[#1a3a52] dark:text-gray-300 hover:text-[#4db8a8] hover:bg-[#4db8a8]/10 transition-all px-3 py-2 rounded-md text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {lang.flag} {lang.name}
                  </a>
                ))}
              </div>
            </div>

            {/* National Page */}
            <div>
              <div className="flex items-center gap-2 text-[#4db8a8] font-bold text-sm mb-3 pb-2 border-b border-[#4db8a8]/30">
                <Flag className="w-5 h-5" />
                <span>Nationaal</span>
              </div>
              <div>
                <a
                  href="/statiegeld-inleveren"
                  className="text-[#1a3a52] dark:text-gray-300 hover:text-[#4db8a8] hover:bg-[#4db8a8]/10 transition-all px-3 py-2 rounded-md text-sm block"
                  onClick={() => setIsOpen(false)}
                >
                  🇳🇱 Statiegeld Inleveren Nederland
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
