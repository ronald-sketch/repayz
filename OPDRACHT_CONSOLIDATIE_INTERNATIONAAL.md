# Werkopdracht — internationale pagina's samenvoegen

**Voor:** de bouwer van repayz.nl
**Van:** Ronald
**Datum:** 19 augustus 2026
**Omvang:** 20 URL's samenvoegen tot 5. Raakt niets buiten de internationale set.

---

## Waarom

De sitemap telt 103 URL's. Daarvan zijn er 24 internationaal, en die set heeft drie
problemen die uit de sitemap alleen al aan te tonen zijn.

**Dubbele URL's voor dezelfde inhoud.** `/en` en `/en-oisterwijk` bestaan allebei. `/pl` en
`/pl-oisterwijk` ook. Dat is letterlijke duplicatie: twee adressen, één pagina.

**Een asymmetrisch patroon.** Engels en Pools hebben een kale wortel (`/en`, `/pl`), maar
Roemeens, Bulgaars en Oekraïens niet — die bestaan alleen als `/ro-oisterwijk`,
`/bg-oisterwijk`, `/ua-oisterwijk`.

**Vijftien stadsvarianten die nauwelijks verschillen.** `/en`, `/en-tilburg`, `/en-boxtel` en
`/en-den-bosch` verschillen in een stadsnaam en een afstandsgetal. De bodytekst is
identiek. Dat patroon valt bij Google onder *scaled content*: pagina's die in aantal zijn
gemaakt om op plaatsnaamvarianten te ranken terwijl ze naar dezelfde bestemming leiden.

Daarbovenop is er een vierde inconsistentie: `/en/statiegeld-app` en
`/pl/aplikacja-statiegeld` gebruiken een pad-prefix, terwijl de landingspagina's een suffix
gebruiken. Twee conventies voor hetzelfde.

Na deze opdracht is er één patroon, zijn er geen duplicaten meer, en wordt de hreflang
triviaal geldig.

---

## Wat je NIET aanraakt

Dit staat er expliciet bij omdat het verleidelijk is om door te poetsen. De rest van de site
is goed en moet met rust worden gelaten:

- **De 26 blogartikelen.** Dat is het sterkste bezit van deze site. Echte onderwerpen, lokale
  nieuwshaken, en meerdere artikelen die precies de juiste zoekintentie raken
  (`bulkmachine-vs-supermarkt-automaat`, `tips-grote-hoeveelheden-statiegeld-inleveren`,
  `statiegeld-inleveren-horeca-sligro-alternatief`). Niets samenvoegen, niets weghalen.
- **De commerciële pagina's**: `/horeca-statiegeld`, `/statiegeld-bedrijven`,
  `/supermarkt-alternatief`, `/statiegeld-blikjes`, `/statiegeld-flesjes`,
  `/statiegeld-wiki`, `/statiegeld-app`, `/retourshop-xl-statiegeld`.
- **De 14 dorpspagina's en 11 Vinted-lockerpagina's.** Daar wordt later een apart besluit
  over genomen. Nu niet aankomen.
- **De actie- en eventpagina's**: `/donatiebak`, `/vrijdag-hulpdag`, `/tikkie-winactie`,
  `/check-loten`, `/youtube`, `/intents-festival`.

---

## Taak 1 — Zorg dat de vijf taalwortels bestaan

Deze vijf worden de enige internationale landingspagina's:

```
/en    /ro    /pl    /bg    /ua
```

`/en` en `/pl` bestaan al en geven 200. **`/ro`, `/bg` en `/ua` bestaan nog niet** — die
moeten worden aangemaakt, met de inhoud die nu op respectievelijk `/ro-oisterwijk`,
`/bg-oisterwijk` en `/ua-oisterwijk` staat.

Elke pagina moet leveren, in de HTML zoals een crawler zonder JavaScript die krijgt:

- HTTP 200
- een zelfverwijzende canonical, bijvoorbeeld `https://repayz.nl/ro` op `/ro`
- het juiste `lang`-attribuut: `en`, `ro`, `pl`, `bg`, en voor Oekraïens **`uk`** (dat is de
  juiste ISO-taalcode; die staat nu al goed, houden zo)
