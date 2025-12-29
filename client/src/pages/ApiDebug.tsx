// @ts-nocheck
import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  RefreshCw, 
  Server, 
  Database, 
  Cpu, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  Lock,
  KeyRound
} from "lucide-react";
import Header from "@/components/Header";

const PIN_CODE = "2486";
const PIN_STORAGE_KEY = "repayz_api_debug_auth";

// Event item component with active highlighting
function EventItem({ code, description, isActive, colorClass }: { 
  code: number; 
  description: string; 
  isActive: boolean;
  colorClass: 'red' | 'orange' | 'purple' | 'green' | 'blue' | 'yellow';
}) {
  const colors = {
    red: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-500', text: 'text-red-700', ring: 'ring-red-400' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500', text: 'text-orange-700', ring: 'ring-orange-400' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-500', text: 'text-purple-700', ring: 'ring-purple-400' },
    green: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-500', text: 'text-green-700', ring: 'ring-green-400' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-500', text: 'text-blue-700', ring: 'ring-blue-400' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-500', text: 'text-yellow-700', ring: 'ring-yellow-400' },
  };
  const c = colors[colorClass];
  
  return (
    <div className={`${c.bg} ${c.border} border rounded p-2 flex items-center gap-2 transition-all ${
      isActive ? `ring-2 ${c.ring} animate-pulse` : ''
    }`}>
      <span className={`${c.badge} text-white text-xs font-mono px-2 py-1 rounded`}>{code}</span>
      <span className={`${c.text} text-sm flex-1`}>{description}</span>
      {isActive && (
        <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">
          ACTIEF
        </span>
      )}
    </div>
  );
}

