// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { Trophy, Medal, TrendingUp, Share2 } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbsSchema } from "@/components/BreadcrumbsSchema";
import SessionStartCard from "@/components/SessionStartCard";

export default function Leaderboard() {
  // Get machine status for display
  const { data: machineData } = trpc.machine.getStatus.useQuery(
    { machineId: "090373" },
    { refetchInterval: 10000 } // Poll every 10 seconds for status display
  );

  // Get weekly leaderboard
  const { data: leaderboard } = trpc.drop.getLeaderboard.useQuery(
    { period: "week", limit: 10 },
    { refetchInterval: 10000 }
  );

  // Get all-time leaderboard
  const { data: allTimeLeaderboard } = trpc.drop.getLeaderboard.useQuery(
    { period: "alltime", limit: 10 },
    { refetchInterval: 10000 }
  );

  return (
    <>
      <SEOHead
        title={`Game On! Leaderboard - ${APP_TITLE}`}
        description="See who's leading the recycling game in Oisterwijk! Track your progress and compete with other recyclers."
        keywords="recycling leaderboard, game on, competition, Oisterwijk recycling, top recyclers"
        canonicalUrl="https://repayz.nl/leaderboard"
      />
      <BreadcrumbsSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Game On! Leaderboard", url: "/leaderboard" },
        ]}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Header />

        <main className="flex-1 container py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Trophy className="w-12 h-12 text-emerald-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Game On!
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Zie wie deze week het meest heeft gerecycled. Geen persoonlijke gegevens,
              alleen jouw gekozen naam en aantal inzendingen.
            </p>
          </div>

          {/* Session Start Card - Webhook-based flow */}
          <div className="mb-8">
            <SessionStartCard />
          </div>

          {/* Machine Status */}
          {machineData && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Totaal Gerecycled</p>
                    <p className="text-3xl font-bold text-emerald-600">{(machineData.allTimeTotal || machineData.todayTotal || 0).toLocaleString()} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Machine Status</p>
                    <p className={`text-lg font-semibold ${
                      machineData.status === "operational" ? "text-green-600" :
                      machineData.status === "error" ? "text-red-600" :
                      machineData.status === "door_open" ? "text-orange-600" :
                      machineData.status === "maintenance" ? "text-yellow-600" :
                      machineData.status === "full" ? "text-red-600" :
                      "text-gray-600"
                    }`}>
                      {machineData.status === "operational" ? "✅ Operationeel" :
                       machineData.status === "error" ? "❌ Storing" :
                       machineData.status === "door_open" ? "🚪 Deur Open" :
                       machineData.status === "maintenance" ? "🔧 Onderhoud" :
                       machineData.status === "full" ? "📦 Bin Vol" :
                       machineData.status === "offline" ? "⚫ Offline" :
                       "❓ Onbekend"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Share Button */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-300">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Deel je Recycling Score! 🌟
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Laat je vrienden zien hoeveel je recycled en daag ze uit!
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const shareText = `🏆 Check het REPAYZ leaderboard!\n\n♻️ Recycle statiegeld bij REPAYZ Oisterwijk en zie je naam op het leaderboard!\n\n🌐 Bekijk op: repayz.nl/leaderboard`;
                    const shareUrl = 'https://repayz.nl/leaderboard';
                    
                    if (navigator.share) {
                      navigator.share({
                        title: 'REPAYZ Leaderboard',
                        text: shareText,
                        url: shareUrl,
                      }).catch(() => {});
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                      alert('Link gekopieerd! Plak het in je social media post.');
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Deel Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboards - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                Top Recyclers Deze Week
              </CardTitle>
              <CardDescription>
                Gebaseerd op aantal gerecyclede items. Scooterpoint krijgt alle niet-geclaimde drops.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                // Demo data to show when no real data exists
                const demoData = [
                  { rank: 1, displayName: "JOHN", depositCount: 47 },
                  { rank: 2, displayName: "EMMA", depositCount: 38 },
                  { rank: 3, displayName: "ALEX", depositCount: 32 },
                  { rank: 4, displayName: "SARAH", depositCount: 28 },
                  { rank: 5, displayName: "MIKE", depositCount: 24 },
                  { rank: 6, displayName: "LISA", depositCount: 19 },
                  { rank: 7, displayName: "TOM", depositCount: 15 },
                  { rank: 8, displayName: "ANNA", depositCount: 12 },
                  { rank: 9, displayName: "PETER", depositCount: 9 },
                  { rank: 10, displayName: "JULIA", depositCount: 6 },
                ];

                // Use real data if available, otherwise show demo data
                const displayData = leaderboard && leaderboard.length > 0 ? leaderboard : demoData;

                return (
                <div className="space-y-3">
                  {displayData.map((entry, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-400"
                          : index === 1
                          ? "bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 border-2 border-slate-300"
                          : index === 2
                          ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-300"
                          : "bg-slate-50 dark:bg-slate-800/50"
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        {index === 0 ? (
                          <Trophy className="w-8 h-8 text-yellow-500" />
                        ) : index === 1 ? (
                          <Medal className="w-8 h-8 text-slate-400" />
                        ) : index === 2 ? (
                          <Medal className="w-8 h-8 text-orange-400" />
                        ) : (
                          <span className="text-2xl font-bold text-slate-400">#{entry.rank}</span>
                        )}
                      </div>

                      {/* Name */}
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-slate-900 dark:text-white">
                          {entry.displayName}
                        </p>
                      </div>

                      {/* Count */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">
                          {entry.depositCount}
                        </p>
                        <p className="text-sm text-slate-500">items</p>
                      </div>
                    </div>
                  ))}
                </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* All-Time Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                Top Recyclers All-Time
              </CardTitle>
              <CardDescription>
                Lifetime stats van alle recyclers. Wie is de ultieme recycling kampioen?
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                // Demo data for all-time with higher scores (0-100)
                const demoDataAllTime = [
                  { rank: 1, displayName: "JOHN", depositCount: 95 },
                  { rank: 2, displayName: "EMMA", depositCount: 87 },
                  { rank: 3, displayName: "ALEX", depositCount: 78 },
                  { rank: 4, displayName: "SARAH", depositCount: 69 },
                  { rank: 5, displayName: "MIKE", depositCount: 61 },
                  { rank: 6, displayName: "LISA", depositCount: 54 },
                  { rank: 7, displayName: "TOM", depositCount: 45 },
                  { rank: 8, displayName: "ANNA", depositCount: 38 },
                  { rank: 9, displayName: "PETER", depositCount: 29 },
                  { rank: 10, displayName: "JULIA", depositCount: 18 },
                ];

                // Use real data if available, otherwise show demo data
                const displayData = allTimeLeaderboard && allTimeLeaderboard.length > 0 ? allTimeLeaderboard : demoDataAllTime;

                return (
                <div className="space-y-3">
                  {displayData.map((entry, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-400"
                          : index === 1
                          ? "bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 border-2 border-slate-300"
                          : index === 2
                          ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-300"
                          : "bg-slate-50 dark:bg-slate-800/50"
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        {index === 0 ? (
                          <Trophy className="w-8 h-8 text-yellow-500" />
                        ) : index === 1 ? (
                          <Medal className="w-8 h-8 text-slate-400" />
                        ) : index === 2 ? (
                          <Medal className="w-8 h-8 text-orange-400" />
                        ) : (
                          <span className="text-2xl font-bold text-slate-400">#{entry.rank}</span>
                        )}
                      </div>

                      {/* Name */}
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-slate-900 dark:text-white">
                          {entry.displayName}
                        </p>
                      </div>

                      {/* Count */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">
                          {entry.depositCount}
                        </p>
                        <p className="text-sm text-slate-500">items</p>
                      </div>
                    </div>
                  ))}
                </div>
                );
              })()}
            </CardContent>
          </Card>
          </div>

          {/* How it works */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Hoe werkt het?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-600 dark:text-slate-300">
              <p>1. <strong>Drop je items</strong> in de machine</p>
              <p>2. <strong>Claim card toont je items</strong> - je hebt 60 seconden om te claimen</p>
              <p>3. <strong>Vul je naam in</strong> of sla over voor Scooterpoint</p>
              <p>4. <strong>Zie je score</strong> op het leaderboard!</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}
