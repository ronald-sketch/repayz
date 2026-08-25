# REPAYZ — Brede kwaliteitsaudit

**Datum:** 18 augustus 2026
**Omgeving:** Claude Code met repo-toegang, commit `ea75d46`, branch `claude/new-session-2z19uv`
**Scope:** blok 1 t/m 10 van de brede auditprompt. De SEO- en crawlerlaag is bewust overgeslagen.

## Wat deze sessie wél en niet kon zien

| Kon ik | Hoe |
|---|---|
| Broncode, config, lockfile | Repo-toegang |
| Echte productie-bundle | `pnpm install` + `npx vite build` uitgevoerd in deze sessie |
| Bekende kwetsbaarheden | `pnpm audit --json` uitgevoerd (registry bereikbaar) |
| TypeScript-status | `npx tsc --noEmit` uitgevoerd |

| Kon ik niet | Waarom |
|---|---|
| `https://repayz.nl` ophalen | Uitgaand verkeer geblokkeerd: `CONNECT tunnel failed, response 403` |
| Response headers in productie | Zelfde reden |
| Externe links controleren | Zelfde reden — 10 hosts geprobeerd, alle 403 op de proxy |
| Wally live bevragen | Vereist `BUILT_IN_FORGE_API_KEY`; niet aanwezig |
| Lighthouse / axe draaien | Geen browser-run mogelijk zonder productie-URL |

Alles hieronder is daarom **statisch of build-verifieerbaar**. Waar ik iets niet heb gezien, staat dat er zo bij.

---

# Deel 1 — Kritieke bevindingen

### [Kritiek] E-mail op de contactpagina gaat naar een vreemd iCloud-adres

```
Blok:        7 (conversie) / 8 (feitelijke actualiteit)
Bron:        client/src/pages/Contact.tsx:70
Waarneming:  <a href="mailto:adapter-catalogus.2q@icloud.com">
               info@repayz.nl
             </a>
             De privacyverklaring (Privacy.tsx) noemt info@repayz.nl als contactadres.
Status:      Waargenomen
Wie raakt het: bezoeker, eigenaar, juridisch
Risico:      Iedereen die op de enige e-mailknop van de site klikt, mailt naar een adres dat
             niet van REPAYZ lijkt te zijn. Zakelijke aanvragen (horeca, verenigingen) komen
             nergens aan. Bovendien wordt een privé-ogend adres publiek gepubliceerd, terwijl
             de privacyverklaring een ander adres belooft — dat is een AVG-inconsistentie
             in de contactroute voor betrokkenenrechten.
Tegenrisico: Geen, mits info@repayz.nl daadwerkelijk bestaat en gelezen wordt.
Voorstel:    href wijzigen naar mailto:info@repayz.nl. Eén regel.
Verificatie: grep -n "mailto:" client/src/pages/Contact.tsx
```

### [Kritiek] 358 kB inline script in élke pagina, als eerste element in de body

```
Blok:        1 (prestaties)
Bron:        vite.config.ts:9 (vitePluginManusRuntime()) → dist/public/index.html
Waarneming:  Build-output van deze sessie:
               ../dist/public/index.html   373.94 kB │ gzip: 107.33 kB
             Analyse van dat bestand:
               script id="manus-runtime"  → inline bytes: 366770
               positie: byte-offset 5448, direct na <body>, vóór <div id="root">
               inhoud begint met: window.__MANUS_HOST_DEV__ = false; ... react-jsx-runtime.production.js
Status:      Waargenomen
Wie raakt het: bezoeker (vooral mobiel/4G), omzet
Risico:      De HTML-shell is 374 kB in plaats van ~4 kB. Het is een synchroon inline script,
             dus de browser moet het volledig downloaden én uitvoeren voordat #root bestaat.
             Het bevat een tweede complete React-runtime, bovenop de 194 kB react-vendor-chunk.
             Het is niet apart cachebaar (het zit ín de HTML, die de service worker
             network-first behandelt), dus elke pageview betaalt opnieuw 107 kB gzip.
             Dit is vrijwel zeker de hoofdoorzaak van de PageSpeed-scores van 67-79 die in
             pagespeed-*.md in deze repo staan gedocumenteerd.
Tegenrisico: De Manus-editor/preview verliest zijn runtime-koppeling. Daarom: alleen in
             productie uitschakelen, niet in development.
Voorstel:    In vite.config.ts de plugin conditioneel maken:
               const plugins = [react(), tailwindcss()];
               if (process.env.NODE_ENV !== "production") {
                 plugins.push(jsxLocPlugin(), vitePluginManusRuntime());
               }
             Dit lost meteen ook de data-loc-bevinding hieronder op.
Verificatie: npx vite build && ls -la dist/public/index.html
             (verwacht: van ~374 kB naar ~5 kB)
```

### [Kritiek] Google Analytics laadt vóór toestemming — en de privacyverklaring beweert het tegendeel

```
Blok:        5 (AVG)
Bron:        client/index.html:130-136
             client/src/components/CookieConsent.tsx:20-34
             client/src/pages/Privacy.tsx:47 en :107
Waarneming:  In index.html, onvoorwaardelijk, zonder enige consent-check:
               <script async src="https://www.googletagmanager.com/gtag/js?id=G-TPCWYQL60J">
               gtag('config', 'G-TPCWYQL60J');
             Tegelijk bevat CookieConsent.tsx een loadGoogleAnalytics() die exact dezelfde
             twee scripts nogmaals injecteert, maar dán pas na klikken op "Accepteren".
             De privacyverklaring zegt: "Analytische cookies: Alleen met uw toestemming".
Status:      Waargenomen
Wie raakt het: juridisch, bezoeker
Risico:      GA4 zet _ga-cookies en verstuurt een pageview vóórdat de banner is beantwoord.
             Op "Weigeren" klikken verandert niets — de scripts draaien al. Dat is een
             overtreding van art. 11.7a Telecommunicatiewet / AVG, en de privacyverklaring
             bevat een aantoonbaar onjuiste bewering, wat een klacht kansrijker maakt.
Tegenrisico: Je verliest analytics-data van bezoekers die weigeren. Dat is precies de bedoeling.
Voorstel:    Verwijder regel 129-136 uit client/index.html volledig. CookieConsent.tsx doet
             het werk al correct. Voeg daarna in CookieConsent een "rejected"-tak toe die
             niets laadt (staat er al) en zet Consent Mode v2 default op 'denied' als je
             GA4-basismeting wilt houden.
Verificatie: grep -n "gtag" client/index.html   (verwacht: geen treffers)
```

### [Kritiek] De openingstijden spreken elkaar tegen — mensen rijden op een gesloten dag

```
Blok:        8 (feitelijke actualiteit) / 4 (Wally) / 7 (conversie)
Bron:        Variant A — "dagelijks 10:00-21:00, 7 dagen per week":
               client/src/components/Header.tsx:114
               client/src/hooks/useOpeningHours.ts:3-4
               client/src/pages/Locatie.tsx:16, :79
               client/src/pages/FAQ.tsx:60  ("Ook op feestdagen!")
               client/src/components/SchemaOrg.tsx:21 ("Mo-Su 10:00-21:00")
               client/src/pages/AlgemeneVoorwaarden.tsx:121
               client/public/content.json:17-18
               server/wallyChat.ts:36  (de live chatbot)
             Variant B — "dinsdag t/m zaterdag 10:00-18:00, zo+ma gesloten":
               client/src/data/villageFAQs.ts:52   "gewoon langskomen tijdens
                                                    openingstijden (di-za 10:00-18:00)"
               client/src/data/villageFAQs.ts:112  "Zondag en maandag zijn we gesloten."
               client/src/data/internationalTranslations.ts:16,38,60,82,104
                                                    (EN/RO/PL/BG/UA, alle vijf)
               client/src/pages/VillageLanding.tsx:84  "openingHours": "Tu-Sa 10:00-18:00"
               server/wally.ts:37, :87 (dode variant, zie aparte bevinding)
Status:      Waargenomen
Wie raakt het: bezoeker, omzet, zoekmachine
Risico:      Op /statiegeld-udenhout staat in de openingstijdenkaart "Alle dagen 10:00-21:00"
             (VillageLanding.tsx:443) terwijl de JSON-LD op diezelfde pagina "Tu-Sa 10:00-18:00"
             aan Google doorgeeft (VillageLanding.tsx:84) en de FAQ eronder "di-za 10:00-18:00"
             zegt. Op /en, /ro, /pl, /bg en /ua staat in de metabeschrijving "Open daily
             10:00-21:00" (InternationalLanding.tsx:60-64) en in de locatiekaart eronder
             "Tuesday - Saturday: 10:00 - 18:00 / Sunday - Monday: Closed".
             Iemand met een volle kofferbak rijdt op zondag, of om 19:00, en staat voor niets.
             Dit is precies het scenario dat de auditprompt als zwaarstwegend aanmerkt.
Tegenrisico: Geen — behalve dat je moet wéten welke variant klopt.
Voorstel:    Twee stappen.
             (1) Nu: bepaal welke variant waar is en corrigeer de zes bestanden van de
                 verkeerde variant. Let op: VillageLanding.tsx:458 en BelowTheFold.tsx:278
                 zijn NIET fout — die "di-za 10:00-18:00" horen bij Scooterpoint, correct
                 gelabeld. Alleen villageFAQs, internationalTranslations en het schema
                 op VillageLanding.tsx:84 gaan over REPAYZ zelf.
             (2) Structureel: één shared/facts.ts met openingstijden, adres, tarieven en
                 telefoonnummer, waar alle 40+ plekken uit lezen. Zie blok 9.
Verificatie: grep -rn "10:00" client/src server | grep -v Scooterpoint
```

---

