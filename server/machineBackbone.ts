/**
 * Machine API Backbone Service
 * Centralized service that polls ePortal API and caches data
 * All website components fetch from this backbone instead of direct API calls
 */

import { getDb } from './db';
import { machineStatus, lifetimeCounters } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

// Historical baseline values (from user-provided data)
const BASELINE_BOTTLES = 2504;  // PET bottles before tracking started
const BASELINE_CANS = 7519;     // Cans before tracking started
const BASELINE_TOTAL = 10023;   // Total at baseline (should match StatusInfoMeter at that time)

// Types for machine data
// Machine status based on ePortal StatusInfoState field
export type MachineStatus = 'operational' | 'error' | 'door_open' | 'maintenance' | 'offline' | 'full';

export interface MachineData {
  machineId: string;
  status: MachineStatus;
  statusInfoState: string; // Raw StatusInfoState from ePortal (Error, Ready, Door, Door(Tech))
  // Today's counts (reset at midnight)
  todayBottles: number;  // pet_accepted
  todayCans: number;     // cans_accepted
  todayTotal: number;    // pet_accepted + cans_accepted
  // All-time total (lifetime meter)
  allTimeTotal: number;  // StatusInfoMeter
  // All-time split (calculated from baseline + accumulated)
  allTimeBottles: number;  // Lifetime PET bottles
  allTimeCans: number;     // Lifetime cans
  // Bin fill counts (reset when emptied) - for reference only
  binBottles: number;    // BinInfoCountBin2
  binCans: number;       // BinInfoCountBin1
  // Capacities
  bottleCapacity: number;
  canCapacity: number;
  // Other stats
  itemsPerMinute: number;
  lastUpdated: Date;
  lastApiSuccess: Date | null;
  apiStatus: 'connected' | 'rate_limited' | 'error' | 'offline';
  rawData?: any; // Raw ePortal response for debugging
}

export interface BackboneStatus {
  isRunning: boolean;
  lastPoll: Date | null;
  nextPoll: Date | null;
  pollIntervalMs: number;
  apiStatus: 'connected' | 'rate_limited' | 'error' | 'offline';
  machines: MachineData[];
  errors: string[];
}

// In-memory cache for fast access
let machineCache: Map<string, MachineData> = new Map();
let backboneStatus: BackboneStatus = {
  isRunning: false,
  lastPoll: null,
  nextPoll: null,
  pollIntervalMs: 300000, // Default 5 minutes (300 seconds)
  apiStatus: 'offline',
  machines: [],
  errors: []
};

// Lifetime counters cache
let lifetimeCache: {
  accumulatedBottles: number;
  accumulatedCans: number;
  lastDailyBottles: number;
  lastDailyCans: number;
} = {
  accumulatedBottles: 0,
  accumulatedCans: 0,
  lastDailyBottles: 0,
  lastDailyCans: 0
};

// Polling interval handle
let pollInterval: NodeJS.Timeout | null = null;

// ePortal credentials from environment
const EPORTAL_USERNAME = process.env.EPORTAL_USERNAME || '';
const EPORTAL_PASSWORD = process.env.EPORTAL_PASSWORD || '';
const EPORTAL_BASE_URL = 'https://eportal.envipco.com/api';

// Default machine ID
const DEFAULT_MACHINE_ID = '090373';

/**
 * Datum in Amsterdamse tijd, als YYYY-MM-DD.
 *
 * ePortal rekent zijn dagtotalen af op de lokale dag. Hier stond eerder
 * `new Date().toISOString().split('T')[0]`, en dat geeft de UTC-datum. Tussen
 * middernacht en 02:00 Amsterdamse tijd (01:00 in de winter) is dat nog
 * gisteren, dus werd elke nacht een paar uur lang de verkeerde dag opgevraagd.
 * Gevolg: de site toonde in dat venster de cijfers van gisteren als "vandaag",
 * en de middernachtdetectie in updateLifetimeCounters sloeg twee uur te laat aan.
 */
