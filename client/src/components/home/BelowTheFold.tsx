// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Heart, TrendingUp, Leaf, Mail, ArrowRight, AlertCircle, CheckCircle, MessageCircle, Package, Trophy, Medal, Download, Smartphone, Chrome, Apple } from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import { useOpeningHours } from "@/hooks/useOpeningHours";
import { OPENING_HOURS, SCOOTERPOINT } from "@shared/facts";

interface BelowTheFoldProps {
  totalCollected: number;
  machineStatus: any;
  isOperational: boolean;
  whatsappUrl: string;
  welfarePartners: any;
  showAppSection: boolean;
  setShowAppSection: (show: boolean) => void;
}

export default function BelowTheFold({
  totalCollected,
  machineStatus,
  isOperational,
  whatsappUrl,
  welfarePartners,
  showAppSection,
  setShowAppSection
}: BelowTheFoldProps) {
  const openingHours = useOpeningHours();
  
  return (
    <>
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-10 h-10 text-[#4db8a8]" />
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] dark:text-white">Game On!</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Zie wie deze week het meest heeft gerecycled</p>
          </div>
          
          <Card className="border-2 border-[#4db8a8] bg-gradient-to-br from-[#4db8a8]/5 to-transparent dark:bg-[#1a2f3f]">
            <CardContent className="p-8">
              <div className="space-y-4">
                {/* Top 3 Podium Style */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* 2nd Place */}
                  <div className="text-center pt-8">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mb-2">
                      <Medal className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                      <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">2</p>
                    </div>
                    <p className="font-semibold text-[#1a3a52] dark:text-white">EMMA</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">42 items</p>
                  </div>
                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-[#4db8a8] to-[#1a3a52] rounded-lg p-6 mb-2">
                      <Trophy className="w-12 h-12 mx-auto text-white mb-2" />
                      <p className="text-3xl font-bold text-white">1</p>
                    </div>
                    <p className="font-bold text-[#1a3a52] dark:text-white text-lg">JOHN</p>
                    <p className="text-sm text-[#4db8a8] font-semibold">47 items</p>
                  </div>
                  {/* 3rd Place */}
                  <div className="text-center pt-12">
                    <div className="bg-orange-100 rounded-lg p-4 mb-2">
                      <Medal className="w-8 h-8 mx-auto text-orange-400 mb-2" />
                      <p className="text-2xl font-bold text-orange-600">3</p>
                    </div>
                    <p className="font-semibold text-[#1a3a52] dark:text-white">ALEX</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">38 items</p>
                  </div>
                </div>
                
                <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button asChild size="lg" className="bg-[#1a3a52] hover:bg-[#0d1f2d]">
                    <a href="/leaderboard">Bekijk Volledig Klassement</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-gray-50 dark:bg-[#1a3a52] border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] dark:text-white mb-4 text-center">
            Hoe REPAYZ Werkt
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            <Link href="/hoe-het-werkt">
              <span className="text-[#4db8a8] hover:text-[#3da090] font-semibold inline-flex items-center gap-2 cursor-pointer">
                Bekijk de volledige uitleg
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Recycle */}
            <div className="text-center">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <img src="/repayz-recycling-icon-optimized.webp" alt="REPAYZ Statiegeld Recycling - Flessen en Blikjes Inleveren" className="w-full h-full object-contain" width="140" height="140" />
              </div>
              <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Recycle</h3>
              <p className="text-gray-600 dark:text-gray-300">Breng je lege <strong>grote en kleine plastic flessen (PET) en blikjes met statiegeld logo</strong> naar onze machine. Je kan ze zo uit de zak storten, we tellen ze allemaal!</p>
            </div>

            {/* Get Payed */}
            <div className="text-center">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <img src="/repayz-geld-verdienen-icon-optimized.webp" alt="REPAYZ Geld Verdienen - Statiegeld Uitbetaling via Tikkie" className="w-full h-full object-contain" width="140" height="140" />
              </div>
              <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Get Payed</h3>
              <p className="text-gray-600 dark:text-gray-300">Laat het statiegeld op je rekening storten of steun Stichting sociaal Huis Oisterwijk</p>
            </div>

            {/* Zero Waste */}
            <div className="text-center">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <img src="/repayz-duurzaam-leaf-icon-optimized.webp" alt="REPAYZ Duurzaam Recyclen - Zero Waste Milieu Initiatief" className="w-full h-full object-contain" width="140" height="140" />
              </div>
              <h3 className="text-xl font-bold text-[#1a3a52] dark:text-white mb-3">Zero Waste</h3>
              <p className="text-gray-600 dark:text-gray-300">Draag bij aan een schoner milieu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Machine Status & Real-time Counter */}
      <section id="machine-status" className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] dark:text-white mb-12 text-center">
            Live Machine Status
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Counter Card - Today & All-Time */}
            <Card className="border-2 border-[#4db8a8] bg-gradient-to-br from-[#4db8a8]/10 to-transparent dark:bg-[#1a2f3f]">
              <CardHeader>
                <CardTitle className="text-[#1a3a52] dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#4db8a8]" />
                  Recycling Statistieken
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Today's count */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vandaag</p>
                  <div className="text-3xl md:text-4xl font-bold text-[#4db8a8]">
                    {(machineStatus?.todayTotal || 0).toLocaleString('nl-NL')}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {machineStatus?.todayBottles || 0} flessen · {machineStatus?.todayCans || 0} blikjes
                  </p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Totaal (All-Time)</p>
                  <div className="text-4xl md:text-5xl font-bold text-[#1a3a52] dark:text-white">
                    {totalCollected.toLocaleString('nl-NL')}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {(machineStatus?.allTimeBottles || 2504).toLocaleString('nl-NL')} PET flessen · {(machineStatus?.allTimeCans || 7519).toLocaleString('nl-NL')} blikjes
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Laatst bijgewerkt: {machineStatus?.lastUpdated ? new Date(machineStatus.lastUpdated).toLocaleTimeString('nl-NL') : 'Laden...'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Machine Status Card */}
            <Card className={`border-2 ${
              !machineStatus || machineStatus.status === 'coming-soon'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : isOperational 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                  : 'border-red-500 bg-red-50 dark:bg-red-900/30'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1a3a52] dark:text-white">
                  {!machineStatus || machineStatus.status === 'coming-soon' ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : isOperational ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  Machine Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className={`text-2xl font-bold ${
                    !machineStatus || machineStatus.status === 'coming-soon'
                      ? 'text-blue-600'
                      : isOperational 
                        ? 'text-green-600' 
                        : 'text-red-600'
                  }`}>
                    {!machineStatus || machineStatus.status === 'coming-soon'
                      ? 'Binnenkort Beschikbaar'
                      : isOperational 
                        ? 'Operationeel' 
                        : 'Onderhoud'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    {!machineStatus || machineStatus.status === 'coming-soon'
                      ? 'De machine wordt binnenkort geïnstalleerd'
                      : isOperational 
                        ? 'De machine is beschikbaar voor gebruik' 
                        : 'De machine is momenteel niet beschikbaar'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Flessen in bak</p>
                    <p className="text-lg font-bold text-[#1a3a52] dark:text-white">{machineStatus?.binBottles || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Blikjes in bak</p>
                    <p className="text-lg font-bold text-[#1a3a52] dark:text-white">{machineStatus?.binCans || 0}</p>
                  </div>
                </div>
                {/* Opening hours indicator */}
                <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-xl font-bold ${
                  openingHours.isClosingSoon ? 'text-red-500 animate-pulse' : openingHours.isOpen ? 'text-green-600' : 'text-gray-500'
                }`}>
                  <Clock className="w-6 h-6" />
                  {openingHours.statusText}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-[#1a3a52] dark:text-white text-center mb-6">Hulp Nodig?</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* WhatsApp Option */}
              <Card className="border-2 border-green-500 dark:bg-[#1a2f3f]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1a3a52] dark:text-white">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    WhatsApp Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Stuur ons een bericht via WhatsApp voor snelle hulp met de REPAYZ machine.
                  </p>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="bg-green-500 hover:bg-green-600 text-white w-full flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Stuur WhatsApp Bericht
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Store Visit Option */}
              <Card className="border-2 border-[#4db8a8] dark:bg-[#1a2f3f]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1a3a52] dark:text-white">
                    <MapPin className="w-5 h-5 text-[#4db8a8]" />
                    Bezoek <a href="https://scooter-point.com/" target="_blank" rel="noopener noreferrer" className="text-[#4db8a8] hover:underline">Scooterpoint</a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Loop naar binnen bij <a href="https://scooter-point.com/" target="_blank" rel="noopener noreferrer" className="text-[#4db8a8] hover:underline">Scooterpoint</a> en vraag om assistentie tijdens openingstijden.
                  </p>
                  <div className="bg-gray-50 dark:bg-[#1a3a52] p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Openingstijden</p>
                    <p className="text-sm font-semibold text-[#1a3a52] dark:text-white">{SCOOTERPOINT.daysLabelShort}: {SCOOTERPOINT.range}</p>
                    <p className="text-sm font-semibold text-[#1a3a52] dark:text-white">Ma &amp; Zo: Gesloten</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Vinted Go Locker */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-y border-purple-100 dark:border-purple-800">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center gap-3 mb-8">
            <Package className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a52] dark:text-white">Vinted Go Locker bij REPAYZ</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#1a3a52] dark:text-white mb-4">
                Geef Je Kleding Een Tweede Leven
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Op dezelfde locatie als onze REPAYZ machine vind je ook een Vinted Go locker. Verkoop je tweedehands kleding eenvoudig via Vinted en gebruik de locker voor het versturen en ontvangen van pakketten.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
                  <div>
                    <p className="font-semibold text-[#1a3a52] dark:text-white">Openingstijden</p>
                    <p className="text-gray-600 dark:text-gray-300">Dagelijks van {OPENING_HOURS.opens} tot {OPENING_HOURS.closes}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
                  <div>
                    <p className="font-semibold text-[#1a3a52] dark:text-white">Locatie</p>
                    <p className="text-gray-600 dark:text-gray-300">Zelfde adres als REPAYZ machine</p>
                  </div>
                </div>
              </div>
              <Link href="/vinted">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Meer over Vinted Go →
                </Button>
              </Link>
            </div>
            <Card className="border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-[#1a3a52]/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-[#1a3a52] dark:text-white">Waarom Vinted Go?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-300 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a3a52] dark:text-white">Verkoop Gemakkelijk</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Plaats je kleding op Vinted en verkoop aan miljoenen gebruikers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-300 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a3a52] dark:text-white">Verstuur & Ontvang</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Gebruik de locker 24/7 voor het versturen en ophalen van pakketten</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-300 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a3a52] dark:text-white">Duurzaam & Lokaal</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Draag bij aan een circulaire economie en verminder afval</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Binnenkort in Oisterwijk */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a3a52] dark:text-white mb-6">
            Binnenkort in Oisterwijk
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            REPAYZ komt eraan! Houd de website en socials in de gaten voor meer updates en de lancering.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8">
            <a 
              href="https://www.instagram.com/repayz.nl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-semibold transition-all hover:scale-105"
              aria-label="Volg REPAYZ op Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Volg ons op Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Welfare Partners - Teaser */}
      <section className="bg-gray-50 dark:bg-[#1a3a52] border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-16">
            <Heart className="w-8 h-8 text-[#4db8a8]" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] dark:text-white">We Steunen Lokaal Welzijn</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Local Support Teaser 1 */}
            <Card className="border-gray-200 dark:border-gray-700 hover:border-[#4db8a8] hover:shadow-lg transition-all bg-gradient-to-br from-[#4db8a8]/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <a href="https://www.sociaalhuisoisterwijk.nl/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                    <img src="/sociaal-huis-logo-small.webp" alt="Sociaal Huis Oisterwijk - Lokaal Goed Doel Partner van REPAYZ" className="w-16 h-16 object-contain hover:opacity-80 transition-opacity cursor-pointer" width="64" height="64" loading="lazy" />
                  </a>
                  <CardTitle className="text-[#1a3a52] dark:text-white">Sociaal Huis Oisterwijk</CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300">Hulp en ondersteuning voor iedereen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Doneer je opbrengsten - het gaat 100% naar Stichting Sociaal Huis Oisterwijk. Een stichting die hulp biedt aan inwoners met armoede, sociale uitsluiting of praktische problemen.
                </p>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a href="https://www.sociaalhuisoisterwijk.nl/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#4db8a8] hover:text-[#3a9688] font-semibold flex items-center gap-1">
                    Meer over Sociaal Huis Oisterwijk →
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Local Support Teaser 2 */}
            <Card className="border-gray-200 dark:border-gray-700 hover:border-[#4db8a8] hover:shadow-lg transition-all bg-gradient-to-br from-[#1a3a52]/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-[#1a3a52] dark:text-white">Maatschappelijke Impact</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Samen bouwen aan een schonere leefomgeving</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Door te recyclen bij REPAYZ draag je bij aan een schoner milieu, kun je financiële begeleiding, voedselpakketten, administratieve ondersteuning en sociale activiteiten voor kwetsbare inwoners steunen of  ontvang 100% van je statiegeld terug als cash
                </p>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-[#4db8a8] font-semibold">Jouw recycling maakt écht verschil</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Options Section */}
      <section className="bg-gradient-to-br from-[#4db8a8]/10 to-[#1a3a52]/10 border-y border-[#4db8a8]/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] dark:text-white mb-12 text-center">
            Hoe Je Betaald Krijgt
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Tikkie Payment */}
              <Card className="border-2 border-[#4db8a8] dark:border-[#4db8a8] bg-white dark:bg-[#1a3a52] hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-[#1a3a52] dark:text-white flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#4db8a8]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                    Tikkie App
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Ontvang je verdiensten direct op je bankrekening via de Tikkie app.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4db8a8] font-bold mt-1">✓</span>
                      <span>Kies Tikkie aan de machine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4db8a8] font-bold mt-1">✓</span>
                      <span>Ontvang geld direct</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4db8a8] font-bold mt-1">✓</span>
                      <span>Geen verborgen kosten</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Donate Option */}
              <Card className="border-2 border-[#1a3a52] dark:border-[#4db8a8] bg-white dark:bg-[#1a3a52] hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-[#1a3a52] dark:text-white flex items-center gap-2">
                    <Heart className="w-6 h-6 text-[#1a3a52] dark:text-white" />
                    Doneer aan Welzijn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Kies ervoor om je verdiensten te doneren aan lokale welzijnsorganisaties.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-[#1a3a52] dark:text-white font-bold mt-1">✓</span>
                      <span>Steun lokale initiatieven</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1a3a52] dark:text-white font-bold mt-1">✓</span>
                      <span>Maak verschil in je dorp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1a3a52] dark:text-white font-bold mt-1">✓</span>
                      <span>Duurzaam impact</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                <span className="font-semibold text-[#1a3a52] dark:text-white">Je kiest aan de machine:</span> Selecteer je voorkeur (Tikkie of Donatie) op het scherm van de REPAYZ machine en voltooi je transactie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Options Section */}
      {/* Impact Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] dark:text-white mb-16 text-center">
          De Impact van Recyclen
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-gray-200 dark:border-gray-700 bg-gradient-to-br from-[#4db8a8]/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-[#1a3a52] dark:text-white text-lg">Milieu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#4db8a8] mb-2">100%</p>
              <p className="text-gray-600 dark:text-gray-300">Hergebruikt materiaal</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700 bg-gradient-to-br from-[#1a3a52]/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-[#1a3a52] dark:text-white text-lg">Gemeenschap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#4db8a8] mb-2">100%</p>
              <p className="text-gray-600 dark:text-gray-300">Lokale partners ondersteund</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700 bg-gradient-to-br from-[#4db8a8]/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-[#1a3a52] dark:text-white text-lg">Jouw Voordeel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#4db8a8] mb-2">100%</p>
              <p className="text-gray-600 dark:text-gray-300">Verdienen terwijl je recycled</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Download de App Section */}
      {showAppSection && (
      <section id="download-app" className="bg-gradient-to-br from-[#4db8a8]/10 to-[#1a3a52]/5 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] dark:text-white mb-4">
                📱 Download de REPAYZ App
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Installeer REPAYZ als app op je telefoon voor de beste ervaring - volledig scherm, sneller laden en offline toegang!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Android Instructions */}
              <Card className="border-2 border-[#4db8a8] dark:border-[#4db8a8] bg-white dark:bg-[#1a3a52] hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z"/>
                      </svg>
                    </div>
                    <CardTitle className="text-[#1a3a52] dark:text-white">Android (Chrome)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-gray-700 dark:text-gray-200">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4db8a8] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <span>Open <strong>repayz.nl</strong> in Chrome browser</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4db8a8] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <span>Tik op het <strong>menu (⋮)</strong> rechtsboven</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4db8a8] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <span>Selecteer <strong>"Add to Home screen"</strong> of <strong>"Installeren"</strong></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4db8a8] text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <span>Bevestig en klaar! Het REPAYZ icoon verschijnt op je homescreen</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* iOS Instructions */}
              <Card className="border-2 border-[#4db8a8] dark:border-[#4db8a8] bg-white dark:bg-[#1a3a52] hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                    </div>
                    <CardTitle className="text-[#1a3a52] dark:text-white">iOS (Safari)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-gray-700 dark:text-gray-200">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4db8a8] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <span>Open <strong>repayz.nl</strong> in Safari browser</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4db8a8] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <span>Tik op het <strong>Deel-icoon</strong> (vierkant met pijl omhoog) onderaan</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4db8a8] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <span>Scroll naar beneden en selecteer <strong>"Add to Home Screen"</strong></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#4db8a8] text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <span>Tik op <strong>"Add"</strong> rechtsboven - klaar!</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Benefits */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#4db8a8]" />
                  <span>Volledig scherm</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#4db8a8]" />
                  <span>Sneller laden</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#4db8a8]" />
                  <span>Offline toegang</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#4db8a8]" />
                  <span>Native app ervaring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#1a3a52] to-[#2a5a72] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Klaar voor Verandering?</h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Sluit je aan bij de REPAYZ-gemeenschap en maak een verschil voor jouw stad.
          </p>
          <Button 
            size="lg" 
            className="bg-[#4db8a8] hover:bg-[#3d9a8f] text-[#1a3a52] dark:text-white font-semibold"
            onClick={() => {
              setShowAppSection(true);
              setTimeout(() => {
                document.getElementById('download-app')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Download de App
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
