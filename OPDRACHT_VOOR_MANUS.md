# REPAYZ — werkopdracht

**Voor:** de bouwer/agent die aan de live codebase van repayz.nl werkt
**Van:** Ronald
**Datum:** 18 augustus 2026

---

## 0. Lees dit eerst — belangrijk voor hoe je dit document gebruikt

Deze bevindingen komen uit een audit op de repo `ronald-sketch/repayz`, branch
`claude/new-session-2z19uv`. **Die repo is mogelijk niet de codebase waar jij op werkt.**

Reden om dat aan te nemen: op die repo ontbreken server-side rendering, de routes
`/statiegeld-wiki` en `/retourshop-xl-statiegeld`, de blogroutes, en het attribuut
`data-server-content` — terwijl repayz.nl die alle zes wél levert. Diezelfde repo heeft
"Sprendlingenstraat 20B" en openingstijden "10:00-21:00", terwijl live "Sprendlingenstraat
20" en "07:00 tot 23:00" staat.

**Daarom: behandel elke bevinding hieronder als een hypothese, niet als een feit over jouw
tree.** Bij elk punt staat een controlecommando. Draai dat eerst. Geeft het niets terug,
dan is het punt bij jou al opgelost — noteer dat en ga door. Verzin geen probleem om een
punt af te vinken.

Waar het kan, heb ik erbij gezet wat er al gerepareerd is op de backup-branch, zodat je
het kunt overnemen in plaats van opnieuw te bedenken. Die branch is publiek:
`https://github.com/ronald-sketch/repayz/tree/claude/new-session-2z19uv`

---

## 1. Bevestigde bedrijfsfeiten — de enige geldige waarden

Bron: `SEO_DO_NOT_RECOMMEND.md` v2.0.

| Wat | Waarde |
|---|---|
| Adres | Sprendlingenstraat 20, 5061 KN Oisterwijk |
| Openingstijden | dagelijks 07:00 - 23:00, zeven dagen per week |
| Verpakkingen | blikjes en PET-flesjes. **Geen glas** |
| Tarief klein (PET < 1L) | €0,15 |
| Tarief groot (PET ≥ 1L) | €0,25 |
| Tarief blik | €0,15 |
| Uitbetaling | Tikkie. Statiegeld App is aangekondigd als extra, nog niet live |
| Doneren | via de doneerknop op de machine |
| E-mail | info@repayz.nl |
| WhatsApp | +31 6 42346115 |
| Machine | Envipco Quantum Bulk RVM, 120 items per minuut |

**Verboden varianten, nergens toegestaan:** `20B`, `5061 KJ`, `5061 KE`, `5061 JX`,
`10:00-21:00`, `10:00-18:00`, `07:00 tot 22:00`, `10:00-22:00`.

**Enige uitzondering:** Scooterpoint zit op dezelfde locatie maar is een ander bedrijf met
eigen openingstijden (Di-Za 10:00-18:00, telefoon 0031 6 10122112). Die regels moeten in de
UI expliciet als Scooterpoint gelabeld zijn. Ze mogen nooit als REPAYZ-openingstijden
worden getoond.

**Nog te bevestigen door Ronald** — vul deze niet zelf in:

- Mag `+31 6 42346115` gebeld worden, of is het uitsluitend WhatsApp? Zolang dat niet
  vaststaat: geen `tel:`-link, en het `telephone`-veld weglaten uit JSON-LD. Beter geen
  nummer dan een plaatshouder.
- De exacte coördinaten van de machine.

---

## 2. De aanpak die je moet overnemen: één feitenbron plus een bewakingstest

Dit is het belangrijkste deel van dit document. De losse tekstcorrecties hieronder zijn
symptoombestrijding; dit is de oorzaak.

In de geauditeerde repo stond de openingstijd op **48 plekken** en het adres op **40
plekken**, in drie varianten, waarvan er geen enkele klopte. Zolang die duplicatie bestaat,
is elke correctie tijdelijk. Controleer of dat bij jou ook zo is:

```bash
grep -rn "Sprendlingenstraat" client/src server | wc -l
grep -rn "07:00\|23:00" client/src server | wc -l
```