export function amsterdamDateString(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

// API key cache
let apiKey: string | null = null;
let apiKeyExpiry: number = 0;
let sessionCookie: string | null = null;

/**
 * Authenticate with ePortal API
 */
async function authenticate(): Promise<string | null> {
  // Return cached key if still valid
  if (apiKey && Date.now() < apiKeyExpiry) {
    return apiKey;
  }

  if (!EPORTAL_USERNAME || !EPORTAL_PASSWORD) {
    console.warn('[Backbone] Missing ePortal credentials');
    backboneStatus.errors.push('Missing ePortal credentials');
    return null;
  }

  try {
    const response = await fetch(
      `${EPORTAL_BASE_URL}/login?username=${encodeURIComponent(EPORTAL_USERNAME)}&password=${encodeURIComponent(EPORTAL_PASSWORD)}`,
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.log('[Backbone] Rate limited by ePortal API');
        backboneStatus.apiStatus = 'rate_limited';
        backboneStatus.errors.push(`Rate limited at ${new Date().toISOString()}`);
      }
      throw new Error(`Auth failed: ${response.status}`);
    }

    // Store session cookie from response
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader && setCookieHeader.includes('sessionid=')) {
      sessionCookie = setCookieHeader.split(';')[0];
      console.log('[Backbone] Session cookie stored');
    }

    const data = await response.json();
    // Note: ePortal returns ApiKey with capital A and K
    if (!data.ApiKey) {
      throw new Error('No API key in response');
    }

    apiKey = data.ApiKey;
    apiKeyExpiry = Date.now() + (14 * 60 * 1000); // 14 minutes
    backboneStatus.apiStatus = 'connected';
    console.log('[Backbone] ✅ Authenticated with ePortal, key:', apiKey!.substring(0, 8) + '...');
    return apiKey;
  } catch (error) {
    console.error('[Backbone] Auth error:', error);
    backboneStatus.apiStatus = 'error';
    backboneStatus.errors.push(`Auth error: ${error}`);
    return null;
  }
}

/**
 * Update lifetime counters based on daily values
 * Called on every poll to track accumulated totals
 */
async function updateLifetimeCounters(machineId: string, todayBottles: number, todayCans: number): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    // Check if we need to detect a midnight reset
    // If today's values are lower than last known, it means midnight reset happened
    if (todayBottles < lifetimeCache.lastDailyBottles || todayCans < lifetimeCache.lastDailyCans) {
      // Midnight reset detected - add the last known values to accumulated
      lifetimeCache.accumulatedBottles += lifetimeCache.lastDailyBottles;
      lifetimeCache.accumulatedCans += lifetimeCache.lastDailyCans;
      console.log('[Backbone] 🌙 Midnight reset detected, accumulated:', {
        bottles: lifetimeCache.accumulatedBottles,
        cans: lifetimeCache.accumulatedCans
      });
    }

    // Update last known daily values
    lifetimeCache.lastDailyBottles = todayBottles;
    lifetimeCache.lastDailyCans = todayCans;

    // Save to database
    await db.insert(lifetimeCounters).values({
      machineId,
      baselineBottles: BASELINE_BOTTLES,
      baselineCans: BASELINE_CANS,
      baselineTotal: BASELINE_TOTAL,
      accumulatedBottles: lifetimeCache.accumulatedBottles,
      accumulatedCans: lifetimeCache.accumulatedCans,
      lastDailyBottles: todayBottles,
      lastDailyCans: todayCans,
      lastUpdated: new Date(),
    }).onDuplicateKeyUpdate({
      set: {
        accumulatedBottles: lifetimeCache.accumulatedBottles,
        accumulatedCans: lifetimeCache.accumulatedCans,
        lastDailyBottles: todayBottles,
        lastDailyCans: todayCans,
        lastUpdated: new Date(),
      }
    });

    console.log('[Backbone] 📊 Updated lifetime counters:', {
      baseline: { bottles: BASELINE_BOTTLES, cans: BASELINE_CANS },
      accumulated: { bottles: lifetimeCache.accumulatedBottles, cans: lifetimeCache.accumulatedCans },
      today: { bottles: todayBottles, cans: todayCans },
      total: {
        bottles: BASELINE_BOTTLES + lifetimeCache.accumulatedBottles + todayBottles,
        cans: BASELINE_CANS + lifetimeCache.accumulatedCans + todayCans
      }
    });
  } catch (error) {
    console.error('[Backbone] Error updating lifetime counters:', error);
  }
}

