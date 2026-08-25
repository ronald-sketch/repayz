# REPAYZ — SEO en indexering

> **Status per 19 augustus 2026: de bevindingen S1 tot en met S8 zijn opgelost en
> geverifieerd tegen productie.** De acceptatietest gaf 104 goed en 0 fout, inclusief de
> consolidatie van de internationale set van 24 naar 5 URL's. Dit document blijft staan als
> verantwoording van wat er is gevonden en waarom — niet als beschrijving van de huidige
> toestand. Draai `bash scripts/acceptatie.sh` voor de actuele stand.

**Datum:** 19 augustus 2026
**Code:** `ronald-sketch/repayz`, branch `claude/new-session-2z19uv`, HEAD `230279f`

---

## Vooraf, in één alinea

De oorspronkelijke auditopdracht zei dat de SEO-laag al gedekt was en dat ik daar niet
opnieuw moest zoeken. Dat heb ik toen gerespecteerd. Dit is die laag alsnog.

Eén ding moet je bij het lezen meenemen: van de meting die je eerder deelde weten we dat
repayz.nl per route server-side content levert, met eigen H1, canonical en og:url. **Deze
repo kan dat niet.** Waar hieronder staat dat iets in de uitgeleverde HTML ontbreekt, geldt
dat aantoonbaar voor deze code — en moet je op de live codebase nagaan of het daar is
opgelost. Bij elk punt staat hoe je dat controleert. Vier van de zeven bevindingen zitten in
de logica zelf en gelden ongeacht wie de HTML rendert.

---

## Samenvatting

Er zijn twee dingen die je ranking op dit moment het hardst raken, en geen van beide is een
kwestie van betere teksten.

**Je hreflang werkt niet.** Niet gedeeltelijk — Google zal de hele set negeren, om twee
onafhankelijke redenen die allebei in de logica zitten. Twintig internationale pagina's
hebben daardoor geen werkende taaltargeting.

**Je 42 landingspagina's zijn intern nergens aan gelinkt.** De stedendropdown die ze zou
moeten ontsluiten, rendert zijn links pas na een klik. Voor Google bestaan die links niet.
Ze staan alleen in de sitemap, en dat is de zwakste manier om een pagina te laten
ontdekken.

Daaronder ligt een strategische vraag die zwaarder weegt dan beide: 52 URL's voor één
machine op één locatie is veel oppervlak, en twintig daarvan zijn vijf pagina's in viervoud.

---

# De bevindingen

## S1 — Elke URL zegt tegen Google: ik ben de homepage

**Geldt voor: deze repo. Op de live site te controleren.**

Ik heb `npx vite build` gedraaid en in de uitgeleverde HTML gekeken:

```
<link rel="canonical" href="https://repayz.nl/" />
<title>REPAYZ - Statiegeld & Geld Verdienen met Recycling</title>
<html lang="nl"
hreflang-tags in de HTML : 0
```

En `server/_core/vite.ts:72-74` stuurt precies dat bestand voor élk pad:

```ts
app.use("*", (_req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});
```

Alle 52 URL's leveren dus identieke HTML met een canonical die naar de homepage wijst. De
juiste canonical wordt pas ná het laden door JavaScript gezet (`GlobalSEO.tsx:53-62`).

Google rendert JavaScript, dus in de tweede crawlgolf ziet hij de gecorrigeerde tag. Maar de
eerste golf ziet 52 pagina's die allemaal aangeven dat ze de homepage zijn. Dat is precies
het signaal waarmee je vraagt om ze allemaal samen te voegen.

**Controle op de live site:**
```bash
curl -s https://repayz.nl/statiegeld-udenhout | grep -o '<link rel="canonical"[^>]*>'
```
Staat daar `/statiegeld-udenhout`, dan is dit bij jullie opgelost en kun je S1 overslaan.
Staat er `https://repayz.nl/`, dan is dit het eerste wat je repareert.

## S2 — De hreflang is structureel ongeldig

**Geldt overal. Dit zit in de logica, niet in de rendering.**

Twee onafhankelijke fouten in `client/src/components/GlobalSEO.tsx:6-31`. Elk van beide is
op zichzelf genoeg om Google de hele set te laten negeren.