Staat het adres of de openingstijd op meer dan één plek, doe dan het volgende.

### 2a. Maak `shared/facts.ts`

Neem dit bestand letterlijk over. Het staat ook in de backup-branch op `shared/facts.ts`.

```ts
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
```

### 2b. Sluit alles erop aan

Vergeet deze categorieën niet — dat zijn de plekken waar het in de backup-repo misging:

- **JSON-LD / schema.org.** Daar zat de ergste drift: de homepage gaf Di-Za 10:00-18:00 aan
  Google door terwijl de zichtbare pagina iets anders zei, en één pagina had een tweede
  `openingHoursSpecification`-blok dat maandag en zondag als **gesloten** doorgaf.
- **De systeemprompt van de chatbot.** Die had een eigen hardgecodeerde kopie van adres,
  tijden en tarieven. Bouw hem op uit de feitenbron.
- **Meertalige teksten.** Alle vijf de talen hadden een eigen kopie van de openingstijden.
  Neem bij het vertalen de bewoordingen over die al elders in de codebase staan; verzin geen
  nieuwe vertaalkeuzes.
- **Google Maps-URL's.** Het adres zat url-encoded in tientallen embed-links.
- **De openingstijden-hook.** Als er een "nu open / nog X open"-indicator is, zit daar een
  numerieke open- en sluittijd in. Die moet ook uit de bron komen.
- **Placeholders in admin-formulieren.** Die tonen ook waarden aan de beheerder.

### 2c. Zet er een test op

Zonder test loopt het binnen een paar maanden weer uiteen. De test die dit bewaakt staat in
de backup-branch op `server/facts.test.ts` (~150 regels, overdraagbaar zoals hij is). Wat
hij doet:

Hij scant `client/src`, `server`, `shared` en `content.json` op vier regels:

1. huisnummer `20B` in welke vorm dan ook, inclusief url-encoded;
2. elke `5061`-postcode die niet `KN` is;
3. de verboden openingstijdvarianten;
4. elke losse `HH:MM` die niet `07:00` of `23:00` is.

Regels die het woord "Scooterpoint" bevatten zijn vrijgesteld voor regel 3 en 4, niet voor
1 en 2 — het adres delen ze. `shared/facts.ts` zelf en alle `*.test.ts` staan op de
allowlist. Er zit een vangnet in dat faalt als de scan minder dan 50 bestanden vindt, zodat
een verschoven pad niet stilzwijgend groen wordt.

Regel 4 lijkt streng maar is de nuttigste: die ving in de backup-repo het gesloten-op-
maandag-en-zondag-blok dat met de hand over het hoofd was gezien.

**Controleer dat de test echt afgaat** voordat je hem vertrouwt: zet ergens `20B` en
`10:00 tot 21:00` terug en kijk of beide regels aanslaan met bestand en regelnummer.

---

## 3. Bevindingen

Per punt: het controlecommando, wat er mis is, en de kleinst mogelijke ingreep. Slaat de
controle niet aan, dan speelt het punt bij jou niet.

### KRITIEK — Google Analytics laadt vóór toestemming

```bash
grep -n "gtag\|googletagmanager" client/index.html
```

Als `index.html` gtag onvoorwaardelijk laadt terwijl er óók een cookiebanner is die het na
toestemming laadt, gebeuren er twee dingen tegelijk: GA4 zet cookies vóórdat de bezoeker
iets heeft gekozen, en wie accepteert wordt dubbel geteld. Op "Weigeren" klikken verandert
niets, want de scripts draaien al.

Verzwarend: de privacyverklaring belooft "Analytische cookies: alleen met uw toestemming".
Dat is dan aantoonbaar onjuist, wat een klacht bij de Autoriteit Persoonsgegevens
kansrijker maakt. Dit is het enige juridisch scherpe punt in dit document.

**Ingreep:** haal het gtag-blok uit `index.html`. De cookiebanner doet het al goed. Wil je
GA4-basismeting houden, gebruik dan Consent Mode v2 met default `denied`.