/**
 * Load lifetime counters from database
 */
async function loadLifetimeCounters(machineId: string): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    const result = await db.select().from(lifetimeCounters)
      .where(eq(lifetimeCounters.machineId, machineId))
      .limit(1);

    if (result.length > 0) {
      const row = result[0];
      lifetimeCache.accumulatedBottles = row.accumulatedBottles;
      lifetimeCache.accumulatedCans = row.accumulatedCans;
      lifetimeCache.lastDailyBottles = row.lastDailyBottles;
      lifetimeCache.lastDailyCans = row.lastDailyCans;
      console.log('[Backbone] 📦 Loaded lifetime counters from DB:', lifetimeCache);
    } else {
      // Initialize with baseline if no record exists
      console.log('[Backbone] 📦 No lifetime counters found, initializing with baseline');
      await db.insert(lifetimeCounters).values({
        machineId,
        baselineBottles: BASELINE_BOTTLES,
        baselineCans: BASELINE_CANS,
        baselineTotal: BASELINE_TOTAL,
        accumulatedBottles: 0,
        accumulatedCans: 0,
        lastDailyBottles: 0,
        lastDailyCans: 0,
      });
    }
  } catch (error) {
    console.error('[Backbone] Error loading lifetime counters:', error);
  }
}

/**
 * Calculate all-time split values
 */
function calculateAllTimeSplit(todayBottles: number, todayCans: number): { allTimeBottles: number; allTimeCans: number } {
  return {
    allTimeBottles: BASELINE_BOTTLES + lifetimeCache.accumulatedBottles + todayBottles,
    allTimeCans: BASELINE_CANS + lifetimeCache.accumulatedCans + todayCans
  };
}

/**
 * Determine machine status from ePortal StatusInfoState field
 * According to ePortal API documentation, there are 4 states:
 * - Error: Machine has an error
 * - Ready: Machine is operational
 * - Door: Door is open
 * - Door(Tech): Door is open AND technician logged in
 */
function determineStatus(rvmData: any): { status: MachineStatus; statusInfoState: string } {
  const statusInfoState = rvmData.StatusInfoState || '';
  const state = statusInfoState.toLowerCase();
  
  // Check StatusInfoState first (most reliable according to ePortal docs)
  if (state === 'error') {
    return { status: 'error', statusInfoState };
  }
  if (state === 'door') {
    return { status: 'door_open', statusInfoState };
  }
  if (state === 'door(tech)') {
    return { status: 'maintenance', statusInfoState }; // Technician is working on it
  }
  if (state === 'ready' || state === '') {
    // Empty string or "Ready" means operational
    // Also check RVMStatusReady as fallback
    if (rvmData.RVMStatusReady) {
      return { status: 'operational', statusInfoState: statusInfoState || 'Ready' };
    }
  }
  
  // Fallback: if StatusInfoState is empty but RVMStatusReady is truthy, it's operational
  if (rvmData.RVMStatusReady) {
    return { status: 'operational', statusInfoState: statusInfoState || 'Ready' };
  }
  
  // No status info and not ready = offline
  return { status: 'offline', statusInfoState: statusInfoState || 'Offline' };
}

/**
 * Fetch machine stats from ePortal
 */
