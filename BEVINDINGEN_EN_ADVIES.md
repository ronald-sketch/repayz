# REPAYZ — Bevindingen en advies

> **Status per 19 augustus 2026.** De SEO- en feitenbevindingen uit dit document zijn
> opgelost en geverifieerd tegen productie (acceptatietest: 104 goed, 0 fout). Wat nog
> openstaat zit in `DIEPGAAND_ONDERZOEK.md`: de ePortal-credentials in de querystring, de
> twee bronnen onder de levenstellers, GA4 dat voor toestemming laadt, en de gamification.
> Dit document beschrijft de situatie zoals aangetroffen, niet de huidige.

**Datum:** 18 augustus 2026
**Repo:** `ronald-sketch/repayz`, branch `claude/new-session-2z19uv`, HEAD `1c3c48f`
**Voorloper:** `AUDIT_BREED_2026-08-18.md` (volledige audit op `ea75d46`, 47 bevindingen)

Dit document is de stand van zaken ná de eerste herstelronde. Het zegt per bevinding
wat er is opgelost, wat er nog ligt, en in welke volgorde ik het zou aanpakken.

Alles hieronder is in deze sessie gecontroleerd tegen de code op `1c3c48f`, niet
overgenomen uit het eerdere rapport. Waar iets niet vast te stellen was, staat dat er zo bij.

---

## 0. Lees dit eerst: welke code draait er?

Dit is geen codebevinding maar het bepaalt hoe je alle andere moet lezen.

Er zijn twee waarnemingen die elkaar uitsluiten:

**Waarneming A — de code in deze repo.** Geen SSR: `server/_core/vite.ts:70-73` stuurt in
productie `index.html` voor elk pad, dus een onbekende route geeft 200 en geen 404.
`vite build` levert precies één HTML-bestand op. De drie `scripts/generate-*.mjs` worden
door geen enkel npm-script aangeroepen. Er is nul deployconfiguratie: geen `.github/`,
geen Dockerfile, geen `vercel.json`, `netlify.toml`, `wrangler.toml`, `fly.toml` of
`Procfile`. De routes `/statiegeld-wiki` en `/retourshop-xl-statiegeld` bestaan niet, er
is geen blog, en `data-server-content` komt nergens voor.

**Waarneming B — de externe meting van 18-08-2026.** Zes routes leveren route-specifieke
server-side content in `<main data-server-content="true">`, blogroutes geven
`og:type=article`, een onbekende route geeft een echte 404, en overal staat
"Sprendlingenstraat 20" en "07:00 tot 23:00".

Beide zijn waargenomen. Ze kunnen niet allebei over dezelfde code gaan: waarneming A kan
waarneming B niet produceren, en twee van de gemeten routes bestaan hier niet eens. De
commit `d5093545` is niet bereikbaar — niet lokaal, niet op de remote, en de GitHub-API
geeft `422 No commit found`. De repo heeft twee branches, beide van `ea75d46`, waarvan de
commitboodschap luidt "Initial commit - REPAYZ backup".

**Wat dat betekent voor dit document.** De herstelwerkzaamheden hieronder zijn correct
en nodig — de bevestigde bedrijfsfeiten stonden hier aantoonbaar fout. Of ze de live site
raken, hangt ervan af of deze repo de deploybron is. Zolang dat niet vaststaat, kun je
niet controleren of een fix daadwerkelijk landt.

**Advies:** stel dit als eerste vast, vóór de rest van de lijst. Het kost één handeling:
zet een herkenbare, onschuldige wijziging in deze repo, deploy zoals je gewend bent, en
kijk of hij op repayz.nl verschijnt. Verschijnt hij niet, dan is elke fix hieronder
werk aan een kopie. `SEO_DO_NOT_RECOMMEND.md v2.0`, de bron van de bevestigde feiten,
staat overigens ook niet in deze repo — dat hoort naast `shared/facts.ts` te liggen.

---

## 1. Wat is opgelost