**Verificatie:** `grep -c gtag client/index.html` → 0. Daarna in een verse browser: laad de
site, kijk in DevTools → Application → Cookies of er vóór je keuze een `_ga`-cookie staat.

---

### HOOG — bij een storing meldt de site dat de machine operationeel is

```bash
grep -rn "operational" server/routers/machine.ts
```

Als de fallback bij ontbrekende backbone-data `status: 'operational'` is, staat het
statusbolletje op groen zodra de ePortal-koppeling wegvalt. De hele belofte van de site —
kijken of het de moeite is om te rijden — hangt aan dat bolletje, en juist bij een storing
klopt het dan niet.

**Ingreep:** fallback op `'offline'` of een aparte `'unknown'`, en in de UI onderscheid
maken tussen "buiten bedrijf" en "status onbekend, app ons even". Controleer meteen of er
verzonnen fallbackcijfers zijn (in de backup-repo: 1.869 op de server, 10.023 in de hero)
die als echte meting worden getoond. Toon liever niets dan een verzonnen getal.

---

### HOOG — het chatbot-endpoint accepteert een eigen systeemprompt

```bash
grep -rn "z.enum(\['system'" server/routers/
```

Staat `'system'` in de toegestane rollen, dan kan een client een systeembericht meesturen
dat ná de echte systeemprompt in de lijst wordt geplakt. Dat is de goedkoopste vorm van
promptinjectie die er is: een screenshot van "Wally" die een concurrent aanbeveelt of iets
onfatsoenlijks zegt, is dan triviaal te maken.

Controleer in dezelfde moeite:

```bash
grep -rn "max(" server/routers/wally.ts    # maxima op lengte en aantal berichten?
grep -rn "limit:" server/_core/index.ts    # body-limiet
```

**Ingreep:** `role: z.enum(['user','assistant'])`, `content: z.string().max(2000)`,
`messages: z.array(...).max(20)`, en een eenvoudige rate limiter per IP. Body-limiet naar
1 MB, met een uitzondering voor de webhook als die grote payloads stuurt.

Let op: als er een naamfilter is die per aanroep een LLM-call doet (bijvoorbeeld bij het
inschrijven voor een leaderboard), geldt hetzelfde. Dat is een onbewaakte kostenkraan.

---

### HOOG — de ePortal-webhook zonder authenticatie

```bash
grep -n "verifyWebhookAuth" server/_core/index.ts
```

Wordt die functie wel geïmporteerd maar niet aangeroepen — bijvoorbeeld omdat de controle
is uitgecommentarieerd — dan kan iedereen die het pad kent een bonnetje-event posten. Dat
wordt gekoppeld aan de openstaande wachtrijnaam en belandt op het publieke leaderboard.
`robots.txt` die `/api/` verbiedt is geen beveiliging.

**Ingreep:** de controle activeren en `WEBHOOK_USERNAME`/`WEBHOOK_PASSWORD` zetten.
Controleer eerst bij ePortal of die een auth-header kan sturen; kan dat niet, gebruik dan
een niet-raadbaar pad-segment plus een IP-allowlist.

---

### HOOG — de accentkleur haalt het contrastminimum niet

```bash
grep -rc "4db8a8" client/src | grep -v ":0" | wc -l
```

`#4db8a8` op wit geeft **2,40:1**. Dat faalt WCAG AA voor normale tekst (4,5), voor grote
tekst (3,0) én voor UI-componenten (3,0). Wit op `#4db8a8` geeft dezelfde 2,40:1.
`#4ecdc4` is met 1,94:1 nog slechter. `#1a3a52` is met 11,86:1 prima.

In de backup-repo stond de kleur 206× als tekstkleur en 84× als knopachtergrond met witte
tekst — en juist de openingstijden waren ermee opgemaakt. De site wordt buiten in fel licht
gebruikt, door iemand met een volle kofferbak. Sinds juni 2025 geldt de European
Accessibility Act voor een publieksdienst.

**Ingreep:** houd `#4db8a8` als vlak- en accentkleur, en gebruik een donkerder tint voor
tekst: `#2f7d70` geeft ~4,6:1 op wit. Op teal knoppen `text-white` vervangen door
`text-[#0d1f2d]` (4,93:1). Leg beide vast als CSS-variabele zodat het één plek blijft.

