// @ts-nocheck
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import { Menu, X, Moon, Sun, Clock } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { useLocation } from "wouter";
import CityDropdown from "./CityDropdown";
import { useOpeningHours } from "@/hooks/useOpeningHours";
import { OPENING_HOURS } from "@shared/facts";

export default function Header() {
  const { data: machineStatus } = trpc.machine.getStatus.useQuery(
    { machineId: '090373' },
    { 
      refetchInterval: 60000, // Update every 60 seconds
      staleTime: 30000, // Consider data fresh for 30 seconds (shares cache with Home)
      refetchOnWindowFocus: false,
    }
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const openingHours = useOpeningHours();

  const isOperational = machineStatus?.statusType === 'ready';
  
  const getStatusColor = () => {
    if (!machineStatus) return '#3b82f6'; // blue for coming soon
    switch (machineStatus.statusType) {
      case 'ready': return '#22c55e'; // green
      case 'processing': return '#f97316'; // orange  
      case 'service': return '#eab308'; // yellow
      case 'error': return '#ef4444'; // red
      case 'door_open': return '#f97316'; // orange for door open
      case 'full': return '#ef4444'; // red for bin full
      case 'offline': return '#6b7280'; // gray for offline
      default: return '#6b7280'; // gray for unknown
    }
  };
  
  const getStatusText = () => {
    if (!machineStatus) return 'Binnenkort Beschikbaar';
    switch (machineStatus.statusType) {
      case 'ready': return 'Machine Operationeel';
      case 'processing': return 'Machine Bezig';
      case 'service': return 'Machine Onderhoud';
      case 'error': return 'Machine Storing';
      case 'door_open': return 'Deur Open';
      case 'full': return 'Bin Vol';
      case 'offline': return 'Machine Offline';
      default: return 'Status Onbekend';
    }
  };
  
  const getStatusBgColor = () => {
    if (!machineStatus) return 'rgba(59, 130, 246, 0.1)';
    switch (machineStatus.statusType) {
      case 'ready': return 'rgba(34, 197, 94, 0.1)';
      case 'processing': return 'rgba(249, 115, 22, 0.1)';
      case 'service': return 'rgba(234, 179, 8, 0.1)';
      case 'error': return 'rgba(239, 68, 68, 0.1)';
      case 'door_open': return 'rgba(249, 115, 22, 0.1)';
      case 'full': return 'rgba(239, 68, 68, 0.1)';
      case 'offline': return 'rgba(107, 114, 128, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };
  
  const getStatusTextColor = () => {
    if (!machineStatus) return '#2563eb';
    switch (machineStatus.statusType) {
      case 'ready': return '#16a34a';
      case 'processing': return '#ea580c';
      case 'service': return '#ca8a04';
      case 'error': return '#dc2626';
      case 'door_open': return '#ea580c';
      case 'full': return '#dc2626';
      case 'offline': return '#4b5563';
      default: return '#4b5563';
    }
  };
  
  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };
  
  const getLinkClass = (path: string) => {
    return isActive(path)
      ? "text-[#4db8a8] font-semibold border-b-2 border-[#4db8a8] pb-1"
      : "text-[#1a3a52] dark:text-white font-semibold hover:text-[#4db8a8] transition-colors";
  };
  
  const getMobileLinkClass = (path: string) => {
    return isActive(path)
      ? "text-[#4db8a8] font-bold py-2 border-l-4 border-[#4db8a8] pl-4"
      : "text-[#1a3a52] dark:text-white font-semibold hover:text-[#4db8a8] transition-colors py-2";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#0d1f2d] border-b-2 border-[#4db8a8] transition-colors">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          {/* Logo/Home Button */}
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={APP_LOGO} alt="REPAYZ Logo - Statiegeld Inleveren Oisterwijk" className="h-28 md:h-44 w-auto" width="290" height="196" fetchPriority="high" />
          </a>

          {/* Desktop Menu */}
          <div className="flex flex-col items-end gap-1">
            {/* Opening Hours */}
            <div className="text-xs text-[#1a3a52] dark:text-white/80 font-medium text-center md:text-right">
              <div className="font-semibold">Openingstijden</div>
              <div>Dagelijks: {OPENING_HOURS.range}</div>
              <div className={`text-xs font-semibold flex items-center justify-end gap-1 ${openingHours.statusColor}`}>
                <Clock className="w-3 h-3" />
                {openingHours.statusText}
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={theme === 'dark' ? 'Schakel naar licht thema' : 'Schakel naar donker thema'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#4db8a8]" />
              ) : (
                <Moon className="w-5 h-5 text-[#1a3a52]" />
              )}
            </button>
            <a href="/" className={getLinkClass('/')}>Home</a>
            <a href="/hoe-het-werkt" className={getLinkClass('/hoe-het-werkt')}>Hoe het werkt</a>
            <a href="/vinted" className={getLinkClass('/vinted')}>Vinted Go</a>
            <a href="/locatie" className={getLinkClass('/locatie')}>Locatie</a>
            <CityDropdown />
            <a href="/leaderboard" className={getLinkClass('/leaderboard')}>Game On!</a>
            <a href="/contact" className={getLinkClass('/contact')}>Contact</a>
            
            {/* Live Machine Status Indicator */}
            <a 
              href="/#machine-status" 
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold cursor-pointer"
              style={{
                backgroundColor: getStatusBgColor(),
                color: getStatusTextColor(),
                transform: 'translateZ(0)'
              }}
            >
              <span 
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: getStatusColor(),
                  animation: isOperational ? 'pulse-scale 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                  transform: 'translateZ(0)'
                }}
              />
              <span className="text-sm">
                {getStatusText()}
              </span>
            </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1a3a52] dark:text-white hover:text-[#4db8a8] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 mt-2">
            <div className="flex flex-col space-y-3">
              <a href="/" className={getMobileLinkClass('/')}>Home</a>
              <a href="/hoe-het-werkt" className={getMobileLinkClass('/hoe-het-werkt')}>Hoe het werkt</a>
              <a href="/vinted" className={getMobileLinkClass('/vinted')}>Vinted Go</a>
              <a href="/locatie" className={getMobileLinkClass('/locatie')}>Locatie</a>
              <CityDropdown isMobile />
              <a href="/leaderboard" className={getMobileLinkClass('/leaderboard')}>Game On!</a>
              <a href="/contact" className={getMobileLinkClass('/contact')}>Contact</a>
              
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-[#1a3a52] dark:text-white font-semibold hover:text-[#4db8a8] transition-colors py-2"
              >
                {theme === 'dark' ? (
                  <><Sun className="w-5 h-5" /> Licht thema</>
                ) : (
                  <><Moon className="w-5 h-5" /> Donker thema</>
                )}
              </button>
              
              {/* Mobile Machine Status */}
              <a 
                href="/#machine-status" 
                className="flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: getStatusBgColor(),
                  color: getStatusTextColor()
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: getStatusColor(),
                    animation: isOperational ? 'pulse-scale 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                  transform: 'translateZ(0)'
                  }}
                />
                <span className="text-sm">
                  {getStatusText()}
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