Zeven bevindingen volledig, drie gedeeltelijk. Alles met commit en met de controle waarmee
je het zelf kunt nagaan.

### Volledig

| # | Bevinding | Commit | Controle |
|---|---|---|---|
| K1 | Contact-e-mail wees naar `adapter-catalogus.2q@icloud.com` terwijl de link `info@repayz.nl` toonde | `e182080` | `grep -rn "icloud" client/src` → leeg |
| K2 | Inline script van 366.770 bytes als eerste element in de body van elke pagina | `1c3c48f` | `npx vite build` → `index.html` 6,82 kB |
| K4 | Openingstijden in drie varianten over 48 plekken, geen enkele juist | `692a1cc` t/m `e182080` | `npx vitest run server/facts.test.ts` |
| H3 | Twee Wally-systeemprompts met verschillende feiten | `692a1cc` | `server/wally.ts` verwijderd |
| H14 | Plaatshouder-telefoonnummers in gepubliceerde JSON-LD | `c2c19e7`, `e182080` | `grep -rn "12345678\|XXX-XXXXXX" client/src` → leeg |
| M8 | 3.009 `data-loc`-attributen met bronpaden in de bundle | `1c3c48f` | `grep -o "data-loc" dist/public/assets/*.js \| wc -l` → 0 |
| M20 | Geen enkele test bewaakte een feit | `228236f` | `server/facts.test.ts`, 8 tests |

**Gemeten effect van K2 en M8**, met `npx vite build` in deze sessie, voor en na:

| | Voor | Na |
|---|---|---|
| `dist/public/index.html` | 373,94 kB | 6,82 kB |
| idem, gzip | 107,33 kB | 2,22 kB |
| `data-loc` in de bundle | 3.009 | 0 |

**Omvang van K4:** 48 openingstijdvermeldingen en 40 adresvermeldingen teruggebracht tot
één definitie in `shared/facts.ts`. Daarbij ook twee postcodefouten hersteld die niet in
het oorspronkelijke rapport stonden: `5061 KE` (3×, waarvan één in de JSON-LD op de
homepage) en `5061 JX` (1×, in de FAQ).

### Gedeeltelijk

**H10 — adres en route.** Het adres is nu overal correct en komt uit één bron. Wat nog
staat: er is geen `tel:`-link in de hele codebase (`grep -rn "tel:" client/src` → 0), geen
routeknop naar een navigatie-app, en de homepage noemt het adres nog steeds niet
(`grep -c ADDRESS client/src/pages/Home.tsx` → 0).