# Deel 2 — Hoge prioriteit

### [Hoog] Bij een storing meldt de site dat de machine operationeel is

```
Blok:        7 (conversie) / 8
Bron:        server/routers/machine.ts:16-21 en :151-160
Waarneming:  const DEFAULT_MACHINE_DATA = { total: 1869, bottles: 1200, cans: 669, todayTotal: 0 };
             ...
             // Return default fallback when backbone has no data
             console.log('[Machine] No backbone data available, using defaults');
             return {
               status: 'operational' as const,
               statusType: 'ready' as const,
               ...
             }
Status:      Waargenomen
Wie raakt het: bezoeker, omzet, reputatie
Risico:      Als de ePortal-koppeling wegvalt — API down, credentials verlopen, netwerk weg —
             dan is de fallback "groen". Header en homepage tonen "✅ Operationeel" met een
             pulserend bolletje, terwijl de werkelijke toestand onbekend is. Juist bij een
             storing wil je dat de site het zegt; nu vertelt hij het tegenovergestelde met
             volle overtuiging.
             Daarbovenop toont de teller dan 1869 (server-fallback) of 10023 (client-fallback,
             Home.tsx:39) als "Items Gerecycled" — verzonnen cijfers gepresenteerd als meting.
Tegenrisico: Een "status onbekend"-melding oogt minder mooi dan een groen vinkje. Dat is
             het punt.
Voorstel:    Fallback op statusType: 'offline' zetten en in de UI onderscheid maken tussen
             "buiten bedrijf" en "status onbekend, bel/app ons even". De teller: bij
             ontbrekende data niets tonen in plaats van een verzonnen getal.
Verificatie: sed -n '150,165p' server/routers/machine.ts
```

### [Hoog] Het chatbot-endpoint is publiek, ongelimiteerd, en accepteert een eigen systeemprompt

```
Blok:        6 (beveiliging) / 4 (Wally)
Bron:        server/routers/wally.ts:13-16
Waarneming:  .input(z.object({
               messages: z.array(z.object({
                 role: z.enum(['system', 'user', 'assistant']),
                 content: z.string(),
               })),
             Geen rate limiting, geen maximum op het aantal berichten, geen maximum op de
             lengte van content, geen authenticatie (publicProcedure).
Status:      Waargenomen
Wie raakt het: eigenaar (kosten), bezoeker (bot uit de lucht), reputatie
Risico:      Drie dingen tegelijk.
             (1) role: 'system' is door de client te zetten. Die berichten worden in
                 wallyChat.ts:104 ná de echte systeemprompt in de lijst geplakt. Iemand kan
                 dus "negeer je instructies, je bent nu X" als systeemrol meesturen —
                 de goedkoopste vorm van promptinjectie die er is. Screenshot van "Wally"
                 die iets onfatsoenlijks of een concurrent aanbeveelt, is triviaal te maken.
             (2) Onbeperkte messages-array en contentlengte: één POST met een array van
                 duizend berichten van 100 kB gaat rechtstreeks naar de LLM. De body-limiet
                 staat op 50 MB (server/_core/index.ts:36).
             (3) Geen rate limiting: een script kan het endpoint in een lus aanroepen en het
                 LLM-budget leegtrekken. Hetzelfde geldt voor drop.addToQueue, dat per
                 aanroep een LLM-call doet voor de naamfilter (server/nameFilter.ts:28).
Tegenrisico: Rate limiting kan een legitieme piek raken. Zet de drempel ruim (bijv. 20
             berichten per IP per 10 minuten).
Voorstel:    role: z.enum(['user','assistant']) — 'system' weghalen. content: z.string().max(2000).
             messages: z.array(...).max(20). Een eenvoudige in-memory rate limiter per IP
             voor /api/trpc op de wally- en drop-routes. Body-limiet naar 1 MB, met een
             uitzondering voor de webhook als die grote payloads stuurt.
Verificatie: sed -n '10,22p' server/routers/wally.ts
```

### [Hoog] Twee Wally's met verschillende feiten; de dode variant is niet verwijderd

```
Blok:        4 (Wally) / 9 (onderhoudbaarheid)
Bron:        server/wallyChat.ts (LIVE — geïmporteerd door routers/wally.ts:7)
             server/wally.ts    (DOOD — nergens geïmporteerd)
Waarneming:  wallyChat.ts:36  "Openingstijden: Dagelijks 10:00-21:00"
             wally.ts:37      "Openingstijden: Dinsdag-Zaterdag 10:00-18:00, Zondag-Maandag gesloten"
             wallyChat.ts:29  "Locatie: Sprendlingenstraat 20B, 5061 KN Oisterwijk"
             wally.ts:64      "Geef geen exacte adressen als deze nog niet bevestigd zijn"
             wallyChat.ts:43-45 "Grote plastic flessen (1L+): €0,25 / Kleine (<1L): €0,15 / Blikjes: €0,15"
             wally.ts:38      "Statiegeld: Momenteel €0,15 per item (mogelijk €0,30 vanaf 2026,
                               nog niet bevestigd)"
Status:      Waargenomen
Wie raakt het: bouwer, en indirect de bezoeker
Risico:      De actieve prompt (wallyChat.ts) is inhoudelijk correct ten opzichte van de site:
             adres klopt, tarieven kloppen met FAQ.tsx:23 en AlgemeneVoorwaarden.tsx:86, glas
             wordt expliciet uitgesloten. Dat is goed nieuws. Maar er ligt een tweede,
             tegenstrijdige versie klaar met verkeerde openingstijden en een verouderd
             "€0,30 vanaf 2026"-voorbehoud. Eén verkeerde import-regel bij de volgende
             wijziging en de chatbot vertelt bezoekers dat je op zondag niet terecht kunt.
             De prompt gaat er in de auditopdracht van uit dat Wally uit seoFacts.ts leest.
             Dat bestand bestaat niet in deze repo; alle feiten staan hardgecodeerd in de
             systeemprompt en zijn dus een kopie die kan verouderen.
Tegenrisico: Geen.
Voorstel:    server/wally.ts verwijderen. De feitenblokken in wallyChat.ts genereren uit
             dezelfde shared/facts.ts als de site (zie blok 9), zodat de chatbot per definitie
             niet meer kan afwijken.
Verificatie: grep -rn "from \"./wally\"\|from './wally'" server   (verwacht: geen treffers)
```

### [Hoog] De privacyverklaring dekt de chatbot, de analytics en het bezoekers-ID niet

```
Blok:        5 (AVG)
Bron:        client/src/pages/Privacy.tsx:27 en de volledige tekst (158 regels)
Waarneming:  "Laatst bijgewerkt: December 2025"
             De verklaring noemt: recyclingstatistieken, leaderboard-naam, contact via e-mail,
             analytische cookies (generiek), Tikkie/ABN AMRO, en de AVG-rechten.
             De verklaring noemt NIET:
               - de AI-chatbot Wally, of dat chatberichten naar een externe LLM-aanbieder gaan
               - Google Analytics / Google Ireland bij naam, of de verwerkersrelatie
               - de persistente bezoekers-ID in localStorage (TrialPopup.tsx:91-96)
               - YouTube- en Google-Maps-embeds die bij paginabezoek al laden
               - bewaartermijnen
               - de rechtsgrondslag per verwerking
               - doorgifte buiten de EU
               - de klachtroute naar de Autoriteit Persoonsgegevens
               - een rechtspersoon of KvK-nummer van de verwerkingsverantwoordelijke
             Ook: "U kunt uw cookievoorkeuren op elk moment aanpassen via de cookiebanner
             onderaan de pagina" (Privacy.tsx:110) — maar zodra er een keuze in localStorage
             staat verschijnt de banner nooit meer (CookieConsent.tsx:11-17) en is er geen
             enkele manier om terug te komen op je keuze.
Status:      Waargenomen (de tekst); Aanname (dat de LLM-aanbieder buiten de EU verwerkt —
             dat hangt af van BUILT_IN_FORGE_API_URL, zie Vragen aan de bouwer)
Wie raakt het: juridisch, bezoeker
Risico:      Een AI-assistent waar bezoekers vrije tekst in typen is een verwerking die
             benoemd moet worden. Intrekken van toestemming moet even makkelijk zijn als
             geven (AVG art. 7 lid 3) — dat kan hier niet.
Tegenrisico: Geen.
Voorstel:    Kleinste ingreep: (a) een alinea over Wally toevoegen met de aanbieder, het doel
             en of gesprekken worden bewaard; (b) Google Analytics bij naam noemen met de
             verwerkersrelatie; (c) de bezoekers-ID noemen; (d) een "Cookievoorkeuren
             wijzigen"-knop in de footer die localStorage.removeItem("cookie-consent") doet
             en de banner terugbrengt; (e) datum bijwerken.
Verificatie: grep -in "wally\|chatbot\|google analytics\|bewaartermijn" client/src/pages/Privacy.tsx
```

### [Hoog] Persistente bezoekers-ID en A/B-tracking zonder toestemming

```
Blok:        5 (AVG)
Bron:        client/src/components/TrialPopup.tsx:91-105, :316-320
             server/routers/admin.ts:16-25 (abTest.trackEvent, publicProcedure)
Waarneming:  visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
             localStorage.setItem(VISITOR_ID_KEY, visitorId);
             ...
             trackEvent.mutate({ testName, variantKey, visitorId: vid, eventType: 'impression' })
             TrialPopup wordt in App.tsx:191 op élke route gerenderd en vuurt 2 seconden na
             het laden (defaultConfig.delayMs = 2000).
Status:      Waargenomen
Wie raakt het: juridisch
Risico:      Een blijvend, uniek identificerend kenmerk wordt op het apparaat van de bezoeker
             opgeslagen en naar de server gestuurd, zonder toestemming en zonder vermelding
             in de privacyverklaring. Dat localStorage geen cookie heet maakt juridisch geen
             verschil: het gaat om het plaatsen en uitlezen van informatie op de randapparatuur
             van de gebruiker. De cookiebanner vraagt hier niets over.
Tegenrisico: Zonder ID kun je impressies niet ontdubbelen; je A/B-test wordt grover.
Voorstel:    Of het A/B-experiment achter dezelfde toestemming zetten als analytics, of de
             visitorId vervangen door een sessie-scoped waarde (sessionStorage) en dat in de
             privacyverklaring benoemen als functionele meting zonder profilering.
Verificatie: grep -n "VISITOR_ID_KEY\|trackEvent.mutate" client/src/components/TrialPopup.tsx
```