### (a) De verwijzingen zijn niet wederkerig

hreflang moet van twee kanten kloppen. Zegt pagina A dat B zijn Engelse variant is, dan moet
B zeggen dat A zijn Nederlandse variant is. Anders negeert Google de annotatie.

Kijk wat er staat:

| Pagina | Zegt over `nl` | Zegt over `en` |
|---|---|---|
| `/en-tilburg` | `/` | `/en-tilburg` |
| `/` | `/` | `/en` |

`/en-tilburg` wijst naar `/` als zijn Nederlandse versie. Maar `/` wijst naar `/en` als zijn
Engelse versie, niet naar `/en-tilburg`. De verwijzing komt niet terug. Dat geldt voor alle
vijftien pagina's in de clusters Tilburg, Boxtel en Den Bosch.

### (b) Vier clusters claimen dezelfde Nederlandse pagina

`/`, de Tilburg-cluster, de Boxtel-cluster en de Den Bosch-cluster geven alle vier `nl: '/'`
op. Eén URL kan niet de Nederlandse tegenhanger van vier verschillende taalgroepen zijn.
Google ziet tegenstrijdige annotaties en laat ze vallen.

### (c) En het staat niet in de HTML

Bovenop (a) en (b): de tags worden met `document.createElement` na het laden ingevoegd
(`GlobalSEO.tsx:76-92`). In de uitgeleverde HTML staan er nul. hreflang is een van de
signalen die Google het minst betrouwbaar uit gerenderde JavaScript oppikt.

**Wat dit kost:** twintig internationale pagina's zonder werkende taaltargeting. Een
Poolse zoeker in Tilburg krijgt niet de Poolse pagina voorgeschoteld, en de vijf
taalvarianten concurreren onderling in plaats van elkaar te versterken.

**Hoe het wel moet.** Elke pagina in een cluster noemt álle varianten van dat cluster,
inclusief zichzelf, en de Nederlandse tegenhanger moet per cluster uniek zijn. Nu is er geen
Nederlandse pagina voor Tilburg, Boxtel of Den Bosch — dus of je maakt die, of je laat `nl`
in die clusters weg en houdt alleen de vijf onderlinge taalverwijzingen plus een `x-default`.
Het tweede is de kleinste ingreep en meteen geldig.

## S3 — De 42 landingspagina's zijn intern niet gelinkt

**Geldt overal.**

De stedendropdown in de header (`CityDropdown.tsx`) is de enige plek die naar de dorps-,
Vinted- en taalpagina's linkt. Maar:

```tsx
const [isOpen, setIsOpen] = useState(false);   // regel 45
...
{isOpen && (                                    // regel 77 (mobiel) en 173 (desktop)
  ... <a href={`/statiegeld-${city.slug}`}>
```

De links worden pas gerenderd als iemand op de knop klikt. In de DOM die Google ziet —
zowel de initiële HTML als de gerenderde momentopname — **bestaan ze niet**. Google klikt
niet.

Ik heb het nagelopen voor een steekproef:

| Pagina | Interne verwijzingen buiten de routetabel |
|---|---|
| `/statiegeld-udenhout` | 0 |
| `/vinted-locker-boxtel` | 0 |
| `/en-tilburg` | 5 (alleen binnen de hreflang-mapping, geen echte links) |

De footer linkt naar `/statiegeld-nederland`, verder naar geen enkele landingspagina.

**Gevolg:** die 42 pagina's zijn wat in SEO-termen weespagina's heten. Ze zijn alleen via de
sitemap vindbaar. Ze krijgen geen interne linkwaarde en een lage crawlprioriteit, en Google
heeft geen enkel signaal over hun onderlinge belang.

**Ingreep, klein en effectief:** zet onderaan de homepage en onderaan elke landingspagina een
gewoon zichtbaar blok met links naar de omliggende plaatsen. Geen dropdown, geen accordeon —
platte `<a>`-links die altijd in de DOM staan. Dat is één component en het lost het volledig
op.

## S4 — Twintig internationale pagina's zijn vijf pagina's in viervoud

**Geldt overal. Dit is een strategische keuze, geen bug.**

`InternationalLanding.tsx` bouwt elke pagina uit één vertaalobject per taal. Wat er per stad
verschilt, heb ik uitgezocht:

- de stadsnaam, geïnterpoleerd in de title, de H1, de beschrijving en de keywords
- de afstandswaarde
- de kaart-URL

De volledige bodytekst — hoe het werkt, de drie stappen, de locatiesectie, de Vinted-sectie —
is identiek voor de vier steden binnen een taal. `/en`, `/en-tilburg`, `/en-boxtel` en
`/en-den-bosch` verschillen dus in een stadsnaam en een getal.

Dat is het patroon dat Google onder *scaled content* schaart: pagina's die in aantal zijn
gemaakt om op plaatsnaam-varianten te ranken, terwijl ze de bezoeker naar dezelfde
bestemming leiden. Het risico is niet meteen een handmatige maatregel; het realistische
gevolg is dat Google er één van indexeert en de rest negeert, en dat het geheel de
kwaliteitsinschatting van het domein omlaag trekt.

**Ter vergelijking, de Nederlandse dorpspagina's doen het beter.** Ik heb de verhouding
gemeten:

| | Gedeeld sjabloon | Uniek per pagina | Uniek aandeel |
|---|---|---|---|
| Dorpspagina's | 1.676 tekens | 737 tekens (route + 3 eigen FAQ's) | **30,5%** |
| Internationale pagina's | volledige body | alleen stadsnaam + afstand | **vrijwel 0%** |

De dorpspagina's hebben per stuk een eigen routebeschrijving en drie eigen FAQ-vragen. Dat
is niet veel, maar het is echte, plaatsspecifieke informatie. Dat is precies het verschil
tussen een landingspagina en een doorway.

**Advies:** breng de internationale set terug naar vijf pagina's, één per taal, en laat de
stad daarin een sectie zijn in plaats van een eigen URL. Dan werkt de hreflang ook meteen
schoon: vijf pagina's die elkaar wederkerig noemen, plus `x-default`. Wil je de stadspagina's
houden, geef ze dan hetzelfde behandeling als de dorpspagina's — een eigen routebeschrijving
en eigen FAQ's per stad, in die taal.

## S5 — Drie mechanismen schrijven dezelfde canonical

**Geldt overal.**

Er zijn drie onafhankelijke systemen die metatags beheren, en ze doen het alle drie met
directe DOM-manipulatie in een `useEffect`:

| Bestand | Verwijzingen naar canonical |
|---|---|
| `components/GlobalSEO.tsx` | 11 |
| `hooks/useSEO.ts` | 12 |
| `components/SEOHead.tsx` | 16 |

Op `Home.tsx` en `HoeHetWerkt.tsx` draaien ze alle drie op dezelfde pagina. Wie het laatst
schrijft, wint — en die volgorde hangt af van de plaats in de componentboom, niet van een
bewust besluit. Er staat bovendien `react-helmet-async` in `package.json` en het is in
`main.tsx` als provider actief, maar het beheert deze tags niet.

Dit is dezelfde soort fout als de bedrijfsfeiten die op 48 plekken stonden: geen enkele bron
van waarheid. Het werkt tot iemand er iets aan verandert.

**Ingreep:** kies er één. `GlobalSEO` is de logische keuze, want die kent de route al. Laat
`useSEO` en `SEOHead` daaraan doorgeven in plaats van zelf de DOM aan te raken.

## S6 — Het taalattribuut staat altijd op Nederlands

**Geldt voor: deze repo.**

`dist/public/index.html` bevat `<html lang="nl">`, ook voor de Bulgaarse en Oekraïense
pagina's. `GlobalSEO.tsx:96-108` corrigeert dat na het laden. Voor een crawler die niet
rendert, is elke pagina Nederlands.

Kleine bijvangst: de detectie gebruikt `location.startsWith('/en')`. Dat werkt nu, maar elke
toekomstige Nederlandse route die met `en`, `ro`, `pl`, `bg` of `ua` begint, krijgt stilzwijgend
de verkeerde taal.

## S7 — De sitemap geeft verouderde signalen

**Geldt overal.**