**M18 — dode code.** `server/wally.ts` en `ManusDialog.tsx` zijn weg. Nog dood, met nul
imports: `AIChatBox.tsx`, `DashboardLayout.tsx`, `home/GameOnPreview.tsx`, `SchemaOrg.tsx`
en `Map.tsx`. `SchemaOrg.tsx` is wel aangesloten op de feitenbron, zodat het niet opnieuw
uiteenloopt als iemand hem gaat gebruiken. In `package.json` staan nog drie ongebruikte
afhankelijkheden: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` en `streamdown`.

**L6 — dode preconnects.** De regels naar `manus-analytics.com` en `files.manuscdn.com`
zijn weg. `plausible.io` staat er nog, terwijl Plausible nergens in de code voorkomt.

### Nieuw gevonden in deze ronde

| Bevinding | Status |
|---|---|
| De JSON-LD op `/statiegeld-nederland` had een tweede openingsblok dat maandag en zondag als gesloten aan Google doorgaf | Opgelost in `228236f`. Gevonden door de nieuwe test, niet door mijzelf |
| Postcodes `5061 KE` en `5061 JX` | Opgelost in `c2c19e7` en `e182080` |
| `server/_core/vite.ts` spreadde de geïmporteerde Vite-config. Toen die een functie werd, zou dat in development stil de plugins, aliassen en root wegnemen | Opgelost in `1c3c48f`, en de dev-server end-to-end getest: HTTP 200, HMR en aliassen intact |
| Typefout in `vite.config.ts` die pas zichtbaar werd bij de pluginsplitsing | Opgelost in `1c3c48f` |

---

## 2. Wat er nog ligt

Op ernst. Alle regelnummers gecontroleerd op `1c3c48f`.

### Kritiek

**K3 — Google Analytics laadt vóór toestemming.**
`client/index.html` bevat vier `gtag`-verwijzingen, onvoorwaardelijk, buiten elke
consent-check om. `CookieConsent.tsx:22-34` laadt dezelfde scripts nogmaals, maar dán pas
na "Accepteren". Op "Weigeren" klikken verandert niets: de scripts draaien al.
`Privacy.tsx:47` en `:107` beweren het tegenovergestelde ("Alleen met uw toestemming").
Dit is de enige bevinding in dit document waar een klacht bij de Autoriteit
Persoonsgegevens realistisch is, en de onjuiste privacyverklaring maakt die kansrijker.
**Ingreep:** zeven regels uit `client/index.html` verwijderen. `CookieConsent.tsx` doet
het al goed.

### Hoog

**H1 — bij een storing meldt de site dat de machine operationeel is.**
`server/routers/machine.ts:155` geeft als fallback `status: 'operational'` terug wanneer de
backbone geen data heeft. Valt de ePortal-koppeling weg, dan staat het bolletje in de
header op groen. De hele belofte van de site — kijken of het de moeite is om te rijden —
hangt aan dat bolletje.
**Ingreep:** fallback op `'offline'`, en in de UI onderscheid maken tussen "buiten
bedrijf" en "status onbekend".

**H2 — het chatbot-endpoint is publiek, ongelimiteerd en accepteert een eigen systeemprompt.**
`server/routers/wally.ts:15` staat `role: z.enum(['system', 'user', 'assistant'])` toe. Een
client kan dus een systeembericht meesturen dat ná de echte systeemprompt wordt geplakt —
de goedkoopste vorm van promptinjectie die er is. Geen maximum op het aantal berichten,
geen maximum op de lengte, geen rate limiting, en de body-limiet staat op 50 MB
(`server/_core/index.ts:36`). Hetzelfde geldt voor `drop.addToQueue`, dat per aanroep een
LLM-call doet voor de naamfilter.
**Ingreep:** `'system'` uit de enum, `.max(2000)` op content, `.max(20)` op de array, en
een eenvoudige rate limiter per IP.

**H4 — de privacyverklaring dekt de chatbot, de analytics en het bezoekers-ID niet.**
`Privacy.tsx`, laatst bijgewerkt december 2025. Noemt Wally niet, noemt niet dat
chatberichten naar een externe LLM gaan, noemt Google Analytics niet bij naam, noemt de
persistente bezoekers-ID niet, en bevat geen bewaartermijnen, rechtsgrondslagen, doorgifte
buiten de EU of klachtroute. Regel 110 belooft dat je je cookievoorkeuren altijd kunt
aanpassen, maar zodra er een keuze in localStorage staat komt de banner nooit meer terug.
Intrekken moet even makkelijk zijn als geven (AVG art. 7 lid 3).

**H5 — persistent bezoekers-ID zonder toestemming.**
`TrialPopup.tsx:91-96` schrijft een uniek `visitorId` naar localStorage en stuurt dat naar
de server (`:316`), op elke route, 2 seconden na laden. Niet in de privacyverklaring, niet
achter de cookiebanner.

**H6 — de ePortal-webhook staat open.**
`server/_core/index.ts:46` — de authenticatiecontrole staat uitgecommentarieerd, terwijl
`verifyWebhookAuth` op regel 11 wél wordt geïmporteerd. Iedereen die het pad kent kan een
bonnetje-event posten, dat aan de openstaande wachtrijnaam wordt gekoppeld en op het
publieke leaderboard belandt.

**H7 — de accentkleur haalt het contrastminimum niet.**
`#4db8a8` op wit geeft 2,40:1. Dat faalt AA voor normale tekst (4,5), voor grote tekst
(3,0) én voor UI-componenten (3,0). De kleur staat 206× als tekstkleur en 84× als
achtergrond met witte tekst. Juist de openingstijden op `/locatie` en de dorpspagina's zijn
ermee opgemaakt, en de site wordt buiten in fel licht gebruikt. `#4ecdc4` is met 1,94:1
nog slechter. `#1a3a52` is met 11,86:1 prima.
**Ingreep:** `#4db8a8` houden als vlakkleur, een donkerder tint voor tekst
(`#2f7d70` geeft ~4,6:1), en op teal knoppen `text-white` vervangen door `text-[#0d1f2d]`.

