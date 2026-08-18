import { ADDRESS } from "@shared/facts";

export interface VintedVillageData {
  name: string;
  slug: string;
  distance: string;
  driveTime: string;
  directions: string;
  mapEmbedUrl: string;
}

export const vintedVillages: VintedVillageData[] = [
  {
    name: "Oisterwijk",
    slug: "vinted-locker-oisterwijk",
    distance: "0 km",
    driveTime: "0 minuten",
    directions: "De Vinted Go Locker bevindt zich in het centrum van Oisterwijk aan de Sprendlingenstraat 20, bij REPAYZ. Gratis parkeren direct naast de locker.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${ADDRESS.urlEncoded}&zoom=15`
  },
  {
    name: "Udenhout",
    slug: "vinted-locker-udenhout",
    distance: "5 km",
    driveTime: "8 minuten",
    directions: "Vanaf Udenhout centrum: Neem de Lieshoutseweg richting Oisterwijk. Sla rechtsaf de N65 op richting Tilburg/Oisterwijk. Neem afslag Oisterwijk-Centrum. Volg de borden naar het centrum, de Vinted Go Locker bevindt zich aan de Sprendlingenstraat 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Udenhout&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Moergestel",
    slug: "vinted-locker-moergestel",
    distance: "7 km",
    driveTime: "10 minuten",
    directions: "Vanaf Moergestel centrum: Neem de Oisterwijkseweg (N269) richting Oisterwijk. Rijd rechtdoor het dorp in. Bij het centrum aangekomen, volg de bewegwijzering naar de Sprendlingenstraat. De Vinted Go Locker bevindt zich op nummer 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Moergestel&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Biezenmortel",
    slug: "vinted-locker-biezenmortel",
    distance: "5.7 km",
    driveTime: "9 minuten",
    directions: "Vanaf Biezenmortel centrum: Neem de Oisterwijksebaan richting Oisterwijk. Volg deze weg rechtdoor tot je in Oisterwijk centrum aankomt. De Vinted Go Locker ligt aan de Sprendlingenstraat 20, nabij het centrum.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Biezenmortel&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Berkel-Enschot",
    slug: "vinted-locker-berkel-enschot",
    distance: "8 km",
    driveTime: "12 minuten",
    directions: "Vanaf Berkel-Enschot: Neem de Oisterwijkseweg richting Oisterwijk. Volg de N65 richting Oisterwijk-Centrum. Neem de afslag naar het centrum. De Vinted Go Locker bevindt zich aan de Sprendlingenstraat 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Berkel-Enschot&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Haaren",
    slug: "vinted-locker-haaren",
    distance: "9 km",
    driveTime: "13 minuten",
    directions: "Vanaf Haaren centrum: Neem de Oisterwijkseweg (N65) richting Oisterwijk. Volg de borden naar Oisterwijk-Centrum. Bij het centrum aangekomen, volg de bewegwijzering naar de Sprendlingenstraat. De Vinted Go Locker ligt op nummer 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Haaren&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Helvoirt",
    slug: "vinted-locker-helvoirt",
    distance: "6 km",
    driveTime: "10 minuten",
    directions: "Vanaf Helvoirt: Neem de Bosscheweg richting Oisterwijk. Volg de N65 en neem de afslag Oisterwijk-Centrum. Rijd het centrum in en volg de borden naar de Sprendlingenstraat. De Vinted Go Locker bevindt zich op nummer 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Helvoirt&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Boxtel",
    slug: "vinted-locker-boxtel",
    distance: "10 km",
    driveTime: "15 minuten",
    directions: "Vanaf Boxtel centrum: Neem de N65 richting Tilburg/Oisterwijk. Volg de weg en neem afslag Oisterwijk-Centrum. Rijd het centrum in via de Gemullehoekenweg. De Vinted Go Locker ligt aan de Sprendlingenstraat 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Boxtel&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Tilburg",
    slug: "vinted-locker-tilburg",
    distance: "6.8 km",
    driveTime: "12 minuten",
    directions: "Vanaf Tilburg centrum: Neem de Ringbaan Oost richting Oisterwijk. Volg de N65 richting Oisterwijk. Neem afslag Oisterwijk-Centrum. Volg de borden naar het centrum, de Vinted Go Locker bevindt zich aan de Sprendlingenstraat 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Tilburg&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Loon op Zand",
    slug: "vinted-locker-loon-op-zand",
    distance: "12 km",
    driveTime: "16 minuten",
    directions: "Vanaf Loon op Zand: Neem de N261 richting Waalwijk, dan de N261 richting Tilburg. Volg de N65 richting Oisterwijk. Neem afslag Oisterwijk-Centrum. De Vinted Go Locker ligt aan de Sprendlingenstraat 20 in het centrum.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Loon+op+Zand&destination=${ADDRESS.urlEncoded}&mode=driving`
  },
  {
    name: "Hilvarenbeek",
    slug: "vinted-locker-hilvarenbeek",
    distance: "14 km",
    driveTime: "18 minuten",
    directions: "Vanaf Hilvarenbeek: Neem de Vrijhoeve Capucijnenstraat richting N269. Volg de N269 richting Oisterwijk. Bij Oisterwijk aangekomen, volg de borden naar het centrum. De Vinted Go Locker bevindt zich aan de Sprendlingenstraat 20.",
    mapEmbedUrl: `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=Hilvarenbeek&destination=${ADDRESS.urlEncoded}&mode=driving`
  }
];
