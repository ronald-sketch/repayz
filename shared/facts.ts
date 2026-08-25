/**
 * REPAYZ bedrijfsfeiten — enige geldige bron.
 *
 * Bron van waarheid: SEO_DO_NOT_RECOMMEND.md v2.0.
 * Elke plek in client/ en server/ die een adres, openingstijd, tarief,
 * telefoonnummer of e-mailadres toont, leest hier uit. Nergens anders
 * hoort zo'n waarde letterlijk in de code te staan.
 *
 * Er is een test die dat bewaakt: server/facts.test.ts faalt zodra een
 * verboden variant ergens in client/src of server voorkomt.
 *
 * Scooterpoint zit op dezelfde locatie maar heeft eigen openingstijden.
 * Die staan hieronder apart, onder SCOOTERPOINT, en horen in de UI
 * altijd expliciet als Scooterpoint gelabeld te zijn.
 */

export const ADDRESS = {
  street: "Sprendlingenstraat 20",
  postalCode: "5061 KN",
  city: "Oisterwijk",
  country: "NL",
  countryName: "Nederland",
  /** "Sprendlingenstraat 20, 5061 KN Oisterwijk" */
  full: "Sprendlingenstraat 20, 5061 KN Oisterwijk",
  /** Voor gebruik in URL's (Google Maps) */
  urlEncoded: "Sprendlingenstraat+20,5061+KN+Oisterwijk",
} as const;

/**
 * Coördinaten: <TE BEVESTIGEN>. In de oude code stonden twee verschillende
 * paren met de notitie "Update with actual coordinates". Onderstaande waarde
 * is die van het schema dat daadwerkelijk werd gerenderd; niet geverifieerd
 * tegen de werkelijke standplaats van de machine.
 */
export const GEO = {
  latitude: 51.5783,
  longitude: 5.1889,
} as const;

export const OPENING_HOURS = {
  /** Zeven dagen per week hetzelfde. */
  openHour: 7,
  closeHour: 23,
  opens: "07:00",
  closes: "23:00",
  /** "07:00 - 23:00" */
  range: "07:00 - 23:00",
  /** "dagelijks 07:00 - 23:00" */
  daily: "dagelijks 07:00 - 23:00",
  /** Voor schema.org openingHours */
  schema: "Mo-Su 07:00-23:00",
  schemaDays: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
} as const;

export const DEPOSIT = {
  /** Kleine PET-flesjes, tot 1 liter */
  smallBottle: "€0,15",
  /** Grote PET-flessen, vanaf 1 liter */
  largeBottle: "€0,25",
  blik: "€0,15",
  smallBottleNumeric: "0.15",
  largeBottleNumeric: "0.25",
} as const;

export const PACKAGING = {
  accepted: "blikjes en PET-flesjes",
  /** Glas heeft wel statiegeld, maar de machine accepteert het niet. */
  rejected: "glas",
  glassNote:
    "Glazen flessen accepteren we niet — die hebben wel statiegeld, maar onze machine verwerkt alleen PET en blik.",
} as const;

export const PAYOUT = {
  method: "Tikkie",
  /** Aangekondigd als extra, nog niet live. */
  announced: "Statiegeld App",
  donate: "via de doneerknop op de machine",
} as const;

export const CONTACT = {
  email: "info@repayz.nl",
  /** Alleen WhatsApp. Zie telephone hieronder. */
  whatsapp: "31642346115",
  whatsappDisplay: "+31 6 42346115",
  /**
   * Publiek telefoonnummer voor schema.org: <TE BEVESTIGEN>.
   * Er is niet vastgesteld of het WhatsApp-nummer ook gebeld mag worden.
   * Zolang dit null is, wordt het telephone-veld uit de JSON-LD weggelaten —
   * beter geen nummer dan een plaatshouder.
   */
  telephone: null as string | null,
} as const;

export const MACHINE = {
  brand: "Envipco Quantum Bulk RVM",
  itemsPerMinute: 120,
  serial: "090373",
} as const;

export const WELFARE = {
  name: "Sociaal Huis Oisterwijk",
  url: "https://www.sociaalhuisoisterwijk.nl/",
} as const;

/**
 * Scooterpoint — zelfde locatie, ander bedrijf, eigen openingstijden.
 * Deze waarden mogen NOOIT als REPAYZ-openingstijden worden getoond.
 */
export const SCOOTERPOINT = {
  name: "Scooterpoint",
  url: "https://scooter-point.com/",
  /** scooterpoint openingstijden */
  daysLabel: "Dinsdag - Zaterdag",
  daysLabelShort: "Di-Za",
  closedLabel: "Maandag & Zondag",
  opens: "10:00",
  closes: "18:00",
  range: "10:00 - 18:00",
  telephone: "0031 6 10122112",
} as const;

export const FACTS = {
  ADDRESS,
  GEO,
  OPENING_HOURS,
  DEPOSIT,
  PACKAGING,
  PAYOUT,
  CONTACT,
  MACHINE,
  WELFARE,
  SCOOTERPOINT,
} as const;

export default FACTS;