**H8 — de chatbot is niet bruikbaar met een schermlezer.**
`WallyChat.tsx:88-175`: geen `role="dialog"`, geen focusverplaatsing bij openen of sluiten,
geen Escape, geen `aria-live` op de berichtenlijst (dus antwoorden worden nooit
aangekondigd), en de verzendknop heeft geen toegankelijke naam.

**H9 — de pop-up is een modaal venster zonder dialooggedrag.**
`TrialPopup.tsx:176-200`: geen `role="dialog"`, geen focustrap, geen Escape, en de pagina
eronder wordt niet inert. Een toetsenbordgebruiker tabt door inhoud die visueel is
afgedekt.

**H10 — geen routeknop, geen `tel:`, geen adres op de homepage.** Zie hierboven.

**H11 — het admin-dashboard slaat niets op.**
`AdminDashboard.tsx:249` — `localStorage.setItem("repayz_content", ...)`, met de opmerking
"For now, we'll save to localStorage as a demo". Wie hier de openingstijden of het
WhatsApp-nummer aanpast, verandert alleen iets in de eigen browser.

**H12 — elke menuklik herlaadt de hele applicatie.**
`Header.tsx` gebruikt 13× `<a href="/...">` in plaats van wouter's `Link`. Elke klik gooit
de SPA weg en haalt alles opnieuw op. Nu de HTML van 374 kB naar 6,8 kB is, doet dit
minder pijn dan eerst, maar het blijft onnodig.

**H13 — verouderde pakketten met bekende kwetsbaarheden.**
Relevant voor de draaiende server: `drizzle-orm 0.44.6` (SQL-injectie-advies, verholpen in
0.45.2), `axios 1.12.2` (reeks prototype-pollution- en proxylek-adviezen, 1.16.0),
`path-to-regexp 0.1.12` (ReDoS, via express 4), `nanoid 5.1.6`. Het verwijderen van de
twee ongebruikte AWS-SDK's laat meteen drie kritieke `fast-xml-parser`-adviezen vervallen.

### Middel

