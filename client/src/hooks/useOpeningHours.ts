import { useState, useEffect } from 'react';
import { OPENING_HOURS } from '@shared/facts';

const OPENING_HOUR = OPENING_HOURS.openHour;
const CLOSING_HOUR = OPENING_HOURS.closeHour;
const CLOSING_SOON_MINUTES = 30; // Last 30 minutes before closing

interface OpeningHoursState {
  isOpen: boolean;
  isClosingSoon: boolean;
  timeUntilClose: string; // "2 uur 30 min" or "15:32" for countdown
  timeUntilOpen: string; // "om 07:00"
  statusText: string; // Full status text
  statusColor: string; // Tailwind color class
}

// Get current time in Amsterdam timezone
function getAmsterdamTime(): Date {
  const now = new Date();
  // Convert to Amsterdam timezone string and parse back
  const amsterdamString = now.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' });
  return new Date(amsterdamString);
}

export function useOpeningHours(): OpeningHoursState {
  const [state, setState] = useState<OpeningHoursState>(calculateState());

  function calculateState(): OpeningHoursState {
    const now = getAmsterdamTime();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    
    // Check if currently open (zie OPENING_HOURS in shared/facts.ts)
    const isOpen = currentHour >= OPENING_HOUR && currentHour < CLOSING_HOUR;
    
    // Calculate time until closing (in Amsterdam time)
    const closingTime = new Date(now);
    closingTime.setHours(CLOSING_HOUR, 0, 0, 0);
    
    const msUntilClose = closingTime.getTime() - now.getTime();
    const minutesUntilClose = Math.floor(msUntilClose / (1000 * 60));
    const secondsUntilClose = Math.floor((msUntilClose % (1000 * 60)) / 1000);
    
    // Check if closing soon (last 30 minutes)
    const isClosingSoon = isOpen && minutesUntilClose <= CLOSING_SOON_MINUTES && minutesUntilClose >= 0;
    
    // Format time until close
    let timeUntilClose = '';
    if (isOpen) {
      if (isClosingSoon) {
        // Show countdown MM:SS
        const mins = Math.floor(minutesUntilClose);
        const secs = secondsUntilClose;
        timeUntilClose = `${mins}:${secs.toString().padStart(2, '0')}`;
      } else {
        // Show hours and minutes
        const hoursLeft = Math.floor(minutesUntilClose / 60);
        const minsLeft = minutesUntilClose % 60;
        if (hoursLeft > 0) {
          timeUntilClose = minsLeft > 0 ? `${hoursLeft} uur ${minsLeft} min` : `${hoursLeft} uur`;
        } else {
          timeUntilClose = `${minsLeft} min`;
        }
      }
    }
    
    // Calculate time until opening (for when closed)
    let timeUntilOpen = `om ${OPENING_HOURS.opens}`;
    
    // Generate status text
    let statusText = '';
    let statusColor = '';
    
    if (isOpen) {
      if (isClosingSoon) {
        statusText = `⚠️ Sluit over ${timeUntilClose}`;
        statusColor = 'text-orange-500';
      } else {
        statusText = `Nog ${timeUntilClose} open`;
        statusColor = 'text-green-600';
      }
    } else {
      statusText = `Gesloten - Opent ${timeUntilOpen}`;
      statusColor = 'text-gray-500';
    }
    
    return {
      isOpen,
      isClosingSoon,
      timeUntilClose,
      timeUntilOpen,
      statusText,
      statusColor,
    };
  }

  useEffect(() => {
    // Update every second when closing soon, otherwise every minute
    const interval = setInterval(() => {
      setState(calculateState());
    }, state.isClosingSoon ? 1000 : 60000);

    return () => clearInterval(interval);
  }, [state.isClosingSoon]);

  return state;
}