async function fetchMachineStats(machineId: string): Promise<MachineData | null> {
  try {
    const key = await authenticate();
    if (!key) {
      // Return cached data if available
      const cached = machineCache.get(machineId);
      if (cached) {
        console.log('[Backbone] Using cached data for', machineId);
        return { ...cached, apiStatus: backboneStatus.apiStatus };
      }
      return null;
    }

    const targetDate = amsterdamDateString();
    
    // Build headers with session cookie if available
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (sessionCookie) {
      headers['Cookie'] = sessionCookie;
    }
    
    console.log('[Backbone] Fetching rvmStats for', machineId, 'date:', targetDate);
    const response = await fetch(
      `${EPORTAL_BASE_URL}/rvmStats?apiKey=${key}&rvms=${machineId}&rvmDate=${targetDate}`,
      {
        method: 'GET',
        headers,
        redirect: 'follow', // Follow redirects automatically
      }
    );
    
    console.log('[Backbone] rvmStats response:', response.status, response.statusText);

    // Handle redirect responses (303 means redirect to GET)
    if (response.status === 303) {
      const redirectUrl = response.headers.get('Location');
      console.log('[Backbone] Got 303 redirect to:', redirectUrl);
      if (redirectUrl) {
        const redirectResponse = await fetch(redirectUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        if (!redirectResponse.ok) {
          throw new Error(`Redirect API error: ${redirectResponse.status}`);
        }
        const redirectData = await redirectResponse.json();
        if (redirectData.rvmData && redirectData.rvmData[machineId]) {
          const rvmData = redirectData.rvmData[machineId];
          const todayBottles = rvmData.pet_accepted || 0;
          const todayCans = rvmData.cans_accepted || 0;
          
          // Update lifetime counters
          await updateLifetimeCounters(machineId, todayBottles, todayCans);
          
          // Calculate all-time split
          const { allTimeBottles, allTimeCans } = calculateAllTimeSplit(todayBottles, todayCans);
          
          // Determine status from StatusInfoState
          const { status, statusInfoState } = determineStatus(rvmData);
          
          const machineData: MachineData = {
            machineId,
            status,
            statusInfoState,
            // Today's counts (reset at midnight)
            todayBottles,
            todayCans,
            todayTotal: todayBottles + todayCans,
            // All-time total (lifetime meter)
            allTimeTotal: rvmData.StatusInfoMeter || 0,
            // All-time split (calculated)
            allTimeBottles,
            allTimeCans,
            // Bin fill counts (reset when emptied)
            binBottles: rvmData.BinInfoCountBin2 || 0,
            binCans: rvmData.BinInfoCountBin1 || 0,
            // Capacities
            bottleCapacity: rvmData.BinInfoLimitBin2 || 100,
            canCapacity: rvmData.BinInfoLimitBin1 || 100,
            itemsPerMinute: rvmData.RVMStatusProcessing || 0,
            lastUpdated: new Date(),
            lastApiSuccess: new Date(),
            apiStatus: 'connected',
            rawData: rvmData
          };
          machineCache.set(machineId, machineData);
          await saveMachineStatus(machineData);
          console.log('[Backbone] ✅ Updated machine via redirect', machineId);
          return machineData;
        }
      }
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.rvmData && data.rvmData[machineId]) {
      const rvmData = data.rvmData[machineId];
      const todayBottles = rvmData.pet_accepted || 0;
      const todayCans = rvmData.cans_accepted || 0;
      
      // Update lifetime counters
      await updateLifetimeCounters(machineId, todayBottles, todayCans);
      
      // Calculate all-time split
      const { allTimeBottles, allTimeCans } = calculateAllTimeSplit(todayBottles, todayCans);
      
      // Determine status from StatusInfoState
      const { status, statusInfoState } = determineStatus(rvmData);
      
      const machineData: MachineData = {
        machineId,
        status,
        statusInfoState,
        // Today's counts (reset at midnight)
        todayBottles,
        todayCans,
        todayTotal: todayBottles + todayCans,
        // All-time total (lifetime meter)
        allTimeTotal: rvmData.StatusInfoMeter || 0,
        // All-time split (calculated)
        allTimeBottles,
        allTimeCans,
        // Bin fill counts (reset when emptied)
        binBottles: rvmData.BinInfoCountBin2 || 0,
        binCans: rvmData.BinInfoCountBin1 || 0,
        // Capacities
        bottleCapacity: rvmData.BinInfoLimitBin2 || 100,
        canCapacity: rvmData.BinInfoLimitBin1 || 100,
        itemsPerMinute: rvmData.RVMStatusProcessing || 0,
        lastUpdated: new Date(),
        lastApiSuccess: new Date(),
        apiStatus: 'connected',
        rawData: rvmData
      };

      // Update cache
      machineCache.set(machineId, machineData);
      
      // Save to database
      await saveMachineStatus(machineData);
      
      console.log('[Backbone] ✅ Updated machine', machineId);
      return machineData;
    }

    return null;
  } catch (error) {
    console.error('[Backbone] Fetch error:', error);
    backboneStatus.errors.push(`Fetch error: ${error}`);
    
    // Return cached data
    const cached = machineCache.get(machineId);
    if (cached) {
      return { ...cached, apiStatus: 'error' };
    }
    return null;
  }
}

/**
 * Save machine status to database
 */
async function saveMachineStatus(data: MachineData): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    // Upsert machine status
    await db.insert(machineStatus).values({
      machineId: data.machineId,
      status: data.status,
      statusInfoState: data.statusInfoState,
      bottlesCount: data.binBottles,
      cansCount: data.binCans,
      bottleCapacity: data.bottleCapacity,
      canCapacity: data.canCapacity,
      lastKnownCounter: data.allTimeTotal,
      lastKnownBottles: data.todayBottles,
      lastKnownCans: data.todayCans,
      lastApiSuccess: data.lastApiSuccess,
      lastUpdated: data.lastUpdated,
    }).onDuplicateKeyUpdate({
      set: {
        status: data.status,
        statusInfoState: data.statusInfoState,
        bottlesCount: data.binBottles,
        cansCount: data.binCans,
        lastKnownCounter: data.allTimeTotal,
        lastKnownBottles: data.todayBottles,
        lastKnownCans: data.todayCans,
        lastApiSuccess: data.lastApiSuccess,
        lastUpdated: data.lastUpdated,
      }
    });
  } catch (error) {
    console.error('[Backbone] DB save error:', error);
  }
}