| # | Bevinding | Bron |
|---|---|---|
| M1 | Umami-analytics kapot: `%VITE_ANALYTICS_ENDPOINT%` wordt niet ingevuld, de build waarschuwt er vier keer over | `client/index.html`, buildlog |
| M2 | GA4 dubbel geladen → dubbele pageviews voor wie accepteert | `index.html` + `CookieConsent.tsx` |
| M3 | Geen conversie-events. De vraag "hoeveel bezoekers zijn er deze maand gekomen" is niet te beantwoorden | hele client |
| M4 | YouTube-embeds zonder `loading="lazy"` en zonder `youtube-nocookie`, dus Google-cookies bij paginabezoek | `Vinted.tsx:66`, `HoeHetWerkt.tsx:82`, `StatiegeldNederland.tsx:251` |
| M5 | Hardgecodeerde Google Maps-sleutel in de bundle, 22×. Echt en onbeperkt → kostenrisico; ongeldig → 22 kapotte kaarten | `villages.ts`, `vintedVillages.ts` |
| M6 | "Statiegeld verdubbelt in 2025" in de footer op elke pagina; "Binnenkort open" op `/contact` terwijl de machine draait | `Footer.tsx:96`, `Contact.tsx:90` |
| M7 | Geen enkele security header: geen helmet, geen CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy` of `Permissions-Policy` | `server/` |
| M9 | De service worker cachet responses zonder statuscontrole, dus ook 404's en 500's | `sw.js:96` |
| M10 | Het manifest wijst gewone favicons aan als `maskable`, terwijl `icon-maskable-192/512.png` bestaan en nergens worden genoemd | `manifest.json` |
| M11 | Wachtrij-endpoints publiek: iedereen kan het enige slot bezetten of andermans sessie op naam annuleren | `gamification.ts:83-110` |
| M12 | Het enige invoerveld van de site heeft een `<label>` zonder `htmlFor` en geen `id` | `SessionStartCard.tsx:210-217` |
| M13 | `sameSite: "none"` op de sessiecookie zonder CSRF-bescherming | `cookies.ts:45` |
| M14 | 111 van 166 bestanden met `@ts-nocheck`. `tsc --noEmit` is groen maar zegt weinig | client + server |
| M15 | Verzonnen fallbackcijfers: 10.023 "Items Gerecycled" in de hero, 1.869 op de server | `Home.tsx:39`, `machine.ts:17` |
| M16 | Geen `srcset`; 8 van 17 afbeeldingen zonder afmetingen, 15 van 17 zonder lazy | client |
| M17 | Headerlogo `h-28` = 112 px hoog op mobiel, sticky, op elke pagina | `Header.tsx:106` |
| M18 | Vijf dode componenten en drie ongebruikte afhankelijkheden | zie hierboven |
| M19 | De SEO-HTML-generatie zit niet in `pnpm build` | `package.json:8` |
| M21 | Geen skip-link; koppenniveau overgeslagen op `/locatie` (h1 → h3) | `App.tsx`, `Locatie.tsx` |

### Laag

`L1` "Get Payed" in de grootste kop van de site (`Home.tsx:84`) en in `content.json`, terwijl
`manifest.json` wél "Get Paid" heeft · `L2` `text-navy-900` is nergens gedefinieerd, dus
die klasse doet niets (`Locatie.tsx`, 2×) · `L3` `font-display: optional` met preload voor
alleen 600 en 700 · `L4` de mobiele menuknop mist `aria-expanded`, en het label "Toggle
menu" is Engels · `L5` `content.json` wordt alleen door het admin-dashboard gelezen ·
`L6` preconnect naar `plausible.io` terwijl Plausible nergens voorkomt · `L7`
`console.log` blijft in productie staan · `L8` `scrollIntoView({ behavior: 'smooth' })`
negeert `prefers-reduced-motion`.

---

## 3. Advies: in welke volgorde

Niet op ernst gesorteerd maar op verhouding tussen opbrengst en moeite, met de
afhankelijkheden erin.

### Eerst, en los van al het andere

**Stel vast of deze repo de deploybron is.** Zie deel 0. Zonder dat antwoord weet je van
geen enkele fix hieronder of hij aankomt. Eén deploy met een herkenbare wijziging volstaat.

### Ronde 1 — een middag, alles klein en zelfstandig

1. **GA4 uit `index.html`** (K3). Zeven regels weg. Enige juridisch scherpe punt in de
   lijst, en het lost meteen M2 op.
2. **Machinestatus-fallback op "offline"** (H1). Een paar regels in `machine.ts`. Raakt
   direct of iemand voor niets rijdt.
3. **Chatbot-endpoint dichtzetten** (H2). `'system'` uit de enum, maxima op lengte en
   aantal. De rate limiter mag later.
4. **Webhook-auth aanzetten** (H6). Vier regels uit het commentaar halen — mits ePortal een
   auth-header kan sturen; controleer dat eerst.
5. **Verlopen teksten** (M6). "Statiegeld verdubbelt in 2025" en "Binnenkort open" weg.
   Twee tekstwijzigingen, en ze maken de site meteen minder oud.
6. **`pnpm up`** voor `drizzle-orm`, `axios`, `express`, `nanoid`, plus
   `pnpm remove @aws-sdk/client-s3 @aws-sdk/s3-request-presigner streamdown` (H13, M18).

### Ronde 2 — conversie op mobiel

7. **Routeknop, `tel:`-link en het adres op de homepage** (H10). Dit is de kernfunctie van
   de site voor iemand met een volle kofferbak, en die ontbreekt nu volledig. Hangt op één
   antwoord: mag `+31 6 42346115` gebeld worden? Zo ja, dan kan `CONTACT.telephone` in
   `shared/facts.ts` gevuld worden en verschijnt het nummer meteen ook weer in de JSON-LD.
8. **Headerlogo kleiner op mobiel** (M17). Eén klassewijziging, en het scheelt een zesde
   van het scherm op elke pagina.
9. **Menu via wouter's `Link`** (H12).

### Ronde 3 — toegankelijkheid, in één blok

10. **Contrast** (H7), **chatbot** (H8), **pop-up** (H9), **label** (M12), **skip-link en
    koppen** (M21). Doe deze samen: het is één onderwerp, één testronde, en de European
    Accessibility Act geldt sinds juni 2025 voor een publieksdienst. Draai er daarna één
    axe-scan overheen — die vindt in tien minuten dingen die geen enkel taalmodel
    betrouwbaar ziet.

### Ronde 4 — privacy en meten, samen

11. **Privacyverklaring bijwerken** (H4) en **het bezoekers-ID** (H5) tegelijk met een
    knop "Cookievoorkeuren wijzigen" in de footer. Dat lost het intrekkingsprobleem op.
12. **YouTube naar `youtube-nocookie` met lazy** (M4) hoort in dezelfde ronde: het is
    zowel een privacy- als een prestatiepunt.
13. **Umami repareren of verwijderen** (M1) en **drie conversie-events** (M3). Zolang je
    niets meet, kun je geen enkele verbetering hierboven bevestigen. Dat is een argument
    om het niet als laatste te doen.

### Wanneer je tijd hebt

Security headers (M7), de service worker (M9), het manifest (M10), de wachtrij-endpoints
(M11), `sameSite` (M13), afbeeldingen (M16), dode code (M18), de buildstap (M19), en de
`@ts-nocheck`-schuld (M14). Die laatste niet in één keer: haal het per bestand weg, te
beginnen bij de bestanden die feiten bevatten.

**Het admin-dashboard (H11)** staat bewust apart. De kleinste eerlijke ingreep is nu een
zichtbare waarschuwing dat opslaan alleen lokaal werkt. Een echte opslagroute bouwen is
geen middag werk, en zolang `shared/facts.ts` de feiten draagt, is de urgentie kleiner
geworden.

---

## 4. Wat de nieuwe test wel en niet vangt

`server/facts.test.ts` faalt zodra iemand huisnummer 20B, een 5061-postcode die niet KN is,
een verboden openingstijdvariant, of een losse `HH:MM` die niet 07:00 of 23:00 is in
`client/src`, `server`, `shared` of `content.json` zet. Regels die expliciet "Scooterpoint"
noemen zijn vrijgesteld voor tijden, niet voor adres of postcode — dat delen ze. Er zit een
vangnet in dat faalt als de scan minder dan 50 bestanden vindt.

Ik heb hem gecontroleerd door `20B` en `10:00 tot 21:00` terug te zetten in `Locatie.tsx`:
beide regels sloegen aan, met bestand, regelnummer en de gevonden tekst.

**Wat hij niet vangt:** tarieven, het e-mailadres en het telefoonnummer. Die zitten wel in
`shared/facts.ts` maar hebben nog geen verbodsregel, omdat er geen lijst van verboden
varianten voor bestaat. Als er ooit een fout tarief opduikt, is dat de plek om een regel
bij te zetten.

---

## 5. Wat ik niet kon vaststellen

| Wat | Waarom |
|---|---|
| Response headers in productie | Uitgaand HTTPS geblokkeerd: `curl https://repayz.nl/` → `CONNECT tunnel failed, response 403` |
| Of de externe links nog leven | Tien hosts geprobeerd, alle 403 op de proxy |
| Of de Google Maps-sleutel geldig is | Geen verzoek naar Google mogelijk |
| Wat Wally in de praktijk antwoordt | Vereist `BUILT_IN_FORGE_API_KEY`; niet aanwezig in deze omgeving |
| Of gesprekken met Wally worden bewaard | Geen opslagcode in `wallyChat.ts` of `db.ts`, maar wat de aanbieder achter `BUILT_IN_FORGE_API_URL` doet is van hieruit onzichtbaar |
| Of `%VITE_ANALYTICS_ENDPOINT%` in de echte build wel gevuld is | Geen `.env` in de repo, terecht |
| Lighthouse-veldata en een axe-scan | Vereist een draaiende productie-URL in een browser |
| Of de herstelde feiten daadwerkelijk live komen | Zie deel 0 |

