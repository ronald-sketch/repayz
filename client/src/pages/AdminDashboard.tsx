// @ts-nocheck
import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Save, Upload, Eye, EyeOff, Bell, BellOff, RefreshCw, FlaskConical, TrendingUp, Users, Target, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { getPopupConfig, savePopupConfig, resetPopupSeen, resetAbTest, variantA, variantB, type PopupConfig } from "@/components/TrialPopup";
import { trpc } from "@/lib/trpc";
import { Progress } from "@/components/ui/progress";

// Prevent admin page from being indexed by search engines
function AdminDashboardSEO() {
  useSEO({
    title: 'Admin Dashboard - REPAYZ',
    noindex: true
  });
  return null;
}

interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
  };
  logo: {
    url: string;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  };
  settings: {
    whatsappNumber: string;
    openingHoursStart: string;
    openingHoursEnd: string;
    locationCity: string;
    locationCountry: string;
  };
  machine: {
    status: string;
    bottlesCount: number;
    cansCount: number;
  };
  welfare: {
    title: string;
    description: string;
  };
  payment: {
    description: string;
  };
}

// A/B Test Results Card Component
function AbTestResultsCard() {
  const { data: abResults, isLoading, refetch } = trpc.abTest.getResults.useQuery(
    { testName: 'popup_welcome' },
    { enabled: true, refetchInterval: 30000 } // Refresh every 30 seconds
  );
  const clearTest = trpc.abTest.clearTest.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧪</span> A/B Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!abResults) {
    return (
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧪</span> A/B Test Results
          </CardTitle>
          <CardDescription>No test data yet. Enable A/B testing and wait for visitors.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalImpressions = abResults.variantA.impressions + abResults.variantB.impressions;
  const maxConversionRate = Math.max(abResults.variantA.conversionRate, abResults.variantB.conversionRate);

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🧪</span> A/B Test Results
            </CardTitle>
            <CardDescription>Popup welcome test - comparing two text variants</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-600"
              onClick={() => {
                if (confirm('Are you sure you want to clear all A/B test data?')) {
                  clearTest.mutate({ testName: 'popup_welcome' });
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{totalImpressions}</p>
            <p className="text-xs text-gray-500">Total Impressions</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{abResults.variantA.conversions + abResults.variantB.conversions}</p>
            <p className="text-xs text-gray-500">Total Conversions</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">
              {abResults.winner === 'tie' ? 'Tie' : `Variant ${abResults.winner}`}
            </p>
            <p className="text-xs text-gray-500">Current Winner</p>
          </div>
        </div>

        {/* Variant A */}
        <div className={`p-4 rounded-lg border-2 ${
          abResults.winner === 'A' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">Variant A</span>
              {abResults.winner === 'A' && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">WINNING</span>}
            </div>
            <span className="text-2xl font-bold text-green-600">{abResults.variantA.conversionRate.toFixed(1)}%</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            <p><strong>{variantA.emoji} {variantA.title}</strong></p>
            <p className="text-xs mt-1">"{variantA.description1} <span className="text-[#4db8a8]">{variantA.highlight1}</span>"</p>
          </div>
          <Progress value={maxConversionRate > 0 ? (abResults.variantA.conversionRate / maxConversionRate) * 100 : 0} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{abResults.variantA.impressions} impressions</span>
            <span>{abResults.variantA.conversions} conversions</span>
            <span>{abResults.variantA.dismissals} dismissals</span>
          </div>
        </div>

        {/* Variant B */}
        <div className={`p-4 rounded-lg border-2 ${
          abResults.winner === 'B' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">Variant B</span>
              {abResults.winner === 'B' && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">WINNING</span>}
            </div>
            <span className="text-2xl font-bold text-green-600">{abResults.variantB.conversionRate.toFixed(1)}%</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            <p><strong>{variantB.emoji} {variantB.title}</strong></p>
            <p className="text-xs mt-1">"{variantB.description1} <span className="text-[#4db8a8]">{variantB.highlight1}</span>"</p>
          </div>
          <Progress value={maxConversionRate > 0 ? (abResults.variantB.conversionRate / maxConversionRate) * 100 : 0} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{abResults.variantB.impressions} impressions</span>
            <span>{abResults.variantB.conversions} conversions</span>
            <span>{abResults.variantB.dismissals} dismissals</span>
          </div>
        </div>

        {/* Statistical Note */}
        {totalImpressions < 100 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Need at least 100 impressions for statistically significant results. Currently: {totalImpressions}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [popupConfig, setPopupConfig] = useState<PopupConfig | null>(null);

  // Load content on mount
  useEffect(() => {
    loadContent();
    // Load popup config
    setPopupConfig(getPopupConfig());
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch("/content.json");
      const data = await response.json();
      setContent(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load content:", error);
      setMessage({ type: "error", text: "Failed to load content" });
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      // In a real app, this would save to a backend API
      // For now, we'll save to localStorage as a demo
      localStorage.setItem("repayz_content", JSON.stringify(content));
      setMessage({ type: "success", text: "Content saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Failed to save content:", error);
      setMessage({ type: "error", text: "Failed to save content" });
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (path: string, value: any) => {
    if (!content) return;
    const keys = path.split(".");
    const newContent = JSON.parse(JSON.stringify(content));
    let current = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setContent(newContent);
  };

  const updatePopupConfig = (key: keyof PopupConfig, value: any) => {
    if (!popupConfig) return;
    const newConfig = { ...popupConfig, [key]: value };
    setPopupConfig(newConfig);
    savePopupConfig({ [key]: value });
  };

  const handleResetPopup = () => {
    resetPopupSeen();
    setMessage({ type: "success", text: "Popup will show again on next page load!" });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4aa]"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load content. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <AdminDashboardSEO />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1a3a52]">🎛️ REPAYZ Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your website content easily</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#00d4aa] hover:bg-[#00b88a] text-white gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="container mx-auto px-4 mt-4">
          <Alert variant={message.type === "success" ? "default" : "destructive"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="border-l-4 border-l-[#00d4aa]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Hero Section
                </CardTitle>
                <CardDescription>Main landing page content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="heroTitle" className="text-sm font-semibold">
                    Hero Title
                  </Label>
                  <Input
                    id="heroTitle"
                    value={content.hero.title}
                    onChange={(e) => updateContent("hero.title", e.target.value)}
                    className="mt-2"
                    placeholder="Enter hero title"
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle" className="text-sm font-semibold">
                    Hero Subtitle
                  </Label>
                  <Input
                    id="heroSubtitle"
                    value={content.hero.subtitle}
                    onChange={(e) => updateContent("hero.subtitle", e.target.value)}
                    className="mt-2"
                    placeholder="Enter hero subtitle"
                  />
                </div>
                <div>
                  <Label htmlFor="heroDescription" className="text-sm font-semibold">
                    Hero Description
                  </Label>
                  <Textarea
                    id="heroDescription"
                    value={content.hero.description}
                    onChange={(e) => updateContent("hero.description", e.target.value)}
                    className="mt-2"
                    rows={3}
                    placeholder="Enter hero description"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo Section */}
            <Card className="border-l-4 border-l-[#00d4aa]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🖼️</span> Logo & Images
                </CardTitle>
                <CardDescription>Logo positioning and sizing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                  <p className="text-sm text-gray-600 mb-3">Current Logo Preview:</p>
                  {content.logo.url && (
                    <img
                      src={content.logo.url}
                      alt="Logo"
                      style={{
                        width: `${content.logo.width}px`,
                        height: `${content.logo.height}px`,
                        marginLeft: `${content.logo.offsetX}px`,
                        marginTop: `${content.logo.offsetY}px`,
                      }}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logoOffsetX" className="text-sm font-semibold">
                      X Position (px)
                    </Label>
                    <Input
                      id="logoOffsetX"
                      type="number"
                      value={content.logo.offsetX}
                      onChange={(e) => updateContent("logo.offsetX", parseInt(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logoOffsetY" className="text-sm font-semibold">
                      Y Position (px)
                    </Label>
                    <Input
                      id="logoOffsetY"
                      type="number"
                      value={content.logo.offsetY}
                      onChange={(e) => updateContent("logo.offsetY", parseInt(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logoWidth" className="text-sm font-semibold">
                      Width (px)
                    </Label>
                    <Input
                      id="logoWidth"
                      type="number"
                      value={content.logo.width}
                      onChange={(e) => updateContent("logo.width", parseInt(e.target.value) || 200)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logoHeight" className="text-sm font-semibold">
                      Height (px)
                    </Label>
                    <Input
                      id="logoHeight"
                      type="number"
                      value={content.logo.height}
                      onChange={(e) => updateContent("logo.height", parseInt(e.target.value) || 100)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Section */}
            <Card className="border-l-4 border-l-[#00d4aa]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⚙️</span> Settings
                </CardTitle>
                <CardDescription>Global site configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="whatsappNumber" className="text-sm font-semibold">
                    WhatsApp Number
                  </Label>
                  <Input
                    id="whatsappNumber"
                    value={content.settings.whatsappNumber}
                    onChange={(e) => updateContent("settings.whatsappNumber", e.target.value)}
                    className="mt-2"
                    placeholder="+31 6 12345678"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openingHoursStart" className="text-sm font-semibold">
                      Opening Hours Start
                    </Label>
                    <Input
                      id="openingHoursStart"
                      value={content.settings.openingHoursStart}
                      onChange={(e) => updateContent("settings.openingHoursStart", e.target.value)}
                      className="mt-2"
                      placeholder="10:00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="openingHoursEnd" className="text-sm font-semibold">
                      Opening Hours End
                    </Label>
                    <Input
                      id="openingHoursEnd"
                      value={content.settings.openingHoursEnd}
                      onChange={(e) => updateContent("settings.openingHoursEnd", e.target.value)}
                      className="mt-2"
                      placeholder="21:00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="locationCity" className="text-sm font-semibold">
                      City
                    </Label>
                    <Input
                      id="locationCity"
                      value={content.settings.locationCity}
                      onChange={(e) => updateContent("settings.locationCity", e.target.value)}
                      className="mt-2"
                      placeholder="Oisterwijk"
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationCountry" className="text-sm font-semibold">
                      Country
                    </Label>
                    <Input
                      id="locationCountry"
                      value={content.settings.locationCountry}
                      onChange={(e) => updateContent("settings.locationCountry", e.target.value)}
                      className="mt-2"
                      placeholder="Netherlands"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Machine Status Section */}
            <Card className="border-l-4 border-l-[#00d4aa]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span> Machine Status
                </CardTitle>
                <CardDescription>Real-time machine information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="machineStatus" className="text-sm font-semibold">
                    Status Message
                  </Label>
                  <Input
                    id="machineStatus"
                    value={content.machine.status}
                    onChange={(e) => updateContent("machine.status", e.target.value)}
                    className="mt-2"
                    placeholder="Operationeel"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bottlesCount" className="text-sm font-semibold">
                      Bottles Count
                    </Label>
                    <Input
                      id="bottlesCount"
                      type="number"
                      value={content.machine.bottlesCount}
                      onChange={(e) => updateContent("machine.bottlesCount", parseInt(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cansCount" className="text-sm font-semibold">
                      Cans Count
                    </Label>
                    <Input
                      id="cansCount"
                      type="number"
                      value={content.machine.cansCount}
                      onChange={(e) => updateContent("machine.cansCount", parseInt(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Welfare Section */}
            <Card className="border-l-4 border-l-[#00d4aa]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">❤️</span> Welfare
                </CardTitle>
                <CardDescription>Welfare messaging</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="welfareTitle" className="text-sm font-semibold">
                    Welfare Title
                  </Label>
                  <Input
                    id="welfareTitle"
                    value={content.welfare.title}
                    onChange={(e) => updateContent("welfare.title", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="welfareDescription" className="text-sm font-semibold">
                    Welfare Description
                  </Label>
                  <Textarea
                    id="welfareDescription"
                    value={content.welfare.description}
                    onChange={(e) => updateContent("welfare.description", e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="border-l-4 border-l-[#00d4aa]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">💳</span> Payment
                </CardTitle>
                <CardDescription>Payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paymentDescription" className="text-sm font-semibold">
                    Payment Description
                  </Label>
                  <Textarea
                    id="paymentDescription"
                    value={content.payment.description}
                    onChange={(e) => updateContent("payment.description", e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Popup Settings Section */}
            {popupConfig && (
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🚀</span> Welcome Popup
                  </CardTitle>
                  <CardDescription>Configure the welcome popup that appears to visitors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {popupConfig.enabled ? (
                        <Bell className="w-5 h-5 text-green-500" />
                      ) : (
                        <BellOff className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <Label className="text-sm font-semibold">Popup Enabled</Label>
                        <p className="text-xs text-gray-500">Show popup to new visitors</p>
                      </div>
                    </div>
                    <Switch
                      checked={popupConfig.enabled}
                      onCheckedChange={(checked) => updatePopupConfig('enabled', checked)}
                    />
                  </div>

                  {/* Delay Setting */}
                  <div>
                    <Label htmlFor="popupDelay" className="text-sm font-semibold">
                      Delay (milliseconds)
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">Time before popup appears (2000 = 2 seconds)</p>
                    <Input
                      id="popupDelay"
                      type="number"
                      value={popupConfig.delayMs}
                      onChange={(e) => updatePopupConfig('delayMs', parseInt(e.target.value) || 2000)}
                      className="mt-1"
                      min={0}
                      step={500}
                    />
                  </div>

                  {/* Title */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                      <Label htmlFor="popupEmoji" className="text-sm font-semibold">
                        Emoji
                      </Label>
                      <Input
                        id="popupEmoji"
                        value={popupConfig.emoji}
                        onChange={(e) => updatePopupConfig('emoji', e.target.value)}
                        className="mt-2 text-center text-2xl"
                        maxLength={4}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor="popupTitle" className="text-sm font-semibold">
                        Title
                      </Label>
                      <Input
                        id="popupTitle"
                        value={popupConfig.title}
                        onChange={(e) => updatePopupConfig('title', e.target.value)}
                        className="mt-2"
                        placeholder="Proefperiode Gestart!"
                      />
                    </div>
                  </div>

                  {/* Description 1 */}
                  <div>
                    <Label htmlFor="popupDesc1" className="text-sm font-semibold">
                      Description Line 1
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="popupDesc1"
                        value={popupConfig.description1}
                        onChange={(e) => updatePopupConfig('description1', e.target.value)}
                        placeholder="We draaien proef! Kom onze machine testen en breng je"
                      />
                    </div>
                    <Input
                      value={popupConfig.highlight1}
                      onChange={(e) => updatePopupConfig('highlight1', e.target.value)}
                      className="mt-2 border-[#4db8a8] bg-[#4db8a8]/10"
                      placeholder="zakken met statiegeld verpakkingen (highlighted)"
                    />
                  </div>

                  {/* Description 2 */}
                  <div>
                    <Label htmlFor="popupDesc2" className="text-sm font-semibold">
                      Description Line 2
                    </Label>
                    <Input
                      id="popupDesc2"
                      value={popupConfig.description2}
                      onChange={(e) => updatePopupConfig('description2', e.target.value)}
                      className="mt-2"
                      placeholder="Help ons verbeteren en test de"
                    />
                    <Input
                      value={popupConfig.highlight2}
                      onChange={(e) => updatePopupConfig('highlight2', e.target.value)}
                      className="mt-2 border-[#4db8a8] bg-[#4db8a8]/10"
                      placeholder="snelste statiegeld machine (highlighted)"
                    />
                  </div>

                  {/* Opening Hours */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="popupHoursLabel" className="text-sm font-semibold">
                        Hours Label
                      </Label>
                      <Input
                        id="popupHoursLabel"
                        value={popupConfig.openingHoursLabel}
                        onChange={(e) => updatePopupConfig('openingHoursLabel', e.target.value)}
                        className="mt-2"
                        placeholder="Openingstijden"
                      />
                    </div>
                    <div>
                      <Label htmlFor="popupHours" className="text-sm font-semibold">
                        Opening Hours
                      </Label>
                      <Input
                        id="popupHours"
                        value={popupConfig.openingHours}
                        onChange={(e) => updatePopupConfig('openingHours', e.target.value)}
                        className="mt-2"
                        placeholder="10:00 - 21:00"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="popupPrimaryBtn" className="text-sm font-semibold">
                        Primary Button Text
                      </Label>
                      <Input
                        id="popupPrimaryBtn"
                        value={popupConfig.primaryButtonText}
                        onChange={(e) => updatePopupConfig('primaryButtonText', e.target.value)}
                        className="mt-2"
                        placeholder="Kom Langs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="popupSecondaryBtn" className="text-sm font-semibold">
                        Secondary Button Text
                      </Label>
                      <Input
                        id="popupSecondaryBtn"
                        value={popupConfig.secondaryButtonText}
                        onChange={(e) => updatePopupConfig('secondaryButtonText', e.target.value)}
                        className="mt-2"
                        placeholder="Later"
                      />
                    </div>
                  </div>

                  {/* Primary Button Link */}
                  <div>
                    <Label htmlFor="popupPrimaryLink" className="text-sm font-semibold">
                      Primary Button Link
                    </Label>
                    <Input
                      id="popupPrimaryLink"
                      value={popupConfig.primaryButtonLink}
                      onChange={(e) => updatePopupConfig('primaryButtonLink', e.target.value)}
                      className="mt-2"
                      placeholder="/locatie"
                    />
                  </div>

                  {/* Show Once Per Day Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <Label className="text-sm font-semibold">Show Once Per Day</Label>
                      <p className="text-xs text-gray-500">Only show popup once per day per visitor</p>
                    </div>
                    <Switch
                      checked={popupConfig.showOncePerDay}
                      onCheckedChange={(checked) => updatePopupConfig('showOncePerDay', checked)}
                    />
                  </div>

                  {/* A/B Test Toggle */}
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3">
                      <FlaskConical className="w-5 h-5 text-purple-500" />
                      <div>
                        <Label className="text-sm font-semibold">A/B Test Enabled</Label>
                        <p className="text-xs text-gray-500">Test different popup texts to see which converts better</p>
                      </div>
                    </div>
                    <Switch
                      checked={popupConfig.abTestEnabled}
                      onCheckedChange={(checked) => updatePopupConfig('abTestEnabled', checked)}
                    />
                  </div>

                  {/* Reset Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleResetPopup}
                      className="flex-1 gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset Popup
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetAbTest();
                        setMessage({ type: 'success', text: 'A/B test assignment reset! You will be randomly assigned a new variant.' });
                        setTimeout(() => setMessage(null), 3000);
                      }}
                      className="flex-1 gap-2"
                    >
                      <FlaskConical className="w-4 h-4" />
                      Reset A/B Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* A/B Test Results Section */}
            <AbTestResultsCard />
          </div>

          {/* Preview Column */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📱 Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="bg-gray-50 p-4 rounded border">
                      <h3 className="font-bold text-[#1a3a52] mb-2">{content.hero.title}</h3>
                      <p className="text-[#00d4aa] font-semibold mb-2">{content.hero.subtitle}</p>
                      <p className="text-gray-600 text-xs mb-4">{content.hero.description}</p>
                      <div className="bg-white p-2 rounded border border-dashed">
                        <p className="text-xs text-gray-500">Logo: {content.logo.width}x{content.logo.height}px</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900">Settings</p>
                      <p className="text-xs text-blue-800 mt-1">📍 {content.settings.locationCity}, {content.settings.locationCountry}</p>
                      <p className="text-xs text-blue-800">⏰ {content.settings.openingHoursStart} - {content.settings.openingHoursEnd}</p>
                      <p className="text-xs text-blue-800">💬 {content.settings.whatsappNumber}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <p className="text-xs font-semibold text-green-900">Machine Status</p>
                      <p className="text-xs text-green-800 mt-1">Status: {content.machine.status}</p>
                      <p className="text-xs text-green-800">🍾 {content.machine.bottlesCount} | 🥫 {content.machine.cansCount}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