/**
 * Load machine status from database (fallback)
 */
async function loadMachineStatusFromDb(machineId: string): Promise<MachineData | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const result = await db.select().from(machineStatus)
      .where(eq(machineStatus.machineId, machineId))
      .limit(1);

    if (result.length > 0) {
      const row = result[0];
      const todayBottles = row.lastKnownBottles || 0;
      const todayCans = row.lastKnownCans || 0;
      const { allTimeBottles, allTimeCans } = calculateAllTimeSplit(todayBottles, todayCans);
      
      return {
        machineId: row.machineId,
        status: row.status as MachineData['status'],
        statusInfoState: row.statusInfoState || '',
        todayBottles,
        todayCans,
        todayTotal: todayBottles + todayCans,
        allTimeTotal: row.lastKnownCounter || 0,
        allTimeBottles,
        allTimeCans,
        binBottles: row.bottlesCount || 0,
        binCans: row.cansCount || 0,
        bottleCapacity: row.bottleCapacity,
        canCapacity: row.canCapacity,
        itemsPerMinute: 0,
        lastUpdated: row.lastUpdated,
        lastApiSuccess: row.lastApiSuccess,
        apiStatus: 'offline'
      };
    }
    return null;
  } catch (error) {
    console.error('[Backbone] DB load error:', error);
    return null;
  }
}

/**
 * Poll all machines
 */
