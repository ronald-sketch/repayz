// @ts-nocheck
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WallyChat from "@/components/WallyChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle,
  ArrowRight,
  Recycle,
  Smartphone,
  QrCode
} from "lucide-react";

export default function VintedGo() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary/10 to-blue-600/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Package className="w-4 h-4" />
              <span>24/7 Beschikbaar</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Vinted Go Locker
            </h1>
            <p className="text-lg text-muted-foreground">
              Combineer je statiegeld inleveren met het ophalen of versturen van je Vinted pakketjes!
            </p>
          </div>
        </div>
      </section>

      {/* What is Vinted Go */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Wat is Vinted Go?
              </h2>
              <p className="text-muted-foreground mb-6">
                Vinted Go is de bezorg- en verzendservice van Vinted. Met onze pakketlocker 
                bij REPAYZ kun je 24 uur per dag, 7 dagen per week je pakketjes ophalen 
                of versturen - ook buiten onze reguliere openingstijden!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">24/7 toegankelijk</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">Gratis parkeren</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">Combineer met statiegeld inleveren</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">Veilig en beschermd</span>
                </li>
              </ul>
            </div>
            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="p-8 flex items-center justify-center">
                <Package className="w-32 h-32 text-primary" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Hoe werkt het?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Ophalen */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary" />
                  Pakket Ophalen
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Kies REPAYZ als ophaallocatie</p>
                      <p className="text-sm text-muted-foreground">Bij het afrekenen in de Vinted app</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Ontvang een code</p>
                      <p className="text-sm text-muted-foreground">Via de Vinted app wanneer je pakket er is</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Scan de QR code</p>
                      <p className="text-sm text-muted-foreground">Bij de locker en haal je pakket op</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Versturen */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-primary" />
                  Pakket Versturen
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Verkoop je item op Vinted</p>
                      <p className="text-sm text-muted-foreground">En kies Vinted Go als verzendoptie</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Genereer je verzendlabel</p>
                      <p className="text-sm text-muted-foreground">In de Vinted app</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Breng je pakket naar de locker</p>
                      <p className="text-sm text-muted-foreground">Scan de code en plaats je pakket</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Voordelen
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">24/7 Toegang</h3>
                <p className="text-sm text-muted-foreground">
                  Altijd beschikbaar, ook 's nachts en in het weekend
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Gratis Parkeren</h3>
                <p className="text-sm text-muted-foreground">
                  Parkeer direct bij de locker
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Recycle className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Combineer</h3>
                <p className="text-sm text-muted-foreground">
                  Lever ook je statiegeld in tijdens je bezoek
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Snel & Makkelijk</h3>
                <p className="text-sm text-muted-foreground">
                  Scan je code en je bent klaar
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-blue-600/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Bezoek onze locatie
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Combineer je Vinted pakketjes met statiegeld inleveren. 
            Twee vliegen in één klap!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/locatie">
              <Button size="lg" className="gap-2">
                <MapPin className="w-5 h-5" />
                Bekijk Locatie
              </Button>
            </Link>
            <a href="https://www.vinted.nl" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                Naar Vinted
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WallyChat />
    </div>
  );
}