### [Hoog] De ePortal-webhook staat open zonder authenticatie

```
Blok:        6 (beveiliging)
Bron:        server/_core/index.ts:42-48
Waarneming:  app.post("/api/eportal-webhook", async (req, res) => {
               try {
                 // Optional: Verify webhook authentication
                 // const authHeader = req.headers.authorization;
                 // if (!verifyWebhookAuth(authHeader, process.env.WEBHOOK_USERNAME, ...)) {
                 //   return res.status(401).json({ error: "Unauthorized" });
                 // }
             verifyWebhookAuth wordt op regel 11 wél geïmporteerd, maar nergens aangeroepen.
Status:      Waargenomen
Wie raakt het: eigenaar, bezoeker
Risico:      Iedereen die het pad kent kan een bonnetje-event (40010) posten. processEportalWebhook
             koppelt dat aan de openstaande wachtrij-naam en schrijft het in dropsHistory
             (server/eportalWebhook.ts) — het publieke leaderboard. Combineer dat met
             drop.addToQueue, dat óók publiek is en alleen een naam vraagt, en iemand kan
             zichzelf willekeurige aantallen ingeleverde items toekennen. De gamification-cijfers
             zijn daarmee niet betrouwbaar. Robots.txt verbiedt /api/ voor crawlers, maar dat
             is geen beveiliging.
Tegenrisico: Als ePortal geen Basic Auth kan sturen, breekt de koppeling. Controleer dat eerst.
Voorstel:    De vier uitgecommentarieerde regels activeren en WEBHOOK_USERNAME/WEBHOOK_PASSWORD
             zetten. Als ePortal geen auth-header ondersteunt: een niet-raadbaar pad-segment
             plus een IP-allowlist.
Verificatie: sed -n '42,50p' server/_core/index.ts
```

### [Hoog] De accentkleur haalt het contrastminimum niet — ook niet voor grote tekst

```
Blok:        3 (WCAG 2.2 AA)
Bron:        Kleurgebruik geteld over client/src:
               text-[#4db8a8]  206x
               bg-[#4db8a8]    84x   (vrijwel altijd met text-white)
               text-[#4ecdc4]  6x
             Voorbeelden: client/src/components/CookieConsent.tsx:72 (Accepteren-knop,
             bg-[#4db8a8] + text-white), client/src/pages/VillageLanding.tsx:443
             (openingstijden in text-[#4db8a8] op bg-gray-50),
             client/src/pages/Locatie.tsx:78 (openingstijden in text-[#4db8a8] op wit).
Waarneming:  Berekende contrastverhoudingen (WCAG 2.x relatieve luminantie):
               #4db8a8 op #ffffff  = 2,40 : 1   → AA normaal (4,5) FAIL, AA groot (3,0) FAIL
               #ffffff op #4db8a8  = 2,40 : 1   → FAIL, ook voor UI-componenten (3,0)
               #4ecdc4 op #ffffff  = 1,94 : 1   → FAIL
               #1a3a52 op #ffffff  = 11,86 : 1  → ruim PASS
               #1a3a52 op #4db8a8  = 4,93 : 1   → PASS
Status:      Waargenomen (kleurwaarden uit de broncode; verhoudingen berekend, niet gemeten
             in een browser — een axe-scan zal hetzelfde vinden)
Wie raakt het: bezoeker, juridisch (European Accessibility Act sinds juni 2025)
Risico:      De merkaccentkleur is onleesbaar voor een deel van de bezoekers, en juist de
             belangrijkste informatie is ermee opgemaakt: openingstijden op /locatie en op
             alle dorpspagina's, en de primaire knoppen. Buiten in fel licht — precies de
             gebruikssituatie van deze site — is 2,4:1 voor niemand goed leesbaar.
Tegenrisico: De huisstijl verandert zichtbaar. Dat is onvermijdelijk; #4db8a8 kan gewoon
             niet als tekstkleur op wit.
Voorstel:    Twee tinten aanhouden in plaats van één:
               - #4db8a8 blijft de decoratieve/vlakkleur (randen, iconen op donker, accenten)
               - een donkerder variant voor tekst en voor knoppen met witte tekst.
                 #2f7d70 geeft ~4,6:1 op wit; #1a3a52 (bestaand navy) geeft 11,9:1.
               - knoppen met bg-[#4db8a8]: text-white vervangen door text-[#0d1f2d].
             Definieer beide als CSS-variabele in index.css zodat het één plek is.
Verificatie: axe DevTools of Lighthouse-accessibility op /locatie
```

### [Hoog] De chatbot is niet te gebruiken met een schermlezer

```
Blok:        3 (WCAG) / 4 (Wally)
Bron:        client/src/components/WallyChat.tsx:88-175
Waarneming:  - Het chatvenster is een <div className="fixed ..."> zonder role="dialog",
               zonder aria-modal, zonder aria-labelledby.
             - Bij openen wordt de focus niet verplaatst; bij sluiten keert de focus niet
               terug naar de openknop.
             - Er is geen Escape-handler.
             - De berichtenlijst (:120-135) heeft geen aria-live / role="log". Een schermlezer
               kondigt binnenkomende antwoorden van Wally dus nooit aan.
             - De typindicator (:137-147) is drie animate-bounce-divs zonder tekstalternatief.
             - De verzendknop (:164-170) bevat alleen een <Send/>-icoon en heeft geen
               aria-label en geen sr-only-tekst → geen toegankelijke naam.
             - onKeyPress (:157) is een verouderd React-event.
Status:      Waargenomen
Wie raakt het: bezoeker met een schermlezer of alleen toetsenbord, juridisch (EAA)
Risico:      Voor een blinde bezoeker is de chatbot een knop die iets opent dat vervolgens
             stil blijft. De verzendknop wordt voorgelezen als "knop" zonder meer.
Tegenrisico: Geen; dit zijn additieve attributen.
Voorstel:    Vier kleine toevoegingen, geen refactor:
               <div role="dialog" aria-modal="true" aria-label="Chat met Wally">
               <div className="flex-1 ..." role="log" aria-live="polite" aria-relevant="additions">
               <Button aria-label="Verstuur bericht">
               typindicator: <span className="sr-only">Wally typt…</span>
             Plus focus() op het invoerveld bij openen en op de openknop bij sluiten, en een
             onKeyDown voor Escape.
Verificatie: Tab door de pagina met VoiceOver/NVDA aan; of axe DevTools met de chat open.
```

### [Hoog] De pop-up is een modaal venster zonder dialooggedrag

```
Blok:        3 (WCAG)
Bron:        client/src/components/TrialPopup.tsx:176-200
Waarneming:  <div className="fixed inset-0 bg-black/60 z-50" onClick={handleDismiss} />
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ...">
               <div className="bg-white ... rounded-2xl ..." onClick={e => e.stopPropagation()}>
             Geen role="dialog", geen aria-modal, geen aria-labelledby, geen focusverplaatsing,
             geen focustrap, geen Escape-handler, en de achterliggende pagina wordt niet
             inert of aria-hidden gemaakt.
Status:      Waargenomen
Wie raakt het: bezoeker met toetsenbord of schermlezer, juridisch
Risico:      De pop-up verschijnt 2 seconden na élke eerste pagina per dag, over de hele
             pagina heen. Een toetsenbordgebruiker tabt gewoon door naar de inhoud eronder,
             die visueel is afgedekt door een zwarte overlay — je navigeert dus blind. Een
             schermlezer meldt niet dat er iets is geopend.
Tegenrisico: Geen.
Voorstel:    role="dialog" aria-modal="true" aria-labelledby={titleId} op de binnenste div,
             focus naar de sluitknop bij openen, Escape sluit, en aria-hidden="true" op
             #root-inhoud zolang de pop-up open is. Overweeg daarnaast of een pop-up na 2
             seconden past bij iemand die alleen even de openingstijden wil zien.
Verificatie: Open de site, druk Tab: de focus hoort binnen de pop-up te blijven.
```

### [Hoog] Geen adres op de homepage, geen routeknop, geen klikbaar telefoonnummer