---

### HOOG — chatbot en pop-up zijn niet toegankelijk

Chatvenster, controleer op:

- `role="dialog"` en `aria-modal="true"`
- focus naar het invoerveld bij openen, terug naar de openknop bij sluiten
- Escape sluit
- `role="log"` met `aria-live="polite"` op de berichtenlijst — zonder dit hoort een
  schermlezergebruiker de antwoorden van de bot **nooit**
- een toegankelijke naam op de verzendknop (een icoon alleen is er geen)
- een tekstalternatief bij de typindicator

Pop-up of modaal venster, controleer op: `role="dialog"`, `aria-modal`, `aria-labelledby`,
focustrap, Escape, en `aria-hidden`/`inert` op de achterliggende inhoud. Zonder focustrap
tabt een toetsenbordgebruiker door inhoud die visueel is afgedekt door de overlay.

Dit zijn additieve attributen; geen van beide vraagt een refactor.

---

### HOOG — geen routeknop, geen `tel:`, adres ontbreekt op de homepage

```bash
grep -rn "tel:" client/src | wc -l
grep -rn "maps/dir\|maps.apple" client/src | wc -l
grep -c "Sprendlingenstraat" client/src/pages/Home.tsx
```

Dit is de kernfunctie van de site voor de bezoeker die je wilt bedienen: iemand met een
volle kofferbak die wil weten of het de moeite is om te rijden. In de backup-repo kon je
nergens met één tik bellen of navigeren, en de homepage noemde het adres niet.

**Ingreep:**

1. Adres in de hero op de homepage.
2. Een routeknop, op de homepage én bovenaan de locatiepagina:
   `https://www.google.com/maps/dir/?api=1&destination=` + `ADDRESS.urlEncoded`
3. Een `tel:`-link naast de WhatsApp-knop — **alleen als Ronald bevestigt dat het nummer
   gebeld mag worden.** Zie deel 1.

Een ingesloten kaart is geen vervanging: die is niet aanklikbaar naar een navigatie-app.

---

### HOOG — het admin-dashboard slaat mogelijk niets op

```bash
grep -rn "localStorage.setItem" client/src/pages/AdminDashboard.tsx
```

In de backup-repo sloeg de opslaanknop alleen op naar `localStorage`, met de opmerking
"For now, we'll save to localStorage as a demo". Wie daar de openingstijden of het
WhatsApp-nummer aanpast, verandert alleen iets in de eigen browser en denkt dat het geregeld
is. Dat is precies het soort onzichtbare fout waar dit hele document over gaat.

**Ingreep:** of een echte opslagroute (database + admin-mutatie, en de site eruit laten
lezen), of — als dat nu te veel is — een zichtbare waarschuwing in het dashboard dat opslaan
alleen lokaal werkt. Het stilzwijgend laten is de slechtste optie.

---

### HOOG — verouderde pakketten

```bash
pnpm audit --prod
```

Relevant voor de draaiende server (de rest is bouwgereedschap en minder dringend):

| Pakket | Advies | Verholpen in |
|---|---|---|
| `drizzle-orm` | SQL-injectie via onvoldoende escapete identifiers | ≥ 0.45.2 |
| `axios` | reeks prototype-pollution- en proxylek-adviezen | ≥ 1.16.0 |
| `path-to-regexp` | ReDoS via meerdere routeparameters (komt mee met express 4) | ≥ 0.1.13 |
| `nanoid` | oneindige lus bij negatieve size | ≥ 5.1.16 |

Controleer meteen op ongebruikte afhankelijkheden. In de backup-repo stonden
`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` en `streamdown` in `package.json` met
nul imports; die drie verwijderen liet in één keer drie kritieke `fast-xml-parser`-adviezen
vervallen en scheelde flink installatiegewicht.

---

### HOOG — prestaties: bouwgereedschap in de productiebundel

```bash
npx vite build && ls -l dist/public/index.html
grep -c "data-loc" dist/public/assets/*.js
```