// Push Events Section with active event highlighting
function PushEventsSection() {
  const { data: eventsData, isLoading, refetch } = trpc.machine.getRecentEvents.useQuery(undefined, {
    refetchInterval: 60000, // Refresh every minute
  });

  const activeEventIds = eventsData?.activeEventIds || [];
  const recentEvents = eventsData?.events || [];
  
  const isEventActive = (eventId: number) => activeEventIds.includes(eventId);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#1a3a52] font-bold flex items-center gap-2">
          <span className="text-lg">📡</span>
          Push Events - Live Status
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          disabled={isLoading}
          className="text-xs"
        >
          <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Recent Active Events */}
      {recentEvents.length > 0 && recentEvents.some(e => e.isActive) && (
        <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-lg">
          <h4 className="text-red-700 font-bold mb-2 flex items-center gap-2">
            <span className="animate-pulse">🚨</span>
            Actieve Events (laatste 15 min)
          </h4>
          <div className="space-y-2">
            {recentEvents.filter(e => e.isActive).map((event, idx) => (
              <div key={idx} className="bg-white border border-red-300 rounded p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white text-xs font-mono px-2 py-1 rounded">{event.eventId}</span>
                  <span className="text-red-800 font-medium">{event.eventDesc}</span>
                </div>
                <span className="text-red-600 text-xs">
                  {new Date(event.eventDate).toLocaleString('nl-NL')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Critical Events */}
      <div className="mb-4">
        <h4 className="text-red-600 font-semibold mb-2 text-sm">🚨 Kritieke Events</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <EventItem code={40012} description="Missed 2 check-ins (OFFLINE)" isActive={isEventActive(40012)} colorClass="red" />
          <EventItem code={40013} description="Missed 5 check-ins" isActive={isEventActive(40013)} colorClass="red" />
          <EventItem code={40014} description="Missed 10 check-ins" isActive={isEventActive(40014)} colorClass="red" />
          <EventItem code={9304} description="Printer: Out of Paper" isActive={isEventActive(9304)} colorClass="red" />
        </div>
      </div>

      {/* Bin Full Events */}
      <div className="mb-4">
        <h4 className="text-orange-600 font-semibold mb-2 text-sm">📦 Bin Vol Events</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <EventItem code={9200} description="Bin full (sensor)" isActive={isEventActive(9200)} colorClass="orange" />
          <EventItem code={9201} description="Bin 1 full (sensor)" isActive={isEventActive(9201)} colorClass="orange" />
          <EventItem code={9210} description="Bin full (count)" isActive={isEventActive(9210)} colorClass="orange" />
        </div>
      </div>

      {/* Machine Events */}
      <div className="mb-4">
        <h4 className="text-purple-600 font-semibold mb-2 text-sm">⚙️ Machine Events</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <EventItem code={1152} description="Bin Door 1 open" isActive={isEventActive(1152)} colorClass="purple" />
          <EventItem code={1156} description="RVM-Init: not all Bins ready" isActive={isEventActive(1156)} colorClass="purple" />
          <EventItem code={1157} description="Do not feed containers!" isActive={isEventActive(1157)} colorClass="purple" />
          <EventItem code={1010} description="Remove Container from Intake" isActive={isEventActive(1010)} colorClass="purple" />
        </div>
      </div>

      {/* State Change Events */}
      <div>
        <h4 className="text-green-600 font-semibold mb-2 text-sm">🔄 State Change Events</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <EventItem code={40011} description="State change (Ready/Error/Door)" isActive={isEventActive(40011)} colorClass="green" />
          <EventItem code={40005} description="Ping (elke 30 min)" isActive={isEventActive(40005)} colorClass="blue" />
          <EventItem code={40010} description="Receipt data pushed" isActive={isEventActive(40010)} colorClass="blue" />
          <EventItem code={40009} description="REST API Delivery Failure" isActive={isEventActive(40009)} colorClass="yellow" />
        </div>
      </div>

      {/* Last fetch info */}
      {eventsData?.lastFetch && (
        <p className="text-gray-400 text-xs mt-4">
          Laatste update: {new Date(eventsData.lastFetch).toLocaleString('nl-NL')}
        </p>
      )}
    </div>
  );
}

// Full API Response Component
function FullApiResponse() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: cachedData, isLoading, refetch } = trpc.machine.getCachedData.useQuery(undefined, {
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardContent className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-[#4db8a8] animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading full API response...</p>
        </CardContent>
      </Card>
    );
  }

  const rawData = cachedData?.rawData || {};

  // Get all fields from raw data
  const allFields = Object.keys(rawData);
  
  // Filter fields based on search query
  const filteredFields = searchQuery 
    ? allFields.filter(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(rawData[field]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Group fields by category for easier viewing
  const categories = {
    'Counters & Totals': ['pet_accepted', 'cans_accepted', 'glass_accepted', 'RVMStatusBarcodeCount', 'StatusInfoMeter', 'StatusInfoProcessing'],
    'Bin Fill Status': ['BinInfoCountBin1', 'BinInfoCountBin2', 'BinInfoCountBin3', 'BinInfoCountBin4', 'BinInfoMaterialBin1', 'BinInfoMaterialBin2', 'BinInfoFullBin1', 'BinInfoFullBin2'],
    'Machine Status': ['StatusInfoState', 'RVMStatusReady', 'RVMStatusError', 'RVMStatusState', 'RVMStatusSubState', 'RVMStatusDoorOpen', 'RVMStatusBinFull', 'RVMStatusErrorNoClose'],
    'Site Info': ['SiteInfoAddress', 'SiteInfoCity', 'SiteInfoCountry', 'SiteInfoPostalCode', 'SiteInfoState'],
    'Version Info': ['VersionREL', 'VersionCC', 'VersionMCP', 'VersionLC'],
    'Last Event': ['LastEventId', 'LastEventDate', 'LastEventDesc'],
  };

  return (
    <Card className="bg-white border-gray-200 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-[#1a3a52] text-lg sm:text-xl">Full ePortal API Response</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Complete raw data from the ePortal API
            </CardDescription>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="border-[#4db8a8] text-[#4db8a8] hover:bg-[#4db8a8] hover:text-white w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        {/* Search Bar */}
        <div className="mt-4 relative">
          <Input
            type="text"
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 pl-10"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 overflow-x-auto">
        {/* Search Results */}
        {searchQuery && (
          <div className="bg-[#4db8a8]/10 border border-[#4db8a8] rounded-lg p-4">
            <h3 className="text-[#1a3a52] font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-[#4db8a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Results ({filteredFields.length} matches)
            </h3>
            {filteredFields.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredFields.map((field) => (
                  <div key={field} className="bg-white rounded p-3 border border-[#4db8a8] shadow-sm">
                    <p className="text-[#4db8a8] text-xs font-mono break-all">{field}</p>
                    <p className="text-[#1a3a52] font-bold text-base sm:text-lg break-all">
                      {rawData[field] !== undefined ? String(rawData[field]) : '-'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No fields found matching "{searchQuery}"</p>
            )}
          </div>
        )}

        {/* Categorized Fields */}
        {Object.entries(categories).map(([category, fields]) => (
          <div key={category} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-[#1a3a52] font-bold mb-3 text-base sm:text-lg">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {fields.map((field) => (
                <div key={field} className={`bg-white rounded p-3 border shadow-sm ${searchQuery && field.toLowerCase().includes(searchQuery.toLowerCase()) ? 'ring-2 ring-[#4db8a8] border-[#4db8a8]' : 'border-gray-200'}`}>
                  <p className="text-gray-500 text-xs font-mono break-all">{field}</p>
                  <p className="text-[#1a3a52] font-bold text-base sm:text-lg break-all">
                    {rawData[field] !== undefined ? String(rawData[field]) : '-'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* All Fields (uncategorized) */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-[#1a3a52] font-bold mb-3 text-base sm:text-lg">All Fields ({allFields.length} total)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-auto">
            {allFields.sort().map((field) => (
              <div key={field} className={`bg-white rounded p-3 border shadow-sm ${searchQuery && field.toLowerCase().includes(searchQuery.toLowerCase()) ? 'ring-2 ring-[#4db8a8] border-[#4db8a8]' : 'border-gray-200'}`}>
                <p className="text-gray-500 text-xs font-mono break-all">{field}</p>
                <p className="text-[#1a3a52] font-bold text-sm break-all">
                  {rawData[field] !== undefined ? String(rawData[field]) : '-'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Event Codes Reference */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-[#1a3a52] font-bold mb-3 text-base sm:text-lg">📋 ePortal Event Codes Reference</h3>
          <p className="text-gray-500 text-sm mb-4">Push event codes from ePortal API documentation</p>
          
          {/* Machine States */}
          <div className="mb-4">
            <h4 className="text-[#1a3a52] font-semibold mb-2 text-sm">Machine States (Event 40011)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-green-100 border border-green-500 rounded p-2 text-center">
                <span className="text-green-700 font-bold">Ready</span>
                <p className="text-green-600 text-xs">Operationeel</p>
              </div>
              <div className="bg-red-100 border border-red-500 rounded p-2 text-center">
                <span className="text-red-700 font-bold">Error</span>
                <p className="text-red-600 text-xs">Storing</p>
              </div>
              <div className="bg-yellow-100 border border-yellow-500 rounded p-2 text-center">
                <span className="text-yellow-700 font-bold">Door</span>
                <p className="text-yellow-600 text-xs">Deur Open</p>
              </div>
              <div className="bg-blue-100 border border-blue-500 rounded p-2 text-center">
                <span className="text-blue-700 font-bold">Door(Tech)</span>
                <p className="text-blue-600 text-xs">Onderhoud</p>
              </div>
            </div>
          </div>

          {/* Bin Full Events */}
          <div className="mb-4">
            <h4 className="text-[#1a3a52] font-semibold mb-2 text-sm">Bin Full Events</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2 py-1 text-left text-[#1a3a52]">Code</th>
                    <th className="px-2 py-1 text-left text-[#1a3a52]">Beschrijving</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-orange-600">9200</td><td className="px-2 py-1 text-gray-700">Bin full by sensor</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-orange-600">9201</td><td className="px-2 py-1 text-gray-700">Bin 1 full by sensor</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-orange-600">9202</td><td className="px-2 py-1 text-gray-700">Bin 2 full by sensor</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-orange-600">9210</td><td className="px-2 py-1 text-gray-700">Bin full by count</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-orange-600">9211</td><td className="px-2 py-1 text-gray-700">Bin 1 full by count</td></tr>
                  <tr><td className="px-2 py-1 font-mono text-orange-600">9212</td><td className="px-2 py-1 text-gray-700">Bin 2 full by count</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Machine Events */}
          <div className="mb-4">
            <h4 className="text-[#1a3a52] font-semibold mb-2 text-sm">Machine Events</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2 py-1 text-left text-[#1a3a52]">Code</th>
                    <th className="px-2 py-1 text-left text-[#1a3a52]">Beschrijving</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-purple-600">1010</td><td className="px-2 py-1 text-gray-700">Remove Container from Intake</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-purple-600">1012</td><td className="px-2 py-1 text-gray-700">Take your Receipt</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-purple-600">1152</td><td className="px-2 py-1 text-gray-700">Bin Door 1 open</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-purple-600">1153</td><td className="px-2 py-1 text-gray-700">...wait for recovery!</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-purple-600">1154</td><td className="px-2 py-1 text-gray-700">Receipt is printing</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-purple-600">1156</td><td className="px-2 py-1 text-gray-700">RVM-Init: not all Bins ready</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-purple-600">1157</td><td className="px-2 py-1 text-gray-700">Do not feed containers!</td></tr>
                  <tr><td className="px-2 py-1 font-mono text-purple-600">9304</td><td className="px-2 py-1 text-gray-700">Printer: Out of Paper</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* System Events */}
          <div>
            <h4 className="text-[#1a3a52] font-semibold mb-2 text-sm">System Events (ePortal Generated)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2 py-1 text-left text-[#1a3a52]">Code</th>
                    <th className="px-2 py-1 text-left text-[#1a3a52]">Beschrijving</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-blue-600">40005</td><td className="px-2 py-1 text-gray-700">Ping (elke 30 min)</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-blue-600">40009</td><td className="px-2 py-1 text-gray-700">REST API Delivery Failure</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-blue-600">40010</td><td className="px-2 py-1 text-gray-700">Receipt data pushed</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-green-600">40011</td><td className="px-2 py-1 text-gray-700">State change (Ready/Error/Door)</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-red-600">40012</td><td className="px-2 py-1 text-gray-700">Missed 2 check-ins (offline)</td></tr>
                  <tr className="border-b border-gray-200"><td className="px-2 py-1 font-mono text-red-600">40013</td><td className="px-2 py-1 text-gray-700">Missed 5 check-ins</td></tr>
                  <tr><td className="px-2 py-1 font-mono text-red-600">40014</td><td className="px-2 py-1 text-gray-700">Missed 10 check-ins</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Full Raw JSON */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-[#1a3a52] font-bold mb-3 text-base sm:text-lg">Complete Raw JSON</h3>
          <pre className="bg-[#1a3a52] rounded-lg p-4 overflow-auto max-h-96 text-xs text-[#4db8a8] font-mono">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ApiDebug() {
  // Prevent this page from being indexed by search engines
  useSEO({
    title: 'API Debug - REPAYZ',
    noindex: true
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Check if already authenticated on mount
  useEffect(() => {
    const storedAuth = sessionStorage.getItem(PIN_STORAGE_KEY);
    if (storedAuth === "true") {
      setIsUnlocked(true);
    }
  }, []);

  // Handle PIN submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === PIN_CODE) {
      setIsUnlocked(true);
      setPinError(false);
      sessionStorage.setItem(PIN_STORAGE_KEY, "true");
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem(PIN_STORAGE_KEY);
  };

  // Fetch backbone status
  const { data: backboneStatus, isLoading: backboneLoading, refetch: refetchBackbone } = 
    trpc.machine.getBackboneStatus.useQuery(undefined, {
      refetchInterval: isUnlocked ? 5000 : false,
      enabled: isUnlocked,
    });

  // Fetch machine data
  const { data: machineData, isLoading: machineLoading, refetch: refetchMachine } = 
    trpc.machine.getStatus.useQuery(undefined, {
      refetchInterval: isUnlocked ? 5000 : false,
      enabled: isUnlocked,
    });

  // Force refresh mutation
  const forceRefresh = trpc.machine.forceRefresh.useMutation({
    onSuccess: () => {
      refetchBackbone();
      refetchMachine();
    }
  });

  // PIN Login Screen
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-10 sm:py-20">
          <Card className="max-w-md mx-auto bg-white border-gray-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-[#4db8a8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#4db8a8]" />
              </div>
              <CardTitle className="text-2xl text-[#1a3a52]">API Debug Panel</CardTitle>
              <CardDescription className="text-gray-500">
                Voer de PIN code in om toegang te krijgen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="PIN code"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    className={`pl-10 text-center text-2xl tracking-widest bg-gray-50 border-gray-300 text-[#1a3a52] ${
                      pinError ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                    maxLength={4}
                    autoFocus
                  />
                </div>
                {pinError && (
                  <p className="text-red-500 text-sm text-center flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Onjuiste PIN code
                  </p>
                )}
                <Button 
                  type="submit"
                  className="w-full bg-[#4db8a8] hover:bg-[#3da898] text-white"
                  disabled={pinInput.length !== 4}
                >
                  Toegang
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'operational':
        return 'bg-green-500';
      case 'rate_limited':
        return 'bg-yellow-500';
      case 'error':
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rate_limited':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a3a52] flex items-center gap-3">
              <Server className="w-6 h-6 sm:w-8 sm:h-8 text-[#4db8a8]" />
              API Debug Panel
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Monitor en beheer alle API verbindingen
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => forceRefresh.mutate()}
              disabled={forceRefresh.isPending}
              className="bg-[#4db8a8] hover:bg-[#3da898] text-white flex-1 sm:flex-none"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${forceRefresh.isPending ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Lock className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Uitloggen</span>
            </Button>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Backbone Status */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-[#4db8a8]" />
                  <span className="text-[#1a3a52] font-medium text-sm sm:text-base">Backbone</span>
                </div>
                {backboneStatus?.isRunning ? (
                  <Badge className="bg-green-500 text-white text-xs">Running</Badge>
                ) : (
                  <Badge className="bg-red-500 text-white text-xs">Stopped</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* API Status */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {backboneStatus?.apiStatus === 'connected' ? (
                    <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  )}
                  <span className="text-[#1a3a52] font-medium text-sm sm:text-base">ePortal</span>
                </div>
                <Badge className={`${getStatusColor(backboneStatus?.apiStatus || 'offline')} text-white text-xs`}>
                  {backboneStatus?.apiStatus || 'Unknown'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Poll Interval */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#4db8a8]" />
                  <span className="text-[#1a3a52] font-medium text-sm sm:text-base">Interval</span>
                </div>
                <span className="text-[#1a3a52] font-bold text-sm sm:text-base">
                  {backboneStatus?.pollIntervalMs ? `${backboneStatus.pollIntervalMs / 1000}s` : '-'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Machines Count */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-[#4db8a8]" />
                  <span className="text-[#1a3a52] font-medium text-sm sm:text-base">Machines</span>
                </div>
                <span className="text-[#1a3a52] font-bold text-sm sm:text-base">
                  {backboneStatus?.machines?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different data views */}
        <Tabs defaultValue="diagnose" className="space-y-4">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="bg-white border border-gray-200 inline-flex min-w-max">
              <TabsTrigger value="diagnose" className="data-[state=active]:bg-[#4db8a8] data-[state=active]:text-white text-[#1a3a52] text-xs sm:text-sm px-2 sm:px-4">
                🔍 Diagnose
              </TabsTrigger>
              <TabsTrigger value="machines" className="data-[state=active]:bg-[#4db8a8] data-[state=active]:text-white text-[#1a3a52] text-xs sm:text-sm px-2 sm:px-4">
                Machines
              </TabsTrigger>
              <TabsTrigger value="backbone" className="data-[state=active]:bg-[#4db8a8] data-[state=active]:text-white text-[#1a3a52] text-xs sm:text-sm px-2 sm:px-4">
                Backbone
              </TabsTrigger>
              <TabsTrigger value="errors" className="data-[state=active]:bg-[#4db8a8] data-[state=active]:text-white text-[#1a3a52] text-xs sm:text-sm px-2 sm:px-4">
                Errors
              </TabsTrigger>
              <TabsTrigger value="raw" className="data-[state=active]:bg-[#4db8a8] data-[state=active]:text-white text-[#1a3a52] text-xs sm:text-sm px-2 sm:px-4">
                Raw
              </TabsTrigger>
              <TabsTrigger value="fullapi" className="data-[state=active]:bg-[#4db8a8] data-[state=active]:text-white text-[#1a3a52] text-xs sm:text-sm px-2 sm:px-4">
                Full API
              </TabsTrigger>
              <TabsTrigger value="future" className="data-[state=active]:bg-[#4db8a8] data-[state=active]:text-white text-[#1a3a52] text-xs sm:text-sm px-2 sm:px-4">
                Future
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Diagnose Tab - Quick Diagnosis */}
          <TabsContent value="diagnose">
            <div className="space-y-4">
              {/* Current Machine State (4.4) */}
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#1a3a52] flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Snelle Diagnose
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Machine status (4.4) en push events voor snelle troubleshooting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current State Section */}
                  <div>
                    <h3 className="text-[#1a3a52] font-bold mb-3 flex items-center gap-2">
                      <span className="text-lg">📊</span>
                      Huidige Machine Status (Event 40011)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Ready State */}
                      <div className={`rounded-lg p-4 text-center border-2 transition-all ${
                        (backboneStatus?.machines?.[0] as any)?.statusInfoState === 'Ready' || (backboneStatus?.machines?.[0] as any)?.status === 'operational'
                          ? 'bg-green-100 border-green-500 ring-2 ring-green-300'
                          : 'bg-gray-50 border-gray-200 opacity-50'
                      }`}>
                        <div className="text-3xl mb-1">✅</div>
                        <span className="text-green-700 font-bold block">Ready</span>
                        <p className="text-green-600 text-xs">Operationeel</p>
                      </div>
                      {/* Error State */}
                      <div className={`rounded-lg p-4 text-center border-2 transition-all ${
                        (backboneStatus?.machines?.[0] as any)?.statusInfoState === 'Error' || (backboneStatus?.machines?.[0] as any)?.status === 'error'
                          ? 'bg-red-100 border-red-500 ring-2 ring-red-300'
                          : 'bg-gray-50 border-gray-200 opacity-50'
                      }`}>
                        <div className="text-3xl mb-1">❌</div>
                        <span className="text-red-700 font-bold block">Error</span>
                        <p className="text-red-600 text-xs">Storing</p>
                      </div>
                      {/* Door State */}
                      <div className={`rounded-lg p-4 text-center border-2 transition-all ${
                        (backboneStatus?.machines?.[0] as any)?.statusInfoState === 'Door' || (backboneStatus?.machines?.[0] as any)?.status === 'door_open'
                          ? 'bg-yellow-100 border-yellow-500 ring-2 ring-yellow-300'
                          : 'bg-gray-50 border-gray-200 opacity-50'
                      }`}>
                        <div className="text-3xl mb-1">🚪</div>
                        <span className="text-yellow-700 font-bold block">Door</span>
                        <p className="text-yellow-600 text-xs">Deur Open</p>
                      </div>
                      {/* Door(Tech) State */}
                      <div className={`rounded-lg p-4 text-center border-2 transition-all ${
                        (backboneStatus?.machines?.[0] as any)?.statusInfoState === 'Door(Tech)' || (backboneStatus?.machines?.[0] as any)?.status === 'maintenance'
                          ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300'
                          : 'bg-gray-50 border-gray-200 opacity-50'
                      }`}>
                        <div className="text-3xl mb-1">🔧</div>
                        <span className="text-blue-700 font-bold block">Door(Tech)</span>
                        <p className="text-blue-600 text-xs">Onderhoud</p>
                      </div>
                    </div>
                    {/* Current Status Info */}
                    <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">StatusInfoState:</span>
                          <p className="font-bold text-[#1a3a52]">{(backboneStatus?.machines?.[0] as any)?.statusInfoState || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="font-bold text-[#1a3a52]">{(backboneStatus?.machines?.[0] as any)?.status || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Machine ID:</span>
                          <p className="font-bold text-[#1a3a52]">{(backboneStatus?.machines?.[0] as any)?.machineId || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Update:</span>
                          <p className="font-bold text-[#1a3a52]">{(backboneStatus?.machines?.[0] as any)?.lastUpdated ? new Date((backboneStatus?.machines?.[0] as any)?.lastUpdated).toLocaleTimeString('nl-NL') : '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Push Events Quick Reference */}
                  <PushEventsSection />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Machines Tab */}
          <TabsContent value="machines">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1a3a52]">Machine Status</CardTitle>
                <CardDescription className="text-gray-500">
                  Real-time status van alle verbonden machines
                </CardDescription>
              </CardHeader>
              <CardContent>
                {backboneLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 text-[#4db8a8] animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Loading machine data...</p>
                  </div>
                ) : backboneStatus?.machines?.length > 0 ? (
                  backboneStatus.machines.map((machine: any) => (
                    <div key={machine.machineId} className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(machine.status)}
                          <div>
                            <h3 className="text-[#1a3a52] font-bold">Machine {machine.machineId}</h3>
                            <p className="text-gray-500 text-sm">
                              Last updated: {machine.lastUpdated ? new Date(machine.lastUpdated).toLocaleString('nl-NL') : 'Never'}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(machine.status)} text-white`}>
                          {machine.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-white rounded p-3 border border-gray-200 shadow-sm">
                          <p className="text-gray-500 text-xs sm:text-sm">Bottles</p>
                          <p className="text-[#1a3a52] text-lg sm:text-xl font-bold">{machine.bottlesCount || 0}</p>
                        </div>
                        <div className="bg-white rounded p-3 border border-gray-200 shadow-sm">
                          <p className="text-gray-500 text-xs sm:text-sm">Cans</p>
                          <p className="text-[#1a3a52] text-lg sm:text-xl font-bold">{machine.cansCount || 0}</p>
                        </div>
                        <div className="bg-white rounded p-3 border border-gray-200 shadow-sm">
                          <p className="text-gray-500 text-xs sm:text-sm">Total</p>
                          <p className="text-[#1a3a52] text-lg sm:text-xl font-bold">{machine.totalCount || 0}</p>
                        </div>
                        <div className="bg-white rounded p-3 border border-gray-200 shadow-sm">
                          <p className="text-gray-500 text-xs sm:text-sm">Fill Level</p>
                          <p className="text-[#1a3a52] text-lg sm:text-xl font-bold">{machine.fillLevel || 0}%</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No machines found</p>
                    <p className="text-gray-400 text-sm">Configure ePortal credentials to connect machines</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backbone Status Tab */}
          <TabsContent value="backbone">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1a3a52]">Backbone Service Status</CardTitle>
                <CardDescription className="text-gray-500">
                  Gedetailleerde status van de Machine API Backbone service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-500 text-sm mb-1">Service Status</p>
                    <div className="flex items-center gap-2">
                      {backboneStatus?.isRunning ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-[#1a3a52] font-medium">Running</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="text-[#1a3a52] font-medium">Stopped</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-500 text-sm mb-1">API Connection</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(backboneStatus?.apiStatus || 'offline')}
                      <span className="text-[#1a3a52] font-medium capitalize">{backboneStatus?.apiStatus || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-500 text-sm mb-1">Poll Interval</p>
                    <p className="text-[#1a3a52] font-medium">
                      {backboneStatus?.pollIntervalMs ? `${backboneStatus.pollIntervalMs / 1000} seconds` : 'Not set'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-500 text-sm mb-1">Last Poll</p>
                    <p className="text-[#1a3a52] font-medium">
                      {backboneStatus?.lastPollTime ? new Date(backboneStatus.lastPollTime).toLocaleString('nl-NL') : 'Never'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1a3a52]">Error Log</CardTitle>
                <CardDescription className="text-gray-500">
                  Recente fouten en waarschuwingen
                </CardDescription>
              </CardHeader>
              <CardContent>
                {backboneStatus?.errors?.length > 0 ? (
                  <div className="space-y-2">
                    {backboneStatus.errors.map((error: any, index: number) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-red-700 font-medium text-sm">{error.message}</p>
                            <p className="text-red-500 text-xs">{error.timestamp ? new Date(error.timestamp).toLocaleString('nl-NL') : ''}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-500">Geen fouten gevonden</p>
                    <p className="text-gray-400 text-sm">Het systeem werkt normaal</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Raw Data Tab */}
          <TabsContent value="raw">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1a3a52]">Raw Backbone Data</CardTitle>
                <CardDescription className="text-gray-500">
                  Complete backbone status object
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-[#1a3a52] rounded-lg p-4 overflow-auto max-h-96 text-xs text-[#4db8a8] font-mono">
                  {JSON.stringify(backboneStatus, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Full API Response Tab */}
          <TabsContent value="fullapi">
            <FullApiResponse />
          </TabsContent>

          {/* Future APIs Tab */}
          <TabsContent value="future">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1a3a52]">Future API Integrations</CardTitle>
                <CardDescription className="text-gray-500">
                  Geplande API integraties voor toekomstige functionaliteit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 border-dashed">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-500 text-lg">📊</span>
                      </div>
                      <h3 className="text-[#1a3a52] font-bold">Analytics API</h3>
                    </div>
                    <p className="text-gray-500 text-sm">Geavanceerde statistieken en rapportages</p>
                    <Badge className="mt-2 bg-gray-200 text-gray-600">Gepland</Badge>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 border-dashed">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-500 text-lg">💳</span>
                      </div>
                      <h3 className="text-[#1a3a52] font-bold">Payment API</h3>
                    </div>
                    <p className="text-gray-500 text-sm">Tikkie en andere betalingsintegraties</p>
                    <Badge className="mt-2 bg-gray-200 text-gray-600">Gepland</Badge>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 border-dashed">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-500 text-lg">🔔</span>
                      </div>
                      <h3 className="text-[#1a3a52] font-bold">Notifications API</h3>
                    </div>
                    <p className="text-gray-500 text-sm">Push notificaties en alerts</p>
                    <Badge className="mt-2 bg-gray-200 text-gray-600">Gepland</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