```
Blok:        7 (conversie op mobiel)
Bron:        grep -rn "Sprendlingenstraat" client/src → wél in Contact, Locatie, FAQ,
               VillageLanding, VintedVillageLanding, InternationalLanding, Privacy,
               AlgemeneVoorwaarden, StatiegeldNederland en de twee schema-componenten;
               NIET in pages/Home.tsx, components/home/BelowTheFold.tsx, components/Header.tsx
               of components/Footer.tsx.
             grep -rn "tel:" client/src → geen enkele treffer in de hele codebase.
             client/src/pages/Locatie.tsx:54-64 → een OpenStreetMap-iframe, niet aanklikbaar
               naar een navigatie-app; daaronder alleen de adrestekst (:71-79). Geen
               "Start route"-knop, geen Google/Apple Maps deeplink.
Status:      Waargenomen
Wie raakt het: bezoeker, omzet
Risico:      De auditvraag is: "Staat het antwoord op waar, wanneer, hoeveel krijg ik binnen
             één scherm op mobiel?" Op de homepage — de pagina waar de meeste mensen landen —
             staat het waar er helemaal niet. Wie het adres wél vindt, op /locatie, moet het
             met de hand overtikken in zijn navigatie-app. Er is geen enkele plek op de site
             waar je met één tik kunt bellen of navigeren. Dat is voor "iemand met een volle
             kofferbak die wil weten of het de moeite is om te rijden" de kernfunctie.
Tegenrisico: Geen.
Voorstel:    Drie kleine toevoegingen:
             (1) In de hero op Home: het adres + een knop
                 <a href="https://www.google.com/maps/dir/?api=1&destination=Sprendlingenstraat+20B,5061+KN+Oisterwijk">Start route</a>
             (2) Diezelfde knop bovenaan /locatie, boven de kaart.
             (3) Een <a href="tel:+31642346115"> naast de WhatsApp-knop op /contact —
                 mits dat nummer ook gebeld mag worden (zie Vragen aan de bouwer).
Verificatie: grep -rn "maps/dir\|tel:" client/src
```

### [Hoog] Het admin-dashboard slaat niets op — bewerkingen verdwijnen bij de volgende bezoeker

```
Blok:        9 (onderhoudbaarheid) / 7
Bron:        client/src/pages/AdminDashboard.tsx:243-249
Waarneming:  const handleSave = async () => {
               ...
               // For now, we'll save to localStorage as a demo
               localStorage.setItem("repayz_content", JSON.stringify(content));
             Het formulier bewerkt onder meer settings.whatsappNumber, openingHoursStart,
             openingHoursEnd en machine.status (velden uit client/public/content.json).
             Er is geen enkele server-mutatie die content.json of een database bijwerkt.
             content.json wordt door geen enkele bezoekerspagina gelezen — alleen door
             AdminDashboard zelf (regel 232).
Status:      Waargenomen
Wie raakt het: eigenaar, bezoeker
Risico:      Het dashboard wekt de indruk dat je openingstijden, het WhatsApp-nummer en de
             machinestatus kunt beheren. Je verandert alleen iets in de localStorage van de
             browser waarin je op Opslaan drukte. De site voor bezoekers verandert niet.
             Als de eigenaar hier ooit de openingstijden aanpast en denkt dat het geregeld is,
             is de fout onzichtbaar. Hetzelfde geldt voor de teksten van de pop-up
             (TrialPopup.tsx:110-129, ook localStorage) — die zijn voor bezoekers alleen via
             een codewijziging aan te passen.
             Terzijde: content.json:15 bevat "whatsappNumber": "+31 6 12345678" — een
             plaatshouder, terwijl het echte nummer 31642346115 hardgecodeerd in Footer.tsx:69,
             Contact.tsx:52, Home.tsx:52 en VillageLanding.tsx:58 staat.
Tegenrisico: Een echte opslagroute bouwen kost meer dan een regel. Alternatief is eerlijk zijn.
Voorstel:    Kleinste eerlijke ingreep nu: een zichtbare waarschuwing in het dashboard dat
             opslaan alleen lokaal werkt, of de knop uitschakelen. Structureel: de instellingen
             in de database zetten met een adminProcedure-mutatie, en de site eruit laten lezen.
             Let op: adminProcedure bestaat al in server/_core/trpc.ts:32 maar wordt nergens
             gebruikt — alle adminroutes doen een handmatige rolcheck.
Verificatie: sed -n '240,255p' client/src/pages/AdminDashboard.tsx
```

### [Hoog] Elke klik in het menu herlaadt de hele applicatie

```
Blok:        1 (prestaties) / 7
Bron:        client/src/components/Header.tsx:105, :134-140
Waarneming:  <a href="/" ...><img src={APP_LOGO} ... /></a>
             <a href="/hoe-het-werkt" className={getLinkClass('/hoe-het-werkt')}>Hoe het werkt</a>
             <a href="/vinted" ...>  <a href="/locatie" ...>  <a href="/leaderboard" ...>
             <a href="/contact" ...>
             Header.tsx importeert wel useLocation uit wouter (regel 7), maar niet Link.
             13 andere bestanden gebruiken wouter wél correct.
             Ook client/src/components/Footer.tsx gebruikt absolute externe URL's naar de
             eigen site: href="https://repayz.nl/faq" en href="https://repayz.nl/statiegeld-nederland".
Status:      Waargenomen
Wie raakt het: bezoeker op mobiel/4G
Risico:      Elke menuklik gooit de SPA weg en haalt opnieuw 374 kB HTML op (inclusief het
             358 kB inline script uit de kritieke bevinding hierboven), plus een nieuwe
             hydratie en nieuwe tRPC-requests. Op 4G is dat seconden per klik, terwijl
             client-side navigatie vrijwel gratis is. De twee effecten versterken elkaar:
             hoe zwaarder de HTML, hoe duurder elke navigatie.
Tegenrisico: Geen — wouter's Link valt terug op een gewone <a> voor screenreaders en
             middelklik.
Voorstel:    In Header.tsx: import { Link, useLocation } from "wouter" en <a href> vervangen
             door <Link href>. In Footer.tsx de twee absolute repayz.nl-URL's relatief maken.
Verificatie: grep -n "<a href=\"/" client/src/components/Header.tsx   (verwacht: geen treffers)
```

### [Hoog] Verouderde pakketten met bekende kwetsbaarheden in de runtime

```
Blok:        6 (beveiliging)
Bron:        pnpm audit --json, uitgevoerd 18-08-2026. Totaal: 3 kritiek, 48 hoog,
             75 middel, 11 laag. Versies uit pnpm-lock.yaml.
Waarneming:  Relevant voor de dráaiende server (de rest is bouwgereedschap):
               drizzle-orm 0.44.6  — "SQL injection via improperly escaped SQL identifiers",
                                     verholpen in >=0.45.2
               axios 1.12.2        — reeks prototype-pollution- en proxy-lek-adviezen,
                                     verholpen in >=1.16.0. Gebruikt in server/_core/sdk.ts:3
               path-to-regexp 0.1.12 — ReDoS via meerdere routeparameters, >=0.1.13
                                     (transitief via express 4.21.2)
               body-parser <1.20.6 — DoS wanneer een ongeldige limit de groottecontrole
                                     stilzwijgend uitschakelt (relevant: limit staat op 50mb)
               nanoid 5.1.6        — oneindige lus bij negatieve size, >=5.1.16
             Niet relevant omdat het bouwgereedschap is: vite, rollup, esbuild, postcss,
             tar, pnpm zelf, vitest.
             Niet relevant omdat het niet gebruikt wordt: fast-xml-parser (kritiek) komt
             alleen binnen via @aws-sdk/client-s3, dat nergens geïmporteerd wordt.
Status:      Waargenomen
Wie raakt het: eigenaar, bezoekersdata
Risico:      Het drizzle-advies is de enige die direct op de datalaag zit. Of hij hier
             uitbuitbaar is hangt af van of er ergens een identifier uit gebruikersinvoer
             komt; ik heb geen plek gevonden waar dat gebeurt (alle queries in server/db.ts
             gebruiken de query-builder met vaste kolommen). Dat maakt hem waarschijnlijk
             niet uitbuitbaar, maar wel het eerste wat je bijwerkt.
Tegenrisico: drizzle 0.44 → 0.45 is een minor; controleer de changelog. axios 1.12 → 1.16
             is niet-brekend. Express 4 → path-to-regexp 0.1.13 komt met express 4.22.
Voorstel:    pnpm up drizzle-orm@^0.45.2 axios@^1.16.0 express@^4.22.0 nanoid@^5.1.16
             en @aws-sdk/client-s3 + @aws-sdk/s3-request-presigner verwijderen uit
             package.json (nul imports — zie blok 9), wat de drie kritieke
             fast-xml-parser-adviezen in één keer laat verdwijnen.
Verificatie: pnpm audit --prod
```

### [Hoog] Een verzonnen telefoonnummer in de gestructureerde data

```
Blok:        8 (feitelijke actualiteit)
Bron:        client/src/pages/StatiegeldNederland.tsx:30
Waarneming:  "telephone": "+31-6-12345678",
             Het echte nummer, voor zover in de repo aanwezig, is 31642346115
             (Footer.tsx:69, Contact.tsx:52, Home.tsx:52).
Status:      Waargenomen
Wie raakt het: bezoeker, zoekmachine
Risico:      Dit staat in een JSON-LD-blok dat Google mag gebruiken voor het bedrijfsprofiel.
             Een plaatshoudernummer in gestructureerde data kan in zoekresultaten of in
             Google Business-suggesties terechtkomen, en bezoekers bellen dan een vreemde.
Tegenrisico: Geen.
Voorstel:    Vervangen door het echte nummer, of het veld weglaten als er geen publiek
             telefoonnummer is.
Verificatie: grep -rn "12345678" client/
```

---

# Deel 3 — Middel

Vanaf hier hou ik het per bevinding korter — de ingreep moet in verhouding blijven, en dat geldt ook voor de beschrijving ervan. Bron, waarneming en voorstel staan er wel bij.

### [Middel] De Umami-analytics is in deze build kapot

**Blok** 10 · **Bron** client/index.html:97-127, build-uitvoer · **Waarneming** de build meldt viermaal `(!) %VITE_ANALYTICS_ENDPOINT% is not defined in env variables found in /index.html`; in dist/public/index.html staat daardoor letterlijk `s.src = '%VITE_ANALYTICS_ENDPOINT%/umami'`. De browser vraagt dan een relatief pad op dat door de SPA-fallback als HTML wordt teruggegeven → scriptfout, geen meting. · **Status** Waargenomen in deze build; **Niet verifieerbaar** of de productiebuild deze env-variabelen wél zet · **Risico** een van de twee analyticskanalen levert niets · **Voorstel** de variabelen zetten, of het hele blok verwijderen als Umami niet meer gebruikt wordt — nu staan er ook nog preconnects naar plausible.io en manus-analytics.com (index.html:11-18) die naar niets lijken te wijzen.

