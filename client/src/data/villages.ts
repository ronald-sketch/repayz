import { ADDRESS } from "@shared/facts";

export interface VillageData {
  name: string;
  slug: string;
  distance: string;
  driveTime: string;
  directions: string;
  mapEmbedUrl: string;
}

export const villages: VillageData[] = [
  {
    name: "Udenhout",
    slug: "statiegeld-udenhout",
    distance: "5 km",
    driveTime: "8 minuten",
    directions: "Vanaf Udenhout centrum: Neem de Lieshoutseweg richting Oisterwijk. Sla rechtsaf de N65 op richting Tilburg/Oisterwijk. Neem afslag Oisterwijk-Centrum. Volg de borden naar het centrum, REPAYZ bevindt zich aan de Sprendlingenstraat 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Udenhout&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Moergestel",
    slug: "statiegeld-moergestel",
    distance: "7 km",
    driveTime: "10 minuten",
    directions: "Vanaf Moergestel centrum: Neem de Oisterwijkseweg (N269) richting Oisterwijk. Rijd rechtdoor het dorp in. Bij het centrum rechtsaf de Molenstraat in. REPAYZ bevindt zich aan nummer 1.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Moergestel&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Biezenmortel",
    slug: "statiegeld-biezenmortel",
    distance: "5.7 km",
    driveTime: "9 minuten",
    directions: "Vanaf Biezenmortel centrum: Neem de Oisterwijksebaan richting Oisterwijk. Volg deze weg rechtdoor tot je in Oisterwijk centrum aankomt. REPAYZ ligt aan de Sprendlingenstraat 20, nabij het centrum.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Biezenmortel&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Berkel-Enschot",
    slug: "statiegeld-berkel-enschot",
    distance: "8 km",
    driveTime: "12 minuten",
    directions: "Vanaf Berkel-Enschot: Neem de Oisterwijkseweg richting Oisterwijk. Volg de N65 richting Oisterwijk-Centrum. Neem de afslag naar het centrum. REPAYZ bevindt zich aan de Sprendlingenstraat 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Berkel-Enschot&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Haaren",
    slug: "statiegeld-haaren",
    distance: "9 km",
    driveTime: "13 minuten",
    directions: "Vanaf Haaren centrum: Neem de Oisterwijkseweg (N65) richting Oisterwijk. Volg de borden naar Oisterwijk-Centrum. Bij het centrum aangekomen, volg de bewegwijzering naar de Molenstraat. REPAYZ ligt op nummer 1.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Haaren&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Helvoirt",
    slug: "statiegeld-helvoirt",
    distance: "6 km",
    driveTime: "10 minuten",
    directions: "Vanaf Helvoirt: Neem de Bosscheweg richting Oisterwijk. Volg de N65 en neem de afslag Oisterwijk-Centrum. Rijd het centrum in en volg de borden naar de Molenstraat. REPAYZ bevindt zich op nummer 1.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Helvoirt&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Boxtel",
    slug: "statiegeld-boxtel",
    distance: "10 km",
    driveTime: "15 minuten",
    directions: "Vanaf Boxtel centrum: Neem de N65 richting Tilburg/Oisterwijk. Volg de weg en neem afslag Oisterwijk-Centrum. Rijd het centrum in via de Gemullehoekenweg. REPAYZ ligt aan de Sprendlingenstraat 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Boxtel&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Tilburg",
    slug: "statiegeld-tilburg",
    distance: "6.8 km",
    driveTime: "12 minuten",
    directions: "Vanaf Tilburg centrum: Neem de Ringbaan Oost richting Oisterwijk. Volg de N65 richting Oisterwijk. Neem afslag Oisterwijk-Centrum. Volg de borden naar het centrum, REPAYZ bevindt zich aan de Sprendlingenstraat 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Tilburg&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Loon op Zand",
    slug: "statiegeld-loon-op-zand",
    distance: "12 km",
    driveTime: "16 minuten",
    directions: "Vanaf Loon op Zand: Neem de N261 richting Waalwijk, dan de N261 richting Tilburg. Volg de N65 richting Oisterwijk. Neem afslag Oisterwijk-Centrum. REPAYZ ligt aan de Sprendlingenstraat 20 in het centrum.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Loon+op+Zand&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Hilvarenbeek",
    slug: "statiegeld-hilvarenbeek",
    distance: "14 km",
    driveTime: "18 minuten",
    directions: "Vanaf Hilvarenbeek: Neem de Vrijhoeve Capucijnenstraat richting N269. Volg de N269 richting Oisterwijk. Bij Oisterwijk aangekomen, volg de borden naar het centrum. REPAYZ bevindt zich aan de Sprendlingenstraat 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Hilvarenbeek&destination=${ADDRESS.urlEncoded}&mode=driving`
  }
];