Is `index.html` groter dan pakweg 15 kB, kijk dan wat erin zit. In de backup-repo zat er een
inline script van **366.770 bytes** in, als eerste element in de `<body>`, met een eigen
kopie van React erin. Dat kwam van `vite-plugin-manus-runtime`. Resultaat: 374 kB HTML
(107 kB gzip), render-blokkerend, en niet apart cachebaar omdat het in de HTML zelf zit —
dus elke paginaweergave betaalde het opnieuw.

`@builder.io/vite-plugin-jsx-loc` voegde daarnaast 3.009 `data-loc`-attributen met
bronpaden en regelnummers toe aan de bundle en aan de DOM.

**Ingreep** — beide plugins alleen in development laden:

```ts
export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  const plugins: PluginOption[] = [react(), tailwindcss()];
  if (isDev) {
    plugins.push(jsxLocPlugin(), vitePluginManusRuntime());
  }
  return { plugins, /* ...rest ongewijzigd... */ };
});
```

**Twee valkuilen die ik hierbij ben tegengekomen:**

1. Als er ergens code is die `vite.config.ts` importeert en spreadt — bij ons deed
   `server/_core/vite.ts` dat: `createViteServer({ ...viteConfig, ... })` — dan **breekt dat
   stilzwijgend**. Een spread van een functie levert een leeg object op, dus in development
   verdwijnen plugins, path-aliassen en `root` zonder foutmelding. Roep de functie eerst
   aan:

   ```ts
   const resolved = typeof viteConfig === "function"
     ? await viteConfig({ command: "serve", mode: "development" })
     : viteConfig;
   ```

2. `const plugins = [react(), tailwindcss()]` wordt afgeleid als een array van arrays, dus
   `plugins.push(...)` geeft een typefout. Typeer expliciet als `PluginOption[]`.

**Gemeten resultaat** bij ons: `index.html` van 373,94 kB naar 6,82 kB, gzip van 107,33 kB
naar 2,22 kB, `data-loc` van 3.009 naar 0. Start daarna de dev-server en controleer dat die
nog werkt: HTTP 200, HMR-client aanwezig, aliassen resolven.

**Risico:** als de Manus-editor of -preview de runtime in de gedeployde pagina verwacht,
verlies je die koppeling. Dat raakt het bewerken, niet de site voor bezoekers. Terugzetten
is één regel.

---

### MIDDEL — de rest, met controlecommando