- een `<h1>` in de bron
- de hreflang-set uit taak 3

---

## Taak 2 — Zet 301-redirects op de 20 samengevoegde URL's

**Een 301, geen 404 en geen 302.** Google kent deze URL's. Laat je ze verdwijnen zonder
doorverwijzing, dan gooi je weg wat ze eventueel hebben opgebouwd. Dat is de enige manier
waarop deze ingreep schadelijker is dan niets doen.

| Van | Naar |
|---|---|
| `/en-oisterwijk` | `/en` |
| `/en-tilburg` | `/en` |
| `/en-boxtel` | `/en` |
| `/en-den-bosch` | `/en` |
| `/ro-oisterwijk` | `/ro` |
| `/ro-tilburg` | `/ro` |
| `/ro-boxtel` | `/ro` |
| `/ro-den-bosch` | `/ro` |
| `/pl-oisterwijk` | `/pl` |
| `/pl-tilburg` | `/pl` |
| `/pl-boxtel` | `/pl` |
| `/pl-den-bosch` | `/pl` |
| `/bg-oisterwijk` | `/bg` |
| `/bg-tilburg` | `/bg` |
| `/bg-boxtel` | `/bg` |
| `/bg-den-bosch` | `/bg` |
| `/ua-oisterwijk` | `/ua` |
| `/ua-tilburg` | `/ua` |
| `/ua-boxtel` | `/ua` |
| `/ua-den-bosch` | `/ua` |

De `Location`-header moet de absolute doel-URL bevatten, bijvoorbeeld
`https://repayz.nl/ro`, en dat doel moet zelf 200 geven — geen redirectketen.

---

## Taak 3 — Eén hreflang-set, op zes pagina's

Hier ging het eerder mis, dus dit staat er letterlijk uitgeschreven.

**Zes pagina's horen bij deze groep:** `/`, `/en`, `/ro`, `/pl`, `/bg`, `/ua`.

**Alle zes krijgen exact dezelfde zeven tags**, in de HTML, niet via JavaScript:

```html
<link rel="alternate" hreflang="nl"        href="https://repayz.nl/" />
<link rel="alternate" hreflang="en"        href="https://repayz.nl/en" />
<link rel="alternate" hreflang="ro"        href="https://repayz.nl/ro" />
<link rel="alternate" hreflang="pl"        href="https://repayz.nl/pl" />
<link rel="alternate" hreflang="bg"        href="https://repayz.nl/bg" />
<link rel="alternate" hreflang="uk"        href="https://repayz.nl/ua" />
<link rel="alternate" hreflang="x-default" href="https://repayz.nl/" />
```

Waarom identiek op alle zes: dan is de set per definitie wederkerig, en claimt precies één
pagina de Nederlandse variant. Dat waren de twee fouten in de oude opzet — vijftien
pagina's wezen naar `/` als hun Nederlandse versie terwijl `/` naar `/en` terugwees, en
vier clusters claimden dezelfde Nederlandse pagina.

**Geen enkele andere pagina krijgt hreflang-tags.** De dorpspagina's en Vinted-pagina's
hebben geen anderstalige tegenhanger meer zodra de stadsvarianten weg zijn.

Let op: geen hreflang mag naar een URL wijzen die 301 of 404 geeft. Alle zeven doelen
moeten 200 zijn.

---

## Taak 4 — Sitemap opschonen

- De 20 samengevoegde URL's eruit.
- `/ro`, `/bg` en `/ua` erin.
- **Elke URL moet een `lastmod` hebben.** Deze zes missen die nu:
  `/supermarkt-alternatief`, `/statiegeld-bedrijven`, `/statiegeld-hilvarenbeek`,
  `/statiegeld-vught`, `/statiegeld-best`, `/statiegeld-waalwijk`. Twee daarvan zijn juist
  sterke commerciële pagina's.