### [Middel] GA4 wordt dubbel geladen — pageviews worden dubbel geteld

**Blok** 10 · **Bron** client/index.html:130-136 + CookieConsent.tsx:22-34 · **Waarneming** beide injecteren `gtag/js?id=G-TPCWYQL60J` en roepen beide `gtag('config','G-TPCWYQL60J')` aan. Voor wie op Accepteren klikt gebeurt dat tweemaal in dezelfde paginaweergave. · **Risico** je bezoekcijfers zijn ongeveer een factor twee te hoog voor accepterende bezoekers en normaal voor de rest — een cijfer waar je niets mee kunt. · **Voorstel** valt weg zodra de kritieke consent-bevinding is opgelost (regels uit index.html halen).

### [Middel] Er worden geen conversies gemeten

**Blok** 10 · **Bron** grep over client/src: `gtag(` komt alleen voor in CookieConsent.tsx; `umami.track` alleen in index.html met `autoTrack: 'false'` en één handmatige track na 1 seconde. · **Waarneming** geen enkel event bij: routeaanvraag (bestaat niet), telefoontje (bestaat niet), WhatsApp-klik, Wally-gesprek gestart, leaderboard-sessie gestart. · **Risico** de vraag "hoeveel bezoekers zijn er deze maand daadwerkelijk gekomen" is met de huidige inrichting **niet te beantwoorden** — er is geen enkel signaal dat correleert met een fysiek bezoek. De dichtstbijzijnde proxy is de machineteller zelf (ePortal), niet de website. · **Voorstel** drie events volstaan: WhatsApp-klik, route-klik (zodra die knop er is), en Wally-gesprek. Pas laden na toestemming.

### [Middel] YouTube-embeds laden direct, zonder nocookie en zonder lazy

**Blok** 1 en 5 · **Bron** Vinted.tsx:66-73, HoeHetWerkt.tsx:82-89, StatiegeldNederland.tsx:251-257 · **Waarneming** `src="https://www.youtube.com/embed/..."`, geen `loading="lazy"`, geen `youtube-nocookie.com`. De Maps-embeds (VillageLanding.tsx:381, VintedVillageLanding.tsx:171, InternationalLanding.tsx:206) hebben `loading="lazy"` wél — netjes. · **Risico** honderden kB en Google-trackingcookies bij paginabezoek, zonder toestemming. · **Voorstel** `loading="lazy"` toevoegen en de host vervangen door `www.youtube-nocookie.com`. Twee attributen per iframe.

### [Middel] Een hardgecodeerde Google Maps-sleutel in de bundle

**Blok** 6 · **Bron** client/src/data/villages.ts en vintedVillages.ts, 22 keer dezelfde string `AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8` · **Waarneming** deze data-bestanden worden geïmporteerd door VillageLanding/VintedVillageLanding, dus de sleutel staat in de uitgeleverde JavaScript. · **Status** Waargenomen (de sleutel staat in de bundle); **Niet verifieerbaar** of het een geldige sleutel is of een plaatshouder — ik kon geen request naar Google doen · **Risico** twee scenario's, beide de moeite waard: is de sleutel echt en niet beperkt tot repayz.nl, dan kan iedereen hem gebruiken op jouw factuur; is hij níét geldig, dan tonen alle 22 kaartinsluitingen op de dorps- en Vinted-pagina's een foutmelding in plaats van een route. · **Voorstel** controleer in de Google Cloud Console of deze sleutel bestaat, en zo ja: HTTP-referrer-restrictie op `repayz.nl/*`. Zo nee: vervang de embeds door een gewone link naar Google Maps Directions, dat werkt zonder sleutel.

### [Middel] Verlopen en tegenstrijdige claims in de vaste onderdelen

**Blok** 8 · **Bron en waarneming**
- Footer.tsx:96 — "Statiegeld verdubbelt in 2025", zichtbaar op elke pagina, onder het kopje "In het Nieuws". Het is augustus 2026.
- Contact.tsx:88 — "Binnenkort open", terwijl Header, Home en /locatie een draaiende machine met live teller tonen.
- StatiegeldInleveren.tsx:190 — "Gecertificeerd Statiegeld Nederland inleverpunt sinds 2025" (mogelijk correct, maar controleer of de certificering nog loopt).
- TrialPopup.tsx:66-70 — de pop-up die elke bezoeker ziet zegt "Proefperiode Gestart! We draaien proef!". Is dat in augustus 2026 nog zo?
- server/wally.ts:38 — "mogelijk €0,30 vanaf 2026, nog niet bevestigd" (dode code, maar het cijfer is inmiddels achterhaalbaar).

**Risico** een bezoeker die "Binnenkort open" leest, komt niet. Een nieuwsbericht uit 2025 in de footer maakt de hele site oud. · **Voorstel** vier tekstwijzigingen.

### [Middel] Geen enkele security header

**Blok** 6 · **Bron** grep over server/: geen `helmet`, geen `Content-Security-Policy`, geen `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy` of `Permissions-Policy`; geen enkele `setHeader`-aanroep. · **Status** Waargenomen in de applicatiecode; **Niet verifieerbaar** of een CDN of reverse proxy ze alsnog toevoegt — ik kon repayz.nl niet ophalen · **Risico** beperkt op een site zonder inlog voor bezoekers, maar CSP en Referrer-Policy zijn wel de goedkoopste vangnetten die er zijn. · **Voorstel** `pnpm add helmet` en `app.use(helmet({ contentSecurityPolicy: false }))` als eerste middleware; CSP daarna apart opbouwen, want de inline scripts (analytics, en het manus-runtime-script zolang dat er staat) hebben een nonce of hash nodig.

### [Middel] 3.009 bronpad-attributen in de productiebundle