| Onderwerp | Controle | Ingreep |
|---|---|---|
| Analytics-endpoint niet ingevuld | `npx vite build 2>&1 \| grep "not defined in env"` | Env-variabele zetten, of het blok verwijderen als de dienst niet meer gebruikt wordt. Een `%PLACEHOLDER%` in de gebouwde HTML betekent dat die meting nu niets oplevert |
| Geen conversie-events | `grep -rn "gtag(\|track(" client/src \| wc -l` | Minstens drie events: WhatsApp-klik, routeklik, chatgesprek gestart. Pas laden na toestemming. Zonder dit kun je van geen enkele verbetering hieronder bevestigen dat hij werkt |
| YouTube-embeds | `grep -rn "youtube.com/embed" client/src` | `loading="lazy"` toevoegen en de host vervangen door `youtube-nocookie.com`. Zowel privacy als prestatie |
| Google Maps-sleutel in de bundle | `grep -rn "AIzaSy" client/src \| wc -l` | Controleer in de Google Cloud Console of de sleutel bestaat. Ja → referrer-restrictie op `repayz.nl/*`. Nee → dan tonen de kaartinsluitingen nu een foutmelding waar een route hoort te staan, en is het een conversieprobleem |
| Verlopen claims | `grep -rn "2025\|Binnenkort" client/src` | In de backup-repo stond "Statiegeld verdubbelt in 2025" in de footer op elke pagina, en "Binnenkort open" op de contactpagina terwijl de machine draait |
| Security headers | `grep -rn "helmet\|Content-Security-Policy" server` | `helmet` toevoegen als eerste middleware; CSP daarna apart opbouwen vanwege de inline scripts |
| Service worker | `grep -n "cache.put" client/public/sw.js` | Cachet hij zonder `response.ok` te controleren, dan slaat hij ook 404's en 500's op en serveert die later als offline-fallback. Eén regel |
| PWA-manifest | `grep -n "maskable" client/public/manifest.json` | Wijzen de maskable-entries naar gewone favicons, dan snijdt Android het app-icoon aan. Gebruik dedicated maskable-iconen met ~20% marge |
| Publieke wachtrij-endpoints | `grep -n "publicProcedure" server/routers/gamification.ts` | Kan iedereen het enige slot bezetten of andermans sessie op naam annuleren? Geef een annuleertoken terug in plaats van op naam te annuleren, en zet een `.max()` op elke `limit`-parameter |
| Formulierlabels | `grep -rn "<label" client/src \| grep -v htmlFor` | Elk `<label>` een `htmlFor` en elk veld een `id`. Foutmeldingen koppelen via `aria-describedby` en in een `role="alert"` zetten |
| Sessiecookie | `grep -n "sameSite" server/_core/cookies.ts` | `sameSite: "none"` zonder CSRF-bescherming is een verzwakking zonder reden. Zet op `"lax"` tenzij er een aantoonbare cross-site-flow is, en zet `app.set('trust proxy', 1)` |
| `@ts-nocheck` | `grep -rl "@ts-nocheck" client/src server \| wc -l` | Was 111 van 166 bestanden. `tsc --noEmit` is dan groen maar zegt weinig. Niet in één keer oplossen: haal het per bestand weg, te beginnen bij bestanden die feiten bevatten |
| Afbeeldingen | `grep -rho "<img" client/src \| wc -l` vs `grep -rho '<img[^>]*width=' client/src \| wc -l` | Ontbrekende `width`/`height` geven layout shift; `loading="lazy"` onder de vouw; geen `srcset` betekent dat mobiel desktopafbeeldingen ophaalt |
| Interne navigatie | `grep -c '<a href="/' client/src/components/Header.tsx` | Plain `<a href>` naar interne routes gooit de SPA weg en herlaadt alles. Gebruik de router-`Link` |
| Skip-link en koppen | `grep -rn "skip" client/src/App.tsx` | Eén skip-link bovenaan; en controleer of er koppenniveaus worden overgeslagen (h1 → h3) |

---

## 4. Voorgestelde volgorde

Op verhouding tussen opbrengst en moeite, niet strikt op ernst.

**Ronde 1 — klein en zelfstandig, samen ongeveer een middag**
GA4 uit `index.html` · machinestatus-fallback · chatbot-endpoint dichtzetten · webhook-auth
aan · verlopen teksten · `pnpm up` en ongebruikte deps eruit.

**Ronde 2 — de bundel**
Bouwgereedschap uit de productiebuild. Meet vóór en na, en test de dev-server daarna echt.

**Ronde 3 — conversie op mobiel**
Adres op de homepage, routeknop, `tel:` (na bevestiging), en kijk kritisch naar de hoogte
van een sticky header op een telefoon. In de backup-repo nam het logo alleen al 112 px in
beslag, op elke pagina.

**Ronde 4 — toegankelijkheid, in één blok**
Contrast, chatbot, pop-up, labels, skip-link. Eén onderwerp, één testronde. Draai er daarna
één axe-scan overheen: die kost tien minuten en vindt dingen die geen enkel taalmodel
betrouwbaar ziet.

**Ronde 5 — privacy en meten, samen**
Privacyverklaring bijwerken, het bezoekers-ID, een knop "Cookievoorkeuren wijzigen" in de
footer, YouTube naar nocookie, en de conversie-events. Zet meten niet helemaal achteraan:
zolang je niets meet, kun je van niets bevestigen dat het werkt.

De feitenbron uit deel 2 hoort niet in een ronde thuis — die is de basis waar de rest op
rust. Doe die eerst.

---

## 5. Privacy: wat er in de verklaring moet komen

Controleer of de privacyverklaring deze punten dekt. In de backup-repo dekte hij ze geen van
alle, en was hij voor het laatst bijgewerkt in december 2025.

- De AI-chatbot: dat er berichten naar een externe LLM-aanbieder gaan, welke, en of
  gesprekken worden bewaard.