- Genereer `lastmod` uit de werkelijke wijzigingsdatum. Een ontbrekende `lastmod` is beter
  dan een verzonnen datum, maar een echte is het beste.

Na afloop telt de sitemap 86 URL's: 103 min 20, plus /ro, /bg en /ua.

---

## Taak 5 — Twee dingen om te controleren, niet blind aan te passen

**De videositemap op de homepage.** Er staan tien campagnevideo's van Statiegeld Nederland
in aangegeven, met eigen titels en beschrijvingen. Dat kan videoresultaten in Google
opleveren — **mits die video's ook echt op `/` staan ingebed**. Zo niet, dan is de aangifte
ongeldig. Controleer dat, en haal ze weg als ze er niet staan, of zet ze op de pagina.

**Het URL-patroon voor taalpagina's.** `/en/statiegeld-app` en `/pl/aplikacja-statiegeld`
gebruiken al de prefixvorm, en die past bij `/en` en `/pl` als wortel. Houd die dus zo.
Nieuwe anderstalige pagina's komen onder `/en/...`, `/ro/...` enzovoort. Geen
suffixvarianten meer aanmaken.

---

## Definitie van klaar

Er is één maatstaf, en die is niet voor interpretatie vatbaar:

```bash
bash scripts/acceptatie.sh
```

Exitcode 0 en nul fouten. **Publiceer niets en meld niets als klaar zolang de exitcode 1
is.** Stuur de volledige uitvoer mee bij de oplevering.

Het script staat in de repo op branch `claude/new-session-2z19uv`. Het draait ook tegen een
testomgeving:

```bash
bash scripts/acceptatie.sh http://localhost:3000
```

Gebruik dat vóór publicatie in plaats van erna.

**Het script is nu al rood op sectie 12, en dat hoort zo.** Die sectie beschrijft de
eindtoestand van deze opdracht: elk van de 20 URL's moet 301 geven naar het juiste doel.
Hij wordt groen als het werk af is. De secties 13 en 14 controleren de sitemap.

De overige elf secties waren bij de laatste meting groen — canonical, hreflang,
taalattribuut, server-side content, 404-afhandeling, de bedrijfsfeiten, de JSON-LD en de
interne links. **Die moeten groen blijven.** Als er iets omvalt door deze wijziging, is dat
een regressie en geen bijkomstigheid.

---

## Bevestigde bedrijfsfeiten

Alleen deze waarden zijn geldig, ook op de nieuwe `/ro`, `/bg` en `/ua`:

| | |
|---|---|
| Adres | Sprendlingenstraat 20, 5061 KN Oisterwijk |
| Openingstijden | dagelijks 07:00 - 23:00, zeven dagen per week |
| Verpakkingen | blikjes en PET-flesjes, geen glas |
| Tarieven | €0,15 klein / €0,25 groot / €0,15 blik |
| Uitbetaling | Tikkie |
| E-mail | info@repayz.nl |

Verboden varianten, nergens: `20B`, `5061 KJ`, `5061 KE`, `5061 JX`, `10:00-21:00`,
`10:00-18:00`, `07:00 tot 22:00`, `10:00-22:00`. De acceptatietest controleert hierop.

Uitzondering: Scooterpoint zit op dezelfde locatie maar is een ander bedrijf met eigen
openingstijden. Die regels moeten expliciet als Scooterpoint gelabeld zijn.

---

## Volgorde

1. `/ro`, `/bg`, `/ua` aanmaken en op 200 krijgen.
2. De hreflang-set uit taak 3 op alle zes de pagina's zetten.
3. Pas dán de 20 redirects aanzetten. Andersom verwijs je even naar pagina's die nog niet
   bestaan.
4. Sitemap bijwerken.
5. `acceptatie.sh` draaien tot exitcode 0.
6. In Search Console een herindexering aanvragen voor `/`, `/en`, `/ro`, `/pl`, `/bg` en
   `/ua`.

Reken erop dat Google enkele weken nodig heeft om de samenvoeging te verwerken. Dat de test
groen is, betekent dat de techniek klopt — niet dat de index al is bijgewerkt.