---

## 6. Vragen die nog open staan

1. **Is deze repo de deploybron van repayz.nl?** Bepaalt of al het bovenstaande werk
   effect heeft. Zie deel 0 voor de goedkoopste manier om het te toetsen.
2. **Mag `+31 6 42346115` gebeld worden, of is het uitsluitend WhatsApp?** Zo ja, dan vul
   ik `CONTACT.telephone` in `shared/facts.ts` en komen de `tel:`-link en het
   JSON-LD-telefoonnummer er meteen bij. Nu staat het veld op `null` met een
   TE BEVESTIGEN-notitie, en wordt het uit de JSON-LD weggelaten — beter geen nummer dan
   een plaatshouder.
3. **Wat zijn de werkelijke coördinaten van de machine?** In de oude code stonden twee
   verschillende paren met de notitie "Update with actual coordinates". Ik heb het paar
   aangehouden dat daadwerkelijk werd gerenderd (51.5783 / 5.1889), gemarkeerd als
   TE BEVESTIGEN in `shared/facts.ts`.
4. **Is `AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8` een echte, actieve sleutel van jullie
   account?** Ja → per direct een referrer-restrictie op `repayz.nl/*`. Nee → dan tonen 22
   kaartinsluitingen nu een foutmelding waar een route hoort te staan, en is het een
   conversieprobleem in plaats van een beveiligingsprobleem.