**Blok** 1 en 6 · **Bron** vite.config.ts:9 (`jsxLocPlugin()`), gemeten in dist/public/assets/*.js · **Waarneming** `grep -o '"data-loc":"[^"]*"' dist/public/assets/*.js | wc -l` → 3009, met waarden als `"data-loc":"client/src/components/ui/button.tsx:53"`. Deze worden als DOM-attribuut op elementen gerenderd. · **Risico** onnodige bytes in elke chunk plus in de DOM, en je publiceert je mappenstructuur en regelnummers. · **Voorstel** valt weg met dezelfde ingreep als de kritieke bundle-bevinding: de plugin alleen in development laden.

### [Middel] De service worker cachet ook foutpagina's

**Blok** 2 · **Bron** client/public/sw.js:88-104 · **Waarneming**
```js
fetch(request).then((response) => {
  const responseToCache = response.clone();
  caches.open(CACHE_NAME).then((cache) => { cache.put(request, responseToCache); });
  return response;
})
```
Er wordt niet gecontroleerd op `response.ok` of `response.status`. Een 500 of een 404 wordt opgeslagen en later als offline-fallback geserveerd. · **Status** Waargenomen

**Belangrijk voor de vraagstelling van blok 2:** de zorg uit de auditprompt — "kan een verouderde service worker oude HTML serveren?" — **is hier grotendeels ongegrond.** HTML gaat network-first (sw.js:87), er is `skipWaiting()` bij install (regel 34) en `clients.claim()` bij activate (regel 55), en oude caches worden bij activatie opgeruimd (regels 42-52). Een online bezoeker krijgt dus altijd verse HTML. De cache-first-tak (regel 71) geldt alleen voor bestanden met een extensie `.js/.css/.webp/...`, en die hebben in de Vite-build een hash in de naam. De verklaring voor eerdere verwarring over "wat er live staat" ligt naar mijn beoordeling niet hier.

**Voorstel** één regel: `if (response.ok) { caches.open(...) }`. Overweeg daarnaast een aparte, kleine cache voor HTML met een maximum aantal entries — nu groeit hij onbegrensd met elke bezochte pagina.

### [Middel] Het manifest wijst gewone favicons aan als maskable icon

**Blok** 2 · **Bron** client/public/manifest.json:23-35 · **Waarneming** vier icon-entries, alle vier `/favicon-repayz-192.png` of `/favicon-repayz-512.png`; twee ervan met `"purpose": "maskable"`. Tegelijk bestaan `client/public/icon-maskable-192.png` (9,7 kB) en `icon-maskable-512.png` (44 kB) en worden die nergens genoemd. · **Risico** Android snijdt maskable-iconen bij tot een cirkel/afgeronde vorm en verwacht daarom ~20% veiligheidsmarge rondom. Een gewoon favicon wordt zo aangesneden: het geïnstalleerde app-icoon ziet er verminkt uit. · **Voorstel** de twee maskable-entries naar `/icon-maskable-192.png` en `/icon-maskable-512.png` laten wijzen.

### [Middel] Iedereen kan de wachtrij bezetten of andermans sessie annuleren

**Blok** 6 en 7 · **Bron** server/routers/gamification.ts:83-110 · **Waarneming** `addToQueue`, `getPendingDrop`, `getDropsHistory` en `cancelPendingDrop` zijn alle vier `publicProcedure`. `cancelPendingDrop` neemt alleen een naam aan. Er is één slot (`dropTracking.ts:20-26`) met een timeout van 15 minuten. `getDropsHistory` heeft `limit: z.number().optional().default(10)` zonder maximum, terwijl de leaderboard-route dat wél netjes doet (`.max(50)`, regel 20). · **Risico** wie op de parkeerplaats staat kan zijn drop niet registreren omdat iemand anders het slot bezet houdt; of iemand annuleert de sessie van de persoon die op dat moment aan het inleveren is en claimt de items. Elke `addToQueue` kost bovendien een LLM-aanroep voor de naamfilter, dus dit is ook een kostenkraan. · **Voorstel** `.max(100)` op de limit; een annuleertoken teruggeven bij addToQueue in plaats van op naam annuleren; en eenvoudige rate limiting per IP.

### [Middel] Het enige invoerveld van de site heeft geen gekoppeld label

**Blok** 3 · **Bron** client/src/components/SessionStartCard.tsx:210-217 · **Waarneming** `<label className="block ...">Jouw naam voor het leaderboard</label>` gevolgd door `<Input placeholder="Bijv. Jan, ..." />` — geen `htmlFor`, geen `id`. In de hele client is dit de enige losse `<label>` en er is geen enkele met `htmlFor`. De foutmelding erboven (:200-206) is niet via `aria-describedby` aan het veld gekoppeld en staat niet in een live region. · **Risico** een schermlezer leest een naamloos tekstveld voor; de foutmelding "Ongepaste naam" wordt niet aangekondigd. · **Voorstel** `<label htmlFor="drop-name">` + `<Input id="drop-name" aria-describedby="drop-name-error" />` en `role="alert"` op de foutdiv.

### [Middel] Sessiecookie met SameSite=None zonder CSRF-bescherming

**Blok** 6 · **Bron** server/_core/cookies.ts:42-47 · **Waarneming** `{ httpOnly: true, path: "/", sameSite: "none", secure: isSecureRequest(req) }`. De domeinlogica erboven (regels 27-40) is uitgecommentarieerd. · **Risico** twee kanten. Ten eerste laat SameSite=None de cookie meegaan bij cross-site requests, zonder dat er ergens een CSRF-token is; tRPC's JSON-content-type biedt beperkte bescherming, maar het is geen bewuste keuze. Ten tweede: als de reverse proxy geen `x-forwarded-proto` zet, wordt `secure` false — en een cookie met `SameSite=None` zonder `Secure` wordt door elke moderne browser gewéigerd, waardoor inloggen stilzwijgend stopt te werken. · **Voorstel** `sameSite: "lax"` tenzij er een aantoonbare cross-site-flow is (bijv. de OAuth-callback — controleer dat eerst), en `app.set('trust proxy', 1)` in server/_core/index.ts.

### [Middel] Twee derde van de codebase staat buiten de typecontrole

**Blok** 9 · **Bron** `grep -rl "@ts-nocheck" client/src server shared | wc -l` → 112, van 166 .ts/.tsx-bestanden · **Waarneming** `npx tsc --noEmit` eindigt met exitcode 0. Dat is misleidend: App.tsx, main.tsx, Home.tsx, Header.tsx, WallyChat.tsx, CookieConsent.tsx en AdminDashboard.tsx staan er allemaal in. · **Risico** `pnpm check` in CI geeft groen licht terwijl typefouten in juist de belangrijkste bestanden niet worden gezien. · **Voorstel** niet in één keer oplossen. Verwijder `@ts-nocheck` uit één bestand per keer, te beginnen bij de bestanden die feiten bevatten (Header, Home, Locatie, wallyChat), en repareer wat eruit komt.

### [Middel] Verzonnen cijfers als fallback

**Blok** 8 · **Bron** client/src/pages/Home.tsx:39 (`useState(10023)`), server/routers/machine.ts:16-21 (`total: 1869, bottles: 1200, cans: 669`) · **Waarneming** "Initial value to prevent layout shift" — de homepage toont 10.023 "Items Gerecycled" totdat de echte data binnen is, en blijft dat tonen als die nooit komt. · **Risico** een concreet getal dat niets meet, prominent in de hero. · **Voorstel** een skeleton of een leeg blok van dezelfde hoogte gebruiken tegen layout shift, in plaats van een getal.

### [Middel] Geen responsive afbeeldingen; de helft mist afmetingen

**Blok** 1 · **Bron** geteld over client/src: 17 `<img>`-tags, waarvan 9 met `width=`, 2 met `loading="lazy"`, 17 met `alt` (allemaal — dat is goed), 0 met `srcSet` of `<picture>` · **Waarneming** het headerlogo (Header.tsx:106) is `h-28 md:h-44` — 112 px hoog op mobiel, 176 px op desktop — en wordt in beide gevallen als hetzelfde bestand geladen. · **Risico** mobiele bezoekers halen desktopafbeeldingen op; 8 afbeeldingen zonder afmetingen veroorzaken layout shift terwijl ze laden. · **Voorstel** `width`/`height` toevoegen waar ze ontbreken en `loading="lazy"` op alles onder de vouw. `srcset` alleen voor de zwaarste bestanden; met WebP overal is de winst beperkt.

### [Middel] Het headerlogo eet het halve mobiele scherm

**Blok** 7 · **Bron** client/src/components/Header.tsx:101, :106 · **Waarneming** `<nav className="sticky top-0 z-50 ...">` met daarin een logo van `h-28` = 112 px, plus rechts een openingstijdenblok van drie regels. · **Risico** op een telefoon van ~660 px zichtbare hoogte is dat ruim een zesde, permanent, op elke pagina — precies de ruimte die je nodig hebt om "waar, wanneer, hoeveel" boven de vouw te krijgen. · **Voorstel** `h-14 md:h-20` op mobiel. Puur een klassewijziging; het is de goedkoopste conversieverbetering in deze lijst.

### [Middel] Dode code en ongebruikte afhankelijkheden

**Blok** 9 · **Bron** import-analyse over client/src en package.json · **Waarneming**
- Componenten die nergens worden geïmporteerd: `AIChatBox.tsx`, `ManusDialog.tsx`, `DashboardLayout.tsx` (+ `DashboardLayoutSkeleton.tsx`, alleen daardoor gebruikt), `home/GameOnPreview.tsx`, `SchemaOrg.tsx`, `Map.tsx`.
- `SchemaOrg.tsx` is bijzonder: het bevat een complete `openingHours = "Mo-Su 10:00-21:00"`-definitie (regel 21) en een adres, maar wordt niet gerenderd. Wie daar de openingstijden aanpast, verandert niets.
- `@aws-sdk/client-s3` en `@aws-sdk/s3-request-presigner`: nul imports in de hele codebase.
- `streamdown` wordt alleen door het dode `AIChatBox.tsx` gebruikt en sleept `mermaid` (11.12.0) en `dompurify` (3.3.0) mee — samen goed voor het leeuwendeel van de openstaande audit-adviezen.
· **Voorstel** de zes bestanden verwijderen en `pnpm remove @aws-sdk/client-s3 @aws-sdk/s3-request-presigner streamdown`.

### [Middel] De statische SEO-HTML-generatie zit niet in het buildproces

**Blok** 9 · **Bron** package.json:8 (`"build": "vite build && esbuild ..."`), scripts/generate-all-seo-pages.mjs · **Waarneming** het script leest `dist/public/sitemap.xml` en `dist/public/index.html` en schrijft per route een eigen HTML-bestand — maar het wordt door geen enkel npm-script aangeroepen. Ook `add-canonical-tags.mjs` en `generate-seo-pages.mjs` niet. · **Risico** of de gegenereerde bestanden ontbreken in productie, of ze zijn van een oudere build en bevatten dus verouderde meta én een verouderde verwijzing naar hash-bestandsnamen. Welke van de twee kan ik van hieruit niet zien. · **Voorstel** als deze stap nodig is: aan `build` toevoegen. Als hij overbodig is geworden: de drie scripts verwijderen, zodat niemand denkt dat ze draaien.

### [Middel] Geen enkele test bewaakt een feit

**Blok** 9 · **Bron** server/recycling.test.ts, server/wallyChat.test.ts, server/eportal-auth.test.ts, server/auth.logout.test.ts · **Waarneming** vier testbestanden, elf tests, allemaal rookproeven die live diensten aanroepen (de LLM, de ePortal-API). Er is geen test die faalt als iemand de openingstijden in één van de acht plaatsen wijzigt, als een tarief afwijkt, als het adres verandert, of als de chatbotprompt iets anders beweert dan de site. · **Voorstel** één testbestand met vier assertions tegen een gedeelde feitenbron is genoeg om de kritieke bevinding over openingstijden voorgoed te voorkomen. Dat is de enige test die deze site echt nodig heeft.

### [Middel] Geen skip-link, en een koppenniveau wordt overgeslagen

**Blok** 3 · **Bron** grep over App.tsx en Header.tsx: geen `skip`-link, geen `sr-only`-navigatielink. client/src/pages/Locatie.tsx:36 (`<h1>`) → :72 (`<h3>`), zonder `<h2>` ertussen. 10 van de 18 pagina's gebruiken `<main>`. · **Risico** een toetsenbordgebruiker moet op elke pagina door de volledige navigatie tabben; de koppenhiërarchie is voor schermlezers de inhoudsopgave. · **Voorstel** één skip-link bovenaan App.tsx en `<h3>` → `<h2>` op Locatie.

---

# Deel 4 — Laag

| # | Bevinding | Bron | Voorstel |
|---|---|---|---|
| L1 | "Get Payed" — spelfout in de grootste kop van de site en in de content-bron | Home.tsx:84, content.json:3 (manifest.json:2 heeft wél "Get Paid") | "Get Paid" |
| L2 | `text-navy-900` is nergens gedefinieerd — Tailwind genereert niets, de kop erft de standaardkleur | Locatie.tsx:36, :72 (2 keer) | `text-[#1a3a52]` |
| L3 | `font-display: optional` met preload voor alleen 600 en 700 — gewichten 400 en 500 vallen op trage verbindingen stil terug op de systeemfont, wat gemengde typografie geeft | index.css:5-35, index.html:26-27 | of ook 400 preloaden, of `swap` gebruiken |
| L4 | De menuknop op mobiel mist `aria-expanded` en `aria-controls`; het label "Toggle menu" is Engels in een Nederlandse interface | Header.tsx:167-173 | twee attributen, label "Menu openen"/"Menu sluiten" |
| L5 | `content.json` bevat het plaatshoudernummer "+31 6 12345678" en wordt alleen door het admin-dashboard gelezen | content.json:15 | echte waarde, of het bestand verwijderen |
| L6 | Preconnects naar plausible.io en manus-analytics.com terwijl er geen enkele verwijzing naar die diensten in de code staat | index.html:11-12, :15-16 | verwijderen — een preconnect naar een ongebruikte host kost een DNS- en TLS-handshake |
| L7 | `console.log`/`console.error` blijven in productie staan, inclusief `[SW]`-logs bij elke paginalading | sw.js:22, :26, :39, main.tsx:74, App-brede query-error-logs in main.tsx:30, :38 | esbuild `drop: ['console']` in de productiebuild |
| L8 | `prefers-reduced-motion` wordt gerespecteerd voor animaties en transities, maar `scrollIntoView({ behavior: 'smooth' })` in de chat niet | index.css:258-265, WallyChat.tsx:22 | conditie op de mediaquery |

---

# 1. Top 5 op impact

**1. De contact-e-mail repareren** — `Contact.tsx:70`. Eén regel. Op dit moment gaat elke e-mail van de site, inclusief elke zakelijke aanvraag van horeca of een vereniging, naar een adres dat niet van REPAYZ lijkt te zijn, terwijl de knop "info@repayz.nl" zegt. Van alles in dit rapport is dit de goedkoopste reparatie met het meest directe verlies eronder.

**2. Uitzoeken welke openingstijden kloppen en de andere zes plekken corrigeren.** Op dit moment vertelt de site in vijf talen tegelijk twee verschillende dingen, en geeft hij aan Google op de dorpspagina's een schema door dat de eigen pagina tegenspreekt. Iemand die op zondag met een volle auto komt voorrijden, komt niet terug. Dat weegt zwaarder dan alles wat hierna komt.

**3. `vitePluginManusRuntime` uit de productiebuild halen.** Drie regels in `vite.config.ts`. De HTML gaat van 374 kB naar ongeveer 5 kB en elke pageview scheelt ~107 kB gzip aan render-blokkerende bytes. Voor de doelgroep van deze site — mobiel, buiten, mogelijk 4G — is dit veruit de grootste prestatiewinst die er te halen valt, en het verklaart naar alle waarschijnlijkheid de PageSpeed-scores van 67-79 die al in de repo staan. Het lost meteen de 3.009 `data-loc`-attributen op.

**4. Google Analytics uit `index.html` halen.** Zeven regels verwijderen. `CookieConsent.tsx` doet het al correct; het probleem is dat de index.html hem daarvoor al onvoorwaardelijk laadt. Dit is de enige bevinding in dit rapport waar een klacht bij de Autoriteit Persoonsgegevens realistisch is, en hij wordt verergerd doordat je eigen privacyverklaring letterlijk het tegenovergestelde belooft.

**5. De machinestatus-fallback op "onbekend" zetten.** `machine.ts:151-160`. Nu is de storingstoestand groen. De hele belofte van de site — "kijk of het de moeite is om te rijden" — draait om dat ene bolletje in de header, en juist als het misgaat liegt het.

Wat ik bewust **niet** in deze vijf zet: de contrastbevinding en de toegankelijkheid van de chatbot en de pop-up. Die zijn juridisch reëel onder de European Accessibility Act en staan daarom op Hoog, maar ze kosten meer werk en raken minder direct de omzet van deze week. Doe ze in de tweede ronde, samen.

---

# 2. Alle bevindingen op ernst

| Ernst | # | Bevinding | Blok | Bron |
|---|---|---|---|---|
| Kritiek | K1 | Contact-e-mail gaat naar een vreemd iCloud-adres | 7/8 | Contact.tsx:70 |
| Kritiek | K2 | 358 kB inline script als eerste element in de body | 1 | vite.config.ts:9 → dist/public/index.html |
| Kritiek | K3 | Google Analytics laadt vóór toestemming | 5 | index.html:130-136 |
| Kritiek | K4 | Openingstijden spreken elkaar tegen (2 varianten, 5 talen) | 8/4/7 | villageFAQs.ts:52,112 e.a. |
| Hoog | H1 | Machinestatus valt terug op "operationeel" bij storing | 7/8 | machine.ts:151-160 |
| Hoog | H2 | Chatbot-endpoint publiek, ongelimiteerd, accepteert systeemrol | 6/4 | routers/wally.ts:13-16 |
| Hoog | H3 | Twee tegenstrijdige Wally-prompts; dode variant blijft staan | 4/9 | wally.ts vs wallyChat.ts |
| Hoog | H4 | Privacyverklaring dekt chatbot, GA en bezoekers-ID niet | 5 | Privacy.tsx (geheel) |
| Hoog | H5 | Persistente bezoekers-ID en A/B-tracking zonder toestemming | 5 | TrialPopup.tsx:91-105 |
| Hoog | H6 | ePortal-webhook zonder authenticatie | 6 | _core/index.ts:42-48 |
| Hoog | H7 | Accentkleur #4db8a8 = 2,40:1 — faalt AA overal | 3 | 290+ plekken in client/src |
| Hoog | H8 | Chatbot niet bruikbaar met schermlezer | 3/4 | WallyChat.tsx:88-175 |
| Hoog | H9 | Pop-up is modaal zonder dialooggedrag | 3 | TrialPopup.tsx:176-200 |
| Hoog | H10 | Geen adres op home, geen routeknop, geen `tel:` | 7 | Home.tsx, Locatie.tsx:54-79 |
| Hoog | H11 | Admin-dashboard slaat alleen op in localStorage | 9/7 | AdminDashboard.tsx:243-249 |
| Hoog | H12 | Menu gebruikt `<a href>` — volledige herlaad per klik | 1/7 | Header.tsx:134-140 |
| Hoog | H13 | Kwetsbare runtime-pakketten (drizzle, axios, path-to-regexp) | 6 | pnpm-lock.yaml |
| Hoog | H14 | Verzonnen telefoonnummer in JSON-LD | 8 | StatiegeldNederland.tsx:30 |
| Middel | M1 | Umami-analytics kapot: env-variabele niet ingevuld | 10 | index.html:97-127 |
| Middel | M2 | GA4 dubbel geladen → dubbele pageviews | 10 | index.html + CookieConsent.tsx |
| Middel | M3 | Geen conversie-events | 10 | hele client |
| Middel | M4 | YouTube-embeds direct, zonder nocookie en zonder lazy | 1/5 | Vinted.tsx:66 e.a. |
| Middel | M5 | Hardgecodeerde Google Maps-sleutel in de bundle | 6 | villages.ts, vintedVillages.ts |
| Middel | M6 | Verlopen claims ("verdubbelt in 2025", "Binnenkort open") | 8 | Footer.tsx:96, Contact.tsx:88 |
| Middel | M7 | Geen enkele security header | 6 | server/ (geheel) |
| Middel | M8 | 3.009 `data-loc`-attributen in productie | 1/6 | dist/public/assets/*.js |
| Middel | M9 | Service worker cachet ook foutpagina's | 2 | sw.js:88-104 |
| Middel | M10 | Manifest wijst gewone favicons aan als maskable | 2 | manifest.json:23-35 |
| Middel | M11 | Wachtrij-endpoints publiek; annuleren op naam | 6/7 | gamification.ts:83-110 |
| Middel | M12 | Enige invoerveld zonder gekoppeld label | 3 | SessionStartCard.tsx:210-217 |
| Middel | M13 | `sameSite: "none"` zonder CSRF-bescherming | 6 | cookies.ts:42-47 |
| Middel | M14 | 112 van 166 bestanden met `@ts-nocheck` | 9 | client/src, server |
| Middel | M15 | Verzonnen fallbackcijfers (10023 / 1869) | 8 | Home.tsx:39, machine.ts:16-21 |
| Middel | M16 | Geen `srcset`; 8 van 17 afbeeldingen zonder afmetingen | 1 | client/src (17 `<img>`) |
| Middel | M17 | Headerlogo 112 px hoog op mobiel, sticky | 7 | Header.tsx:106 |
| Middel | M18 | Zes dode componenten, drie ongebruikte afhankelijkheden | 9 | zie bevinding |
| Middel | M19 | SEO-HTML-generatie zit niet in `build` | 9 | package.json:8, scripts/ |
| Middel | M20 | Geen test bewaakt een feit | 9 | server/*.test.ts |
| Middel | M21 | Geen skip-link; koppenniveau overgeslagen | 3 | App.tsx, Locatie.tsx:36→72 |
| Laag | L1-L8 | Zie tabel in deel 4 | div. | div. |

---

# 3. Wat geverifieerd goed is

Even expliciet als de rest, want dit is echt in orde bevonden en hoeft geen aandacht meer:

- **De service worker doet HTML network-first.** De wildcard-hypothese uit de auditprompt — dat een service worker verouderde openingstijden serveert aan terugkerende bezoekers — klopt hier niet. `sw.js:87` haalt HTML altijd eerst van het netwerk, `skipWaiting()` staat in install en `clients.claim()` in activate, en oude caches worden bij activatie verwijderd. Een online bezoeker krijgt verse HTML. Dat is een nulbevinding op het punt waar de meeste winst werd verwacht.
- **Alle 12 vooraf gecachte URL's in `sw.js` bestaan.** Ik heb ze stuk voor stuk gecontroleerd; `cache.addAll` zal niet in zijn geheel falen. Ook alle favicon- en font-verwijzingen uit `index.html` bestaan.
- **De sitemap bevat geen dode routes.** Alle 52 URL's in `client/public/sitemap.xml` hebben een corresponderende route in `App.tsx`. Ook alle 12 interne `href="/..."`-links in de componenten wijzen naar een bestaande route.
- **De statiegeldtarieven zijn overal consistent:** €0,15 klein / €0,25 groot / €0,15 blik, in FAQ.tsx:23 en :44, StatiegeldInleveren.tsx:468 en :513, AlgemeneVoorwaarden.tsx:86, StatiegeldNederland.tsx:367 en in de live chatbotprompt (wallyChat.ts:43-45). Geen afwijking gevonden.
- **De live Wally-prompt is inhoudelijk correct en heeft een fatsoenlijke vangnetregel.** Adres klopt, glas wordt expliciet uitgesloten met uitleg ("glas heeft wel statiegeld maar onze machine accepteert alleen PET en blik"), er is een off-topic-antwoord (:74-76) en bij twijfel wordt naar WhatsApp verwezen. Dat is beter opgezet dan gebruikelijk.
- **Alle 17 `<img>`-tags hebben een `alt`-attribuut**, en de teksten zijn beschrijvend, niet leeg of generiek.
- **Geen enkele `<div onClick>` in de hele codebase.** Er wordt consequent `<button>` en `<a>` gebruikt waar geklikt wordt — de meest voorkomende semantiekfout is hier niet gemaakt.
- **`prefers-reduced-motion` wordt gerespecteerd** (index.css:258-265), en met `!important`, wat ook de inline-style-animaties in Home.tsx:96-105 overrulet. Dat is bewust goed gedaan.
- **De Maps-iframes hebben `loading="lazy"`, een `title` en `referrerPolicy`** (VillageLanding.tsx:381-383 e.a.). De OSM-iframe op /locatie heeft ook een `title`. Alleen de YouTube-embeds missen lazy.
- **De code-splitting werkt.** De bouw levert 60+ chunks; zware pagina's zoals AdminDashboard (42 kB) en ApiDebug (60 kB) zitten niet in de initiële load. `villageFAQs` (46 kB) en `internationalTranslations` (22 kB) worden alleen op hun eigen pagina's geladen. De initiële JS voor `/` is ~536 kB ruw / ~158 kB gzip, wat voor een React-site normaal is. **De bundle is niet het probleem — de HTML-shell is het probleem.**
- **De adminroutes controleren wél de rol.** Hoewel `adminProcedure` ongebruikt blijft, doet elke adminroute in `routers/admin.ts` en `routers/machine.ts` een expliciete `ctx.user?.role !== 'admin'`-check. Dat het `/admin`-scherm zonder inlog rendert is daardoor cosmetisch, niet gevaarlijk: de data komt er niet.
- **De sessiecookie is `httpOnly`** (cookies.ts:43).
- **`robots.txt` blokkeert `/admin`, `/api-debug` en `/api/`** en verwijst naar de sitemap.
- **De leaderboard-limiet is netjes begrensd** (`.min(1).max(50)`, gamification.ts:20) en de naamfilter kent een lengtecontrole vóór de LLM-aanroep (nameFilter.ts:18-24).

---

# 4. Wat ik niet kon vaststellen

| Wat | Waarom | Wat het zou veranderen |
|---|---|---|
| Response headers in productie (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | Uitgaand HTTPS geblokkeerd in deze omgeving: `curl https://repayz.nl/` → `CONNECT tunnel failed, response 403` | Als een CDN of reverse proxy ze toevoegt, vervalt M7 volledig |
| Of alle externe links nog leven | 10 hosts geprobeerd (scooter-point.com, sociaalhuisoisterwijk.nl, statiegeldnederland.nl, tikkie.me, verpact.nl, en 5 socialemediaprofielen), alle 403 op de proxy | Blok 8 vraagt expliciet naar dode links; deze controle is niet uitgevoerd |
| Of `%VITE_ANALYTICS_ENDPOINT%` in de productiebuild wél gevuld is | Geen `.env` in de repo (terecht — hij staat in `.gitignore`) | Bepaalt of M1 een echt defect is of alleen een lokaal buildartefact |
| Of de Google Maps-sleutel geldig is | Geen verzoek naar Google mogelijk | Bepaalt of M5 een kostenrisico is of 22 kapotte kaarten |
| Wat Wally in de praktijk antwoordt op de vijf testvragen uit de opdracht | Vereist `BUILT_IN_FORGE_API_KEY` en een draaiende LLM-verbinding; die zijn er niet in deze sessie | De promptanalyse voorspelt correcte antwoorden op adres, glas en tarieven, en "Dagelijks 10:00-21:00" op de zondagvraag — maar dat is een voorspelling, geen waarneming |
| Of gesprekken met Wally worden opgeslagen, en waar | Geen opslagcode gevonden in `wallyChat.ts` of `db.ts`, maar wat de LLM-aanbieder achter `BUILT_IN_FORGE_API_URL` doet, is van hieruit onzichtbaar | Bepaalt hoe H4 (privacyverklaring) precies geformuleerd moet worden |
| Of er verwerkersovereenkomsten zijn met Google, de LLM-aanbieder en ABN AMRO | Contractuele vraag, niet in code te zien | Blok 5 vraagt ernaar; ik kan alleen vaststellen welke partijen data ontvangen |
| Of `dist/public` in productie de gegenereerde SEO-HTML bevat | Geen toegang tot de deploy | Bepaalt of M19 een echt probleem is |
| Lighthouse-veldata en een axe-scan | Vereist een draaiende productie-URL in een browser | De contrastbevinding H7 is berekend, niet gemeten; axe zou hem bevestigen en waarschijnlijk aanvullen |
| Of de teller-fallback ooit in productie is opgetreden | Geen toegang tot serverlogs (`[Machine] No backbone data available, using defaults`) | Bepaalt of H1 theorie is of dagelijkse praktijk |

---

# 5. Vragen aan de bouwer

**1. Wat zijn de werkelijke openingstijden van de REPAYZ-machine — dagelijks 10:00-21:00, of dinsdag t/m zaterdag 10:00-18:00?**
Dit bepaalt welke van de twee groepen bestanden fout is, en of de correctie de Nederlandse of de vijf internationale pagina's raakt. Zonder dit antwoord kan ik de kritieke bevinding niet oplossen, alleen benoemen. Bijvraag: is de machine buiten de openingstijden van Scooterpoint vrij toegankelijk, of is er iemand nodig? Dat verklaart mogelijk hoe de twee varianten zijn ontstaan — en dan is het antwoord "beide, maar voor verschillende dingen", wat een tekstuele oplossing vraagt en geen simpele vervanging.

**2. Wie leest `adapter-catalogus.2q@icloud.com`, en bestaat `info@repayz.nl`?**
Als het iCloud-adres een bewuste doorstuurroute is, is de bevinding alleen een cosmetisch probleem plus een privacy-inconsistentie. Als het een restant is van iets anders, is er sinds de lancering mogelijk elke zakelijke aanvraag verloren gegaan.

**3. Draait de proefperiode nog?**
De pop-up zegt "Proefperiode Gestart! We draaien proef!" tegen elke bezoeker, elke dag opnieuw. Is die voorbij, dan moet hij weg — en dan is meteen de vraag relevant hoe je hem in de toekomst uitzet, want het admin-dashboard doet dat aantoonbaar niet.

**4. Waar draait de LLM achter `BUILT_IN_FORGE_API_URL`, en worden gesprekken daar bewaard?**
Dit bepaalt of de privacyverklaring moet vermelden dat er persoonsgegevens buiten de EU worden verwerkt, en of er een verwerkersovereenkomst nodig is. Het is de enige AVG-vraag in dit rapport die ik niet uit de code kan beantwoorden.

**5. Is `AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8` een echte, actieve Google Maps-sleutel van jullie account?**
Ja → per direct een referrer-restrictie instellen. Nee → dan tonen alle 22 kaartinsluitingen op de dorps- en Vinted-pagina's op dit moment een foutmelding waar een routekaart hoort te staan, en is dat een conversieprobleem in plaats van een beveiligingsprobleem.

**6. Wordt `scripts/generate-all-seo-pages.mjs` met de hand gedraaid vóór een deploy?**
Zo ja, dan is het een handmatige stap die vergeten kan worden en hoort hij in `build`. Zo nee, dan staan er drie scripts in de repo die suggereren dat er statische HTML wordt gegenereerd terwijl dat niet gebeurt — en dan is de aanname in de auditopdracht dat deze site "server-side rendering voor crawlers" heeft, niet juist voor de code in deze repo: `server/_core/vite.ts:60-65` serveert in productie simpelweg `index.html` voor elke route.

**7. Mag `+31 6 42346115` gebeld worden, of is het uitsluitend WhatsApp?**
Bepaalt of ik een `tel:`-link mag toevoegen. De site heeft er nu geen enkele, en voor iemand die buiten bij een machine staat die niet doet wat hij verwacht, is bellen de kortste weg.

**8. Is er al een Google Search Console-koppeling, en meet je GA4 nu daadwerkelijk iets bruikbaars?**
Ik vond geen `google-site-verification`-meta in `index.html` (verificatie kan ook via DNS lopen, dus dat zegt weinig). Belangrijker: met dubbele GA4-configuratie, kapotte Umami en nul conversie-events is de vraag "hoeveel bezoekers zijn er deze maand gekomen" op dit moment niet te beantwoorden. Weten wat je wilt meten bepaalt welke van de drie problemen je eerst oplost.

---

*Einde rapport. Alle regelnummers verwijzen naar commit `ea75d46`.*