- Google Analytics bij naam, met de verwerkersrelatie.
- Persistente identifiers in `localStorage` — een `visitorId` voor A/B-tests telt mee, ook
  al is het geen cookie. Het gaat om het plaatsen van informatie op de randapparatuur van
  de gebruiker.
- YouTube- en Maps-embeds die bij paginabezoek al laden.
- Bewaartermijnen, rechtsgrondslag per verwerking, doorgifte buiten de EU.
- De klachtroute naar de Autoriteit Persoonsgegevens, en de verwerkingsverantwoordelijke
  met KvK-nummer.
- Dat leaderboardnamen publiek zichtbaar zijn.

En bouw een manier om toestemming **in te trekken**. Staat er eenmaal een keuze in
`localStorage`, dan komt de banner nooit meer terug. Intrekken moet even makkelijk zijn als
geven (AVG art. 7 lid 3). Een knop "Cookievoorkeuren wijzigen" in de footer die de opgeslagen
keuze wist, volstaat.

---

## 6. Wat ik niet kon vaststellen — geen aannames over doen

| Wat | Waarom |
|---|---|
| Response headers in productie | Uitgaand HTTPS was geblokkeerd in mijn omgeving |
| Of de externe links nog leven | Idem; tien hosts geprobeerd, alle geweigerd |
| Of de Google Maps-sleutel geldig is | Geen verzoek naar Google mogelijk |
| Wat de chatbot in de praktijk antwoordt | Geen API-sleutel beschikbaar |
| Of chatgesprekken worden bewaard | Geen opslagcode gevonden, maar wat de LLM-aanbieder doet is van buitenaf onzichtbaar |
| Lighthouse-veldata en een axe-scan | Vereist een browser tegen de live site |

De contrastwaarden in dit document zijn **berekend** uit de kleurcodes volgens de
WCAG-formule voor relatieve luminantie, niet in een browser gemeten. Een axe-scan zal ze
bevestigen en waarschijnlijk aanvullen.

---

## 7. Vragen aan Ronald

Deze kun je niet uit de code halen. Vraag ze, vul ze niet in.

1. Mag `+31 6 42346115` gebeld worden, of is het uitsluitend WhatsApp?
2. Wat zijn de werkelijke coördinaten van de machine?
3. Is de Google Maps-sleutel in de bundle een echte, actieve sleutel van dit account?
4. Draait de proefperiode nog? Er is een pop-up die tegen elke bezoeker "Proefperiode
   Gestart! We draaien proef!" zegt.
5. Waar draait de LLM achter de chatbot, en worden gesprekken daar bewaard?
6. Bestaat `info@repayz.nl` en wordt hij gelezen? In de backup-repo wees de contactknop naar
   een heel ander adres terwijl de link `info@repayz.nl` toonde.

---

## Bijlage — wat er al gedaan is op de backup-branch

Branch `claude/new-session-2z19uv` in `ronald-sketch/repayz`. Overneembaar, of ter
vergelijking.

| Commit | Onderwerp |
|---|---|
| `1bfd9aa` | `shared/facts.ts` als enige feitenbron |
| `692a1cc` | Chatbotprompt uit de bron; een tweede, dode systeemprompt met afwijkende feiten verwijderd |
| `c2c19e7` | Componenten en de openingstijden-hook aangesloten |
| `835ad6f` | Databestanden aangesloten, inclusief 21 Maps-URL's en de vijf talen |
| `e182080` | Elf pagina's, `content.json`, en de contact-e-mail hersteld |
| `228236f` | `server/facts.test.ts` |
| `1c3c48f` | Bouwgereedschap uit de productiebuild |

Omvang: 48 openingstijdvermeldingen en 40 adresvermeldingen teruggebracht tot één
definitie. Daarbij ook twee postcodefouten gevonden die niet in de oorspronkelijke audit
stonden: `5061 KE` (3×, waarvan één in de JSON-LD op de homepage) en `5061 JX` (1×).

Controles op `1c3c48f`: `tsc --noEmit` schoon, `vite build` schoon, esbuild-serverbundel
schoon, `facts.test.ts` 8/8 groen.