5. **Draait de proefperiode nog?** De pop-up zegt tegen elke bezoeker "Proefperiode
   Gestart! We draaien proef!". Zo niet, dan moet hij weg — en dat kan alleen via een
   codewijziging, want het admin-dashboard slaat niets op.
6. **Waar draait de LLM achter `BUILT_IN_FORGE_API_URL`, en worden gesprekken bewaard?**
   Bepaalt of de privacyverklaring doorgifte buiten de EU moet vermelden en of er een
   verwerkersovereenkomst nodig is.

---

## Bijlage — commits in deze sessie

| Commit | Onderwerp |
|---|---|
| `52f6143` | Auditrapport toegevoegd |
| `1bfd9aa` | `shared/facts.ts` als enige feitenbron |
| `692a1cc` | Wally leest uit de bron; dode `server/wally.ts` verwijderd |
| `c2c19e7` | Componenten en `useOpeningHours` aangesloten |
| `835ad6f` | Databestanden aangesloten |
| `e182080` | Elf pagina's, `content.json`, en de contact-e-mail hersteld |
| `228236f` | `server/facts.test.ts` |
| `1c3c48f` | Manus-bouwgereedschap uit de productiebuild |

**Stand van de controles op `1c3c48f`:** `tsc --noEmit` schoon, `vite build` schoon,
esbuild-serverbundel schoon, `facts.test.ts` 8/8 groen. Van de volledige testsuite zijn 3
van de 19 rood: `eportal-auth`, `wallyChat` en de `wally.chat`-test in `recycling.test.ts`.
Dat zijn rookproeven die live diensten aanroepen; ze falen hier bij gebrek aan credentials
en faalden ook vóór de eerste commit van deze sessie.