async function pollMachines(): Promise<void> {
  console.log('[Backbone] 🔄 Polling machines...');
  backboneStatus.lastPoll = new Date();
  
  // Poll default machine (can add more machines here)
  const machineIds = [DEFAULT_MACHINE_ID];
  
  for (const machineId of machineIds) {
    const data = await fetchMachineStats(machineId);
    if (data) {
      machineCache.set(machineId, data);
    }
  }
  
  // Update backbone status
  backboneStatus.machines = Array.from(machineCache.values());
  backboneStatus.nextPoll = new Date(Date.now() + backboneStatus.pollIntervalMs);
  
  // Keep only last 50 errors
  if (backboneStatus.errors.length > 50) {
    backboneStatus.errors = backboneStatus.errors.slice(-50);
  }
}

/**
 * Start the backbone polling service
 */
export function startBackbone(intervalMs: number = 300000): void {
  if (backboneStatus.isRunning) {
    console.log('[Backbone] Already running');
    return;
  }

  console.log('[Backbone] 🚀 Starting backbone service with interval:', intervalMs, 'ms');
  backboneStatus.isRunning = true;
  backboneStatus.pollIntervalMs = intervalMs;
  
  // Initial poll
  pollMachines();
  
  // Set up interval
  pollInterval = setInterval(pollMachines, intervalMs);
}

/**
 * Stop the backbone polling service
 */
export function stopBackbone(): void {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  backboneStatus.isRunning = false;
  console.log('[Backbone] ⏹️ Stopped backbone service');
}

/**
 * Get current backbone status
 */
export function getBackboneStatus(): BackboneStatus {
  return { ...backboneStatus };
}

/**
 * Get machine data from cache (fast)
 */
export function getMachineData(machineId: string = DEFAULT_MACHINE_ID): MachineData | null {
  return machineCache.get(machineId) || null;
}

/**
 * Get all machines data
 */
export function getAllMachinesData(): MachineData[] {
  return Array.from(machineCache.values());
}

/**
 * Force refresh a machine's data
 */
export async function refreshMachineData(machineId: string = DEFAULT_MACHINE_ID): Promise<MachineData | null> {
  return await fetchMachineStats(machineId);
}

/**
 * Initialize backbone with database fallback
 */
export async function initializeBackbone(): Promise<void> {
  console.log('[Backbone] 📦 Initializing...');
  
  // Load lifetime counters first
  await loadLifetimeCounters(DEFAULT_MACHINE_ID);
  
  // Load from database first
  const dbData = await loadMachineStatusFromDb(DEFAULT_MACHINE_ID);
  if (dbData) {
    machineCache.set(DEFAULT_MACHINE_ID, dbData);
    backboneStatus.machines = [dbData];
    console.log('[Backbone] Loaded cached data from database');
  }
  
  // Start polling
  startBackbone();
}

/**
 * Get lifetime split data
 */
export function getLifetimeSplit(): { baselineBottles: number; baselineCans: number; accumulatedBottles: number; accumulatedCans: number } {
  return {
    baselineBottles: BASELINE_BOTTLES,
    baselineCans: BASELINE_CANS,
    accumulatedBottles: lifetimeCache.accumulatedBottles,
    accumulatedCans: lifetimeCache.accumulatedCans
  };
}


/**
 * Event data structure from ePortal events API
 */
export interface MachineEvent {
  eventId: number;
  eventDesc: string;
  eventDate: string;
  machineId: string;
  isActive: boolean; // True if this is a recent/active event
}