| Signaal | Waarde | Oordeel |
|---|---|---|
| `lastmod` | drie waarden: 2025-01-27, 2025-12-01, 2025-12-25 | **Verouderd.** Het is augustus 2026 |
| `priority` | acht verschillende waarden (0.5 t/m 1.0) | Google negeert dit sinds jaren. Ruis, geen schade |
| `changefreq` | daily/weekly/monthly/yearly | Idem, wordt genegeerd |
| Dode URL's | geen | **Goed** — alle 52 hebben een bestaande route |

Het `lastmod`-probleem is het enige dat telt. Een sitemap die zegt dat er sinds december
niets is gewijzigd, vertelt Google dat hij minder vaak hoeft langs te komen. En omdat de
datums aantoonbaar niet meebewegen met echte wijzigingen, gaat Google ze op den duur
helemaal wantrouwen.

**Ingreep:** genereer `lastmod` bij de build uit de werkelijke wijzigingsdatum, of laat het
veld weg. Een ontbrekende `lastmod` is beter dan een onjuiste.

## S8 — Google kreeg feitelijk onjuiste gestructureerde data

**Inmiddels gerepareerd in deze repo; controleer of het live ook zo is.**

Dit is de meest directe vorm van "Google krijgt verkeerde informatie", want JSON-LD voedt je
bedrijfsprofiel en rich results. Wat er stond:

| Wat Google kreeg | Waar |
|---|---|
| Openingstijden Di-Za 10:00-18:00, terwijl de pagina 10:00-21:00 toonde | `StructuredData.tsx` (homepage), `VillageLanding.tsx` |
| Een tweede blok dat **maandag en zondag als gesloten** doorgaf | `StatiegeldNederland.tsx` |
| Postcode `5061 KE` in plaats van `5061 KN` | `StructuredData.tsx` (homepage) |
| Telefoonnummer `+31-XXX-XXXXXX` | `StructuredData.tsx` (homepage) |
| Telefoonnummer `+31-6-12345678` | `StatiegeldNederland.tsx` |
| Huisnummer `20B` in plaats van `20` | overal |

Allemaal hersteld in de commits van gisteren, en er staat nu een test op die het tegenhoudt.
Maar: als Google die waarden ooit heeft opgehaald, zitten ze in zijn index tot hij opnieuw
crawlt.

**Doen na de fix:** de zes belangrijkste URL's door de Rich Results Test halen en in Search
Console een herindexering aanvragen voor de homepage en `/statiegeld-nederland`. En
controleren of je Google Business-profiel dezelfde openingstijden en hetzelfde huisnummer
heeft — dat is een aparte bron die Google zwaar weegt voor lokale zoekopdrachten.

---

# Wat geverifieerd goed is

- **Titels zijn uniek en bruikbaar.** 21 van de 22 gedefinieerde titels zijn uniek. Eén
  duplicaat (de Wally-titel). Zes zijn met 62-70 tekens iets aan de lange kant en worden in
  de zoekresultaten afgekapt, maar dat is cosmetisch.
- **De sitemap bevat geen dode URL's.** Alle 52 hebben een corresponderende route in
  `App.tsx`. Ook alle interne `href="/..."`-links wijzen naar bestaande routes.
- **`robots.txt` is verstandig.** Staat alles toe, blokkeert `/admin`, `/api-debug` en
  `/api/`, en verwijst naar de sitemap.
- **De taalcode voor Oekraïens klopt.** `ua: 'uk'` — een veelgemaakte fout die hier bewust
  goed is gedaan, met een comment erbij.
- **Er is een `x-default`**, en die wijst naar de Nederlandse versie. Correct opgezet, alleen
  onbruikbaar zolang S2 niet is opgelost.
- **De dorpspagina's hebben echte eigen inhoud**: een routebeschrijving per plaats en drie
  eigen FAQ-vragen, samen 30% van de pagina. Dat is de ondergrens van wat verdedigbaar is,
  maar het is geen doorway.
- **De Maps-iframes hebben `loading="lazy"` en een `title`.**
- **De prestatiekant is fors verbeterd.** De HTML ging van 374 kB naar 6,8 kB (gzip 107 kB →
  2,2 kB) door het bouwgereedschap uit de productiebuild te halen. Core Web Vitals zijn een
  rankingfactor, en dit was de grootste hefboom die er lag.

---

# Volgorde

**Eerst vaststellen (tien minuten, bepaalt de rest):**

