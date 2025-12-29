// @ts-nocheck
import { useState, useEffect } from 'react';
import { X, Sparkles, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';

// Popup configuration - editable settings
export interface PopupConfig {
  enabled: boolean;
  delayMs: number;
  title: string;
  emoji: string;
  description1: string;
  highlight1: string;
  description2: string;
  highlight2: string;
  openingHoursLabel: string;
  openingHours: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  showOncePerDay: boolean;
  // A/B Testing
  abTestEnabled: boolean;
}

// A/B Test Variant interface
export interface AbTestVariant {
  variantKey: string;
  title: string;
  emoji: string;
  description1: string;
  highlight1: string;
  description2: string;
  highlight2: string;
  primaryButtonText: string;
}

// Default Variant A (control)
const variantA: AbTestVariant = {
  variantKey: 'A',
  title: 'Proefperiode Gestart!',
  emoji: '🚀',
  description1: 'We draaien proef! Kom onze machine testen en breng je',
  highlight1: 'zakken met statiegeld verpakkingen',
  description2: 'Help ons verbeteren en test de',
  highlight2: 'snelste statiegeld machine',
  primaryButtonText: 'Kom Langs',
};

// Variant B (challenger)
const variantB: AbTestVariant = {
  variantKey: 'B',
  title: 'Gratis Geld Verdienen!',
  emoji: '💰',
  description1: 'Lever je lege flessen en blikjes in en ontvang',
  highlight1: 'direct CASH via Tikkie',
  description2: 'Tot 120 items per minuut! De',
  highlight2: 'snelste uitbetaling',
  primaryButtonText: 'Start Nu',
};

// Default configuration
const defaultConfig: PopupConfig = {
  enabled: true,
  delayMs: 2000,
  title: 'Proefperiode Gestart!',
  emoji: '🚀',
  description1: 'We draaien proef! Kom onze machine testen en breng je',
  highlight1: 'zakken met statiegeld verpakkingen',
  description2: 'Help ons verbeteren en test de',
  highlight2: 'snelste statiegeld machine',
  openingHoursLabel: 'Openingstijden',
  openingHours: '10:00 - 21:00',
  primaryButtonText: 'Kom Langs',
  primaryButtonLink: '/locatie',
  secondaryButtonText: 'Later',
  showOncePerDay: true,
  abTestEnabled: true,
};

// Storage keys
const POPUP_CONFIG_KEY = 'repayz-popup-config';
const POPUP_SEEN_KEY = 'repayz-trial-popup-seen';
const AB_VARIANT_KEY = 'repayz-ab-variant';
const VISITOR_ID_KEY = 'repayz-visitor-id';

// Generate or get visitor ID
function getVisitorId(): string {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

// Get assigned A/B variant (sticky assignment)
function getAssignedVariant(): 'A' | 'B' {
  let variant = localStorage.getItem(AB_VARIANT_KEY) as 'A' | 'B' | null;
  if (!variant) {
    // Random 50/50 assignment
    variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(AB_VARIANT_KEY, variant);
  }
  return variant;
}

// Get popup config from localStorage or use defaults
function getPopupConfig(): PopupConfig {
  try {
    const stored = localStorage.getItem(POPUP_CONFIG_KEY);
    if (stored) {
      return { ...defaultConfig, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error loading popup config:', e);
  }
  return defaultConfig;
}

// Save popup config to localStorage
export function savePopupConfig(config: Partial<PopupConfig>): void {
  try {
    const current = getPopupConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(POPUP_CONFIG_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving popup config:', e);
  }
}

// Toggle popup on/off
export function togglePopup(enabled: boolean): void {
  savePopupConfig({ enabled });
}

// Reset popup (clear "seen" state so it shows again)
export function resetPopupSeen(): void {
  localStorage.removeItem(POPUP_SEEN_KEY);
}

// Reset A/B test assignment (for testing)
export function resetAbTest(): void {
  localStorage.removeItem(AB_VARIANT_KEY);
  localStorage.removeItem(POPUP_SEEN_KEY);
}

// Get current variant for display
export function getCurrentVariant(): 'A' | 'B' {
  return getAssignedVariant();
}

// The actual popup content component
function PopupContent({ 
  config, 
  variant, 
  onClose, 
  onConversion 
}: { 
  config: PopupConfig; 
  variant: AbTestVariant;
  onClose: (dismissed: boolean) => void;
  onConversion: () => void;
}) {
  const handlePrimaryClick = () => {
    onConversion();
    onClose(false);
  };

  const handleDismiss = () => {
    onClose(true);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-50"
        style={{ transform: 'translateZ(0)' }}
        onClick={handleDismiss}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white dark:bg-[#1a2f3f] rounded-2xl shadow-2xl max-w-md w-full p-8 relative pointer-events-auto"
          style={{ animation: 'popup-enter 0.3s ease-out', transform: 'translateZ(0)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            aria-label="Sluiten"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4db8a8] to-[#1a3a52] rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title - from variant if A/B test enabled, otherwise from config */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a52] dark:text-white text-center mb-4">
            {config.abTestEnabled ? variant.emoji : config.emoji} {config.abTestEnabled ? variant.title : config.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
            {config.abTestEnabled ? variant.description1 : config.description1}{' '}
            <strong className="text-[#4db8a8]">
              {config.abTestEnabled ? variant.highlight1 : config.highlight1}
            </strong>.
          </p>

          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            {config.abTestEnabled ? variant.description2 : config.description2}{' '}
            <strong className="text-[#4db8a8]">
              {config.abTestEnabled ? variant.highlight2 : config.highlight2}
            </strong> van de regio!
          </p>

          {/* Opening hours */}
          <div className="bg-[#4db8a8]/10 dark:bg-[#4db8a8]/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-[#4db8a8]" />
              <p className="font-semibold text-[#1a3a52] dark:text-white">{config.openingHoursLabel}</p>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Dagelijks: <strong className="text-[#4db8a8]">{config.openingHours}</strong>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={config.primaryButtonLink} className="flex-1">
              <Button 
                className="w-full bg-[#4db8a8] hover:bg-[#3da898] text-white"
                onClick={handlePrimaryClick}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {config.abTestEnabled ? variant.primaryButtonText : config.primaryButtonText}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="flex-1 border-gray-300 dark:border-gray-600"
              onClick={handleDismiss}
            >
              {config.secondaryButtonText}
            </Button>
          </div>

          {/* A/B Test indicator (only visible in dev/debug) */}
          {config.abTestEnabled && (
            <p className="text-xs text-gray-400 text-center mt-4 opacity-50">
              Variant {variant.variantKey}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default function TrialPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [config, setConfig] = useState<PopupConfig>(defaultConfig);
  const [variant, setVariant] = useState<AbTestVariant>(variantA);
  const [visitorId, setVisitorId] = useState<string>('');

  // Track A/B test events
  const trackEvent = trpc.abTest.trackEvent.useMutation();

  useEffect(() => {
    // Load config
    const loadedConfig = getPopupConfig();
    setConfig(loadedConfig);

    // Get visitor ID
    const vid = getVisitorId();
    setVisitorId(vid);

    // Get assigned variant
    const assignedVariant = getAssignedVariant();
    setVariant(assignedVariant === 'A' ? variantA : variantB);

    // Check if popup is enabled
    if (!loadedConfig.enabled) {
      return;
    }

    // Check if user has seen the popup today (if showOncePerDay is enabled)
    if (loadedConfig.showOncePerDay) {
      const lastSeen = localStorage.getItem(POPUP_SEEN_KEY);
      const today = new Date().toDateString();
      
      if (lastSeen === today) {
        return;
      }
    }

    // Lazy load with delay for better page speed
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setIsVisible(true);
      
      // Track impression
      if (loadedConfig.abTestEnabled) {
        trackEvent.mutate({
          testName: 'popup_welcome',
          variantKey: assignedVariant,
          visitorId: vid,
          eventType: 'impression',
        });
      }
    }, loadedConfig.delayMs);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (dismissed: boolean) => {
    // Save that user has seen the popup today
    if (config.showOncePerDay) {
      const today = new Date().toDateString();
      localStorage.setItem(POPUP_SEEN_KEY, today);
    }

    // Track dismiss event
    if (config.abTestEnabled && dismissed) {
      trackEvent.mutate({
        testName: 'popup_welcome',
        variantKey: variant.variantKey,
        visitorId: visitorId,
        eventType: 'dismiss',
      });
    }

    setIsVisible(false);
  };

  const handleConversion = () => {
    // Track conversion (clicked primary button)
    if (config.abTestEnabled) {
      trackEvent.mutate({
        testName: 'popup_welcome',
        variantKey: variant.variantKey,
        visitorId: visitorId,
        eventType: 'conversion',
      });
    }
  };

  // Don't render anything until loaded (lazy loading)
  if (!isLoaded || !isVisible) return null;

  return (
    <PopupContent 
      config={config} 
      variant={variant}
      onClose={handleClose}
      onConversion={handleConversion}
    />
  );
}

// Export config getter and variants for use in settings/editor
export { getPopupConfig, defaultConfig, variantA, variantB, getAssignedVariant, getVisitorId };