// Event codes reference
const EVENT_CODES: Record<number, string> = {
  // Kritieke Events
  40012: 'Missed 2 check-ins (OFFLINE)',
  40013: 'Missed 5 check-ins',
  40014: 'Missed 10 check-ins',
  9304: 'Printer: Out of Paper',
  // Bin Full Events
  9200: 'Bin full by sensor',
  9201: 'Bin 1 full by sensor',
  9202: 'Bin 2 full by sensor',
  9203: 'Bin 3 full by sensor',
  9204: 'Bin 4 full by sensor',
  9210: 'Bin full by count',
  9211: 'Bin 1 full by count',
  9212: 'Bin 2 full by count',
  9213: 'Bin 3 full by count',
  9214: 'Bin 4 full by count',
  // Machine Events
  1010: 'Remove Container from Intake',
  1152: 'Bin Door 1 open',
  1156: 'RVM-Init: not all Bins ready',
  1157: 'Do not feed containers!',
  // State Change Events
  40011: 'State change (Ready/Error/Door)',
  40005: 'Ping (elke 30 min)',
  40010: 'Receipt data pushed',
  40009: 'REST API Delivery Failure',
};

// Cache for recent events
let recentEventsCache: MachineEvent[] = [];
let lastEventsFetch: Date | null = null;

/**
 * Fetch recent events from ePortal API
 * Returns events from the last 24 hours
 */
export async function fetchRecentEvents(machineId: string = DEFAULT_MACHINE_ID): Promise<MachineEvent[]> {
  const key = await authenticate();
  if (!key) {
    console.warn('[Backbone] Cannot fetch events - not authenticated');
    return recentEventsCache; // Return cached data
  }

  try {
    // Get events from last 24 hours
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    
    const startDateStr = amsterdamDateString(startDate);
    const endDateStr = amsterdamDateString(endDate);

    const url = `${EPORTAL_BASE_URL}/events?apiKey=${key}&rvms=${machineId}&startDate=${startDateStr}&endDate=${endDateStr}`;
    
    console.log('[Backbone] Fetching events from:', startDateStr, 'to', endDateStr);

    const headers: Record<string, string> = {
      'Accept': '*/*',
    };
    if (sessionCookie) {
      headers['Cookie'] = sessionCookie;
    }

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Events API failed: ${response.status}`);
    }

    const csvText = await response.text();
    const events = parseEventsCSV(csvText, machineId);
    
    // Filter for important events (errors, bin full, etc.)
    const importantEventIds = Object.keys(EVENT_CODES).map(Number);
    const importantEvents = events.filter(e => importantEventIds.includes(e.eventId));
    
    // Mark recent events as active (within last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    importantEvents.forEach(e => {
      e.isActive = new Date(e.eventDate) > fifteenMinutesAgo;
    });

    recentEventsCache = importantEvents;
    lastEventsFetch = new Date();
    
    console.log('[Backbone] ✅ Fetched', importantEvents.length, 'important events');
    return importantEvents;

  } catch (error) {
    console.error('[Backbone] Events fetch error:', error);
    return recentEventsCache; // Return cached data on error
  }
}

/**
 * Parse CSV response from events API
 */
function parseEventsCSV(csvText: string, machineId: string): MachineEvent[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const events: MachineEvent[] = [];
  
  // Skip header line, parse data lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // CSV format: rvmId,eventId,eventDate,eventDesc (or similar)
    // We need to handle quoted fields
    const fields = parseCSVLine(line);
    
    if (fields.length >= 3) {
      const eventId = parseInt(fields[1]) || 0;
      const eventDate = fields[2] || '';
      const eventDesc = fields[3] || EVENT_CODES[eventId] || `Event ${eventId}`;
      
      events.push({
        eventId,
        eventDesc,
        eventDate,
        machineId,
        isActive: false
      });
    }
  }

  // Sort by date descending (most recent first)
  events.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  
  return events;
}

/**
 * Parse a single CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  
  return fields;
}

/**
 * Get cached recent events
 */
export function getRecentEvents(): MachineEvent[] {
  return recentEventsCache;
}

/**
 * Get active event IDs (for highlighting in UI)
 */
export function getActiveEventIds(): number[] {
  return recentEventsCache
    .filter(e => e.isActive)
    .map(e => e.eventId);
}

/**
 * Get event description by ID
 */
export function getEventDescription(eventId: number): string {
  return EVENT_CODES[eventId] || `Unknown Event ${eventId}`;
}