Draai deze drie tegen de live site. Ze vertellen je welke bevindingen bij jullie nog spelen.

```bash
curl -s https://repayz.nl/statiegeld-udenhout | grep -o '<link rel="canonical"[^>]*>'
curl -s https://repayz.nl/en-tilburg          | grep -o 'hreflang="[^"]*" href="[^"]*"'
curl -s https://repayz.nl/pl                  | grep -o '<html[^>]*lang="[^"]*"'
```

**Dan, op volgorde van opbrengst:**

1. **De hreflang herbouwen** (S2). Dit is de enige bevinding waar twintig pagina's tegelijk
   van afhangen, en de fout zit in de logica, dus hij is live gegarandeerd ook aanwezig.
   Kleinste geldige vorm: per cluster alleen de vijf talen die elkaar wederkerig noemen, plus
   `x-default`, en `nl` weglaten zolang er geen Nederlandse stadspagina bestaat.

2. **Zichtbare interne links naar de landingspagina's** (S3). Eén component, onderaan de
   homepage en de landingspagina's, met platte links. Dit haalt 42 pagina's uit de
   weesstatus.

3. **Canonical en hreflang server-side** (S1, S6), als de live site dat nog niet doet.

4. **`lastmod` uit de build genereren of weglaten** (S7).

5. **Eén canonical-mechanisme** (S5). Geen haast, wel voorkomen dat de vorige punten later
   stilzwijgend worden overschreven.

**En het besluit dat er los van staat:**

6. **Wat doe je met de twintig internationale pagina's?** (S4) Terugbrengen naar vijf is de
   ingreep die ik zou doen. Het lost de hreflang vanzelf mee op, het haalt het
   scaled-content-risico weg, en vijf sterke pagina's ranken beter dan twintig zwakke.

---

# De vraag onder alle bevindingen

52 URL's voor één machine op één adres is veel oppervlak. De vraag is niet hoe je ze
allemaal laat ranken, maar op welke vijf zoekopdrachten je wilt winnen.

Voor een inleverpunt in Oisterwijk is dat vermoedelijk zoiets als *statiegeld inleveren
Oisterwijk*, *bulk statiegeld inleveren*, *statiegeldautomaat in de buurt*, en de
Vinted-locker. Dat zijn vier tot vijf pagina's die je écht goed kunt maken: met foto's van de
machine, de werkelijke wachttijd, wat er wel en niet in mag, en hoe het betalen gaat.

De 42 varianten daaromheen verdelen je autoriteit over pagina's die geen van alle
onderscheidend zijn. Consolideren is hier waarschijnlijk meer waard dan uitbreiden — zeker nu
de interne linkstructuur ze toch niet ondersteunt.

Dat is een advies, geen bevinding. Maar het is wel het antwoord op "hoe kom ik hoger bij
Google" dat het meeste oplevert, en het kost minder werk dan de huidige set onderhouden.

---

# Wat ik niet kon vaststellen

| Wat | Waarom |
|---|---|
| Of S1, S6 en de JSON-LD-fixes op de live site al goed staan | Uitgaand HTTPS geblokkeerd: `curl https://repayz.nl/` → `CONNECT tunnel failed, response 403`. De drie commando's hierboven beantwoorden dit in tien minuten |
| Hoe Google de pagina's nu daadwerkelijk indexeert | Vereist Search Console: dekkingsrapport, en de URL-inspectie op een dorpspagina en een internationale pagina |
| Welke zoekopdrachten nu al verkeer opleveren | Vereist Search Console. Zonder dat is elk prioriteitsadvies deels gokwerk |
| Of er backlinks zijn | Niet vanuit de code te zien |
| Of het Google Business-profiel dezelfde feiten heeft | Aparte bron, zwaar wegend voor lokale zoekopdrachten, alleen handmatig te controleren |
| Core Web Vitals in het veld | Vereist PageSpeed Insights tegen de live URL |

De eerste twee zijn de moeite waard om te halen voordat je aan punt 1 begint. Search Console
vertelt je binnen vijf minuten of je landingspagina's überhaupt geïndexeerd zijn — en als het
antwoord "nee" is, dan is dat de bevestiging dat S1 en S3 de kern van het probleem zijn.
