> ## AFGEHANDELD — meting 25 augustus 2026, 07:55 UTC
>
> De acceptatietest tegen productie geeft **103 goed, 1 fout**. Het herstel is klaar:
> sitemap op 86 URL's met `lastmod` van vandaag, alle twintig redirects op 301,
> `/ro` `/bg` `/ua` op 200 met zeven wederkerige hreflang-tags, server-side rendering,
> canonicals, `lang`, JSON-LD en de bedrijfsfeiten allemaal groen.
>
> De verwachting in deel A3 dat de secties 12, 13 en 14 rood zouden zijn, klopte niet.
> Ze zijn groen. **Deel C hoeft niet meer uitgevoerd te worden.**
>
> Eén nieuwe fout, die niet uit de rollback komt maar uit de migratie: onbekende
> routes geven **503 in plaats van 404**. Zie `OPDRACHT_404_NA_MIGRATIE.md`.
>
> Wat wél nog staat: **deel H**. Het server-side werk hoort in de repo.

---

# Herstelopdracht — alles wat er sinds 18 augustus is gedaan

**Voor:** Manus
**Van:** Ronald
**Datum:** 25 augustus 2026
**Aanleiding:** Manus heeft een gegevensmigratie moeten uitvoeren op grond van
overheidsregels. Daarbij is de publicatie teruggezet naar het checkpoint van
**woensdag 19 augustus, 20:30**. Er was geen onafhankelijke back-up van de staat
daarna, dus alles wat na dat moment is gepubliceerd, is uit de lucht.

Dit is geen verwijt en vraagt geen verklaring. Het is een gegeven waar deze opdracht
mee begint.

---

## Wat dit document is

Een volledige inventaris van het werk dat sinds 18 augustus aan repayz.nl is gedaan,
zodat je precies kunt zien wat er hersteld moet worden en wat niet.

Lees het in deze volgorde. Deel A vertelt je wat je moet meten voordat je iets
aanraakt. Deel B is werk dat **niet** verloren is gegaan. Deel C is werk dat
**wel** verloren kan zijn. Deel D is de maatstaf waaraan het af is.

## Goed nieuws vooraf: de schade is beperkt

Het afkappunt is woensdag 19 augustus 20:30. Als je de tijdlijn daar doorheen legt,
valt het meeste werk aan de veilige kant:

| Wanneer | Wat | Weg? |
|---|---|---|
| di 18-08 22:49 → wo 19-08 20:19 | Bedrijfsfeitenbron, testen, tijdzonefix, buildopschoning — **plus al het server-side SEO-werk**: rendering, canonical, `lang`, hreflang, JSON-LD | **Nee.** Vóór het afkappunt. |
| wo 19-08 20:43 → 22:46 | De acceptatietest afgemaakt, de werkopdracht geschreven | **Nee.** Staat in git. |
| ná wo 19-08 | De internationale samenvoeging: `/ro` `/bg` `/ua`, de 20 redirects, de sitemapopschoning | **Ja.** Dit is wat opnieuw moet. |

De stand op woensdagavond, gemeten met dezelfde test, was **78 goed / 0 fout** — dat
waren de secties 1 tot en met 11. De secties 12, 13 en 14 gingen over de samenvoeging,
en die is daarna pas uitgevoerd. Daarna werd het 104/0.

**Verwachting, te toetsen met de meting in deel A:** de secties 1-11 zijn nog groen en
alleen 12, 13 en 14 zijn rood. Dat past ook bij wat je ziet — de sitemap staat weer op
ruim 100 URL's in plaats van de samengevoegde toestand.

Is dat zo, dan hoef je alleen deel C3, C4 en het `/ro` `/bg` `/ua`-deel van C1 te doen.
De rest van deel C staat er dan gewoon nog. **Meet eerst, bouw daarna.**

## Waarom het server-side werk niet in git staat

Ik heb deze repo nagelopen. Er staat hier geen enkele 301-redirect, geen
`data-server-content`, en geen sitemapgeneratie. `hreflang` bestaat hier uitsluitend
als JavaScript-injectie in `client/src/components/GlobalSEO.tsx` (regel 74-82,
`document.createElement`).

Het server-side werk is dus nooit in deze repo geland — het leefde alleen in de
publicatie. Daarom kon het verloren gaan, en daarom kon het werk in git dat niet. Zie
de slotparagraaf van dit document.

---

# DEEL A — Eerst meten, dan pas bouwen

Niemand weet nu wat de rollback wél en niet heeft geraakt. Begin daarom hier.

## A1. Draai de acceptatietest

```bash
bash scripts/acceptatie.sh
```

Veertien secties, 104 controles, tegen de live site. Exitcode 0 of 1. **Bewaar de
volledige uitvoer** — dat is je nulmeting en je werklijst tegelijk.

Staat het script niet in je werkkopie, haal het dan uit git (branch
`claude/new-session-2z19uv`, pad `scripts/acceptatie.sh`) of gebruik het bestand dat bij
deze opdracht is meegeleverd. Het heeft geen dependencies: alleen `bash` en `curl`.

Bij de laatste geslaagde meting, vóór de rollback: **104 goed, 0 fout.** Dat is het
doel. Het is aantoonbaar haalbaar, want het is eerder gehaald.

## A2. Eén controle met voorrang

```bash
for r in /ro /bg /ua; do
  echo -n "$r -> "; curl -sS -o /dev/null -w "%{http_code}\n" "https://repayz.nl$r"
done
```

Die drie pagina's zijn vorige week aangemaakt en hebben live gestaan, dus Google kan
ze inmiddels hebben opgehaald.

- **200** — ze hebben de rollback overleefd. Ga door naar A1.
- **404** — herstel deze drie vóór al het andere. Je voedt Google anders dode URL's.

Geven de 20 samengevoegde URL's uit deel C weer 200 in plaats van 301, dan is er
**geen** schade ontstaan. Google heeft ze dan gewoon nog. Dat is werk dat opnieuw
moet, geen spoed.

## A3. Lees de uitslag als werklijst

| Rood | Wat het betekent | Waar | Verwacht? |
|---|---|---|---|
| **12** — de 20 URL's geven 301 | De samenvoeging is teruggedraaid. | C3 | **Ja** |
| **13, 14** — sitemap | De samengevoegde URL's staan er weer in, of `lastmod` ontbreekt. | C4 | **Ja** |
| **3, 4, 5** — canonical, inhoud in de HTML, `lang` | Alleen rood voor `/ro` `/bg` `/ua` als die weg zijn. Zijn de *bestaande* routes ook rood, dan is de server-side rendering meegegaan — dan is dat de ernstigste categorie en herstel je die eerst. | C1 | Deels |
| **6** — hreflang wederkerig | Waarschijnlijk rood op de drie ontbrekende taalwortels, niet op de opzet zelf. | C2 | Deels |
| **7, 8** — bedrijfsfeiten, JSON-LD | Er is een verboden adres- of openingstijdvariant teruggekeerd. | D | Nee |
| **1, 2, 9, 10, 11** — routes, 404, interne links | Waren op woensdagavond groen en dateren van vóór het afkappunt. | — | Nee |

Kortom: **12, 13 en 14 verwacht ik rood.** Is er meer rood, dan zegt de uitvoer
precies wat, en dan is de bijbehorende paragraaf in deel C je opdracht. Is 3/4/5 rood
op de gewone Nederlandse routes, meld dat dan meteen — dat zou betekenen dat er méér
weg is dan de tijdlijn doet vermoeden.

**Herstel alleen wat rood is.** Groene secties niet aanraken.

---

# DEEL B — Werk dat veilig in git staat

Dit is 21 commits op branch `claude/new-session-2z19uv`, van `52f6143` tot en met
`fcee52b`. **Git is niet teruggezet, dus dit is niet verloren.** Je hoeft het niet
opnieuw te bouwen — hooguit opnieuw samen te voegen als jouw werkkopie ouder is.

Ik zet het er wel bij, om twee redenen: je moet weten dat het bestaat voordat je iets
overschrijft, en een aantal ervan verklaart waarom sommige dingen zijn zoals ze zijn.

## B1. Eén bron voor de bedrijfsfeiten

**`shared/facts.ts`** (commit `1bfd9aa`, daarna toegepast in `692a1cc`, `c2c19e7`,
`835ad6f`, `e182080`).

Het adres stond op 40 plaatsen in de code, de openingstijden op 48. Daardoor liepen ze
uiteen: er circuleerden varianten als `20B`, `5061 KJ` en `10:00-21:00`. Nu is er één
bestand met de waarheid, en lezen alle pagina's, datasets, componenten, de
openingstijden-hook en de chatbot daaruit.

**Raak dit patroon niet aan.** Zet nooit een adres of openingstijd hard in een pagina.
Importeer uit `shared/facts.ts`.

## B2. Een test die feitendrift blokkeert

**`server/facts.test.ts`** (commit `228236f`).

Scant `client/src`, `server`, `shared` en `content.json` op vier regels: huisnummer
20B, elke 5061-postcode die geen KN is, verboden openingstijdvarianten, en elke losse
`HH:MM` die niet 07:00 of 23:00 is. Regels met "Scooterpoint" erin zijn uitgezonderd
voor de tijdregels, want dat is een ander bedrijf met eigen tijden.

Deze test heeft tijdens de bouw een fout gevonden die met de hand niet was gezien: een
tweede `openingHoursSpecification` op `/statiegeld-nederland` die maandag en zondag als
gesloten opgaf. **Laat hem draaien in je build.**

## B3. De dagovergang in de levenstellers

**`server/machineBackbone.ts`** (commits `f9b124e`, `3b7963e`), met testen in
`server/machineDate.test.ts` en `server/lifetimeRollover.test.ts`.

Twee samenhangende fouten:

De backbone vroeg ePortal om de dag volgens `toISOString()`, en dat is UTC. In de
Nederlandse zomertijd loopt Amsterdam twee uur voor. Tussen middernacht en 02:00 vroeg
de site dus de *vorige* dag op. Nu gaat dat via
`Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' })`.

Daarnaast telde de accumulator bij de dagovergang dubbel. De rollover is uit elkaar
getrokken tot een pure functie, `applyMidnightRollover`, met negen testen eromheen.

## B4. Het bouwgereedschap uit de productiebuild

**`vite.config.ts`** en **`server/_core/vite.ts`** (commit `1c3c48f`).

De ontwikkelplugins `jsxLocPlugin` en `vitePluginManusRuntime` draaiden mee in de
productiebuild. Dat leverde 358 kB inline JavaScript in `index.html` op, renderblokkerend,
plus 3.009 `data-loc`-attributen in de uitgeleverde HTML.

Resultaat: `index.html` van 373,94 kB naar 6,82 kB, gzip van 107,33 kB naar 2,22 kB,
`data-loc` van 3.009 naar 0.

De plugins draaien nu alleen nog bij `command === "serve"`. Omdat de config daarmee een
functie werd, is de spread in `server/_core/vite.ts` meegecorrigeerd.

**Dit is de grootste snelheidswinst van de hele week. Zet die plugins niet terug in de
productiebuild.**

## B5. Dode code weg

`server/wally.ts` (een tweede, ongebruikte chatbotprompt) en
`client/src/components/ManusDialog.tsx` zijn verwijderd.

## B6. De meetscripts

- **`scripts/acceptatie.sh`** — 14 secties, exitcode 0/1. De maatstaf. Zie deel D.
- **`scripts/seo-live-check.sh`** — dezelfde metingen, maar rapporterend in plaats van
  oordelend. Handig om te zien *wat* er staat in plaats van of het goed is.

## B7. De rapporten

Ter naslag, niet als werklijst:

| Bestand | Wat erin staat |
|---|---|
| `AUDIT_BREED_2026-08-18.md` | De brede kwaliteitsaudit, 47 bevindingen over tien blokken |
| `BEVINDINGEN_EN_ADVIES.md` | Stand na de eerste herstelronde |
| `DIEPGAAND_ONDERZOEK.md` | De gegevensketen: machine, ePortal, tellers |
| `SEO_ONDERZOEK.md` | Het SEO- en indexeringsonderzoek |
| `OPDRACHT_VOOR_MANUS.md` | De eerste werkopdracht |
| `OPDRACHT_CONSOLIDATIE_INTERNATIONAAL.md` | De internationale samenvoeging, uitgeschreven |

In `SEO_ONDERZOEK.md` en `BEVINDINGEN_EN_ADVIES.md` staat bovenaan een banner die
aangeeft welke bevindingen al zijn afgehandeld. **Ga niet werken aan bevindingen die
daar als afgehandeld staan** zonder ze eerst opnieuw te meten.

---

# DEEL C — Werk dat opnieuw kan moeten

Dit is het server-side werk. Het stond alleen in de publicatie, dus dit is wat de
rollback waarschijnlijk heeft geraakt. Doe alleen wat de meting uit deel A rood laat
zien.

## C1. Server-side rendering

*Hoort bij sectie 3, 4 en 5 van de test.*

**Waarschijnlijk staat dit er nog** — het dateert van vóór het afkappunt. Controleer
het met de meting en sla deze paragraaf over als 3, 4 en 5 groen zijn. Blijkt het tóch
weg, doe dit dan als eerste: zonder server-side content zijn de hreflang-tags en de
redirects uit C2 en C3 zinloos, want een crawler ziet ze niet.

De eis, per route, in de HTML zoals een crawler **zonder JavaScript** die krijgt:

- HTTP 200
- een **zelfverwijzende canonical** — `/locatie` verwijst naar `https://repayz.nl/locatie`,
  niet naar de homepage
- het juiste **`lang`-attribuut** op `<html>`
- een **`<h1>` in de bron**, niet pas na hydratie
- de bodytekst van de pagina

Controleer altijd zo, nooit in de browser:

```bash
curl -sL https://repayz.nl/locatie | grep -i canonical
```

Wat een browser laat zien is wat JavaScript ervan maakt. Wat Google het eerst ziet, is
wat curl teruggeeft. Dat verschil is de kern van dit hele traject geweest.

## C2. De hreflang-set

*Hoort bij sectie 6 van de test.*

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

Let op `hreflang="uk"` voor `/ua`. `uk` is de ISO-taalcode voor Oekraïens; `ua` is de
landcode. Het pad blijft `/ua`, de taalcode wordt `uk`.

**Waarom identiek op alle zes:** dan is de set per definitie wederkerig, en claimt
precies één pagina de Nederlandse variant. Dat waren de twee fouten in de oude opzet —
vijftien pagina's wezen naar `/` als hun Nederlandse versie terwijl `/` naar `/en`
terugwees, en vier clusters claimden dezelfde Nederlandse pagina.

**Geen enkele andere pagina krijgt hreflang-tags.** En geen enkele hreflang mag wijzen
naar een URL die 301 of 404 geeft — alle zeven doelen moeten 200 zijn.

## C3. De internationale samenvoeging: 20 URL's naar 5

*Hoort bij sectie 12 van de test.*

Deze vijf zijn de enige internationale landingspagina's:

```
/en    /ro    /pl    /bg    /ua
```

De andere twintig geven **301** — geen 404 en geen 302:

| Van | Naar | | Van | Naar |
|---|---|---|---|---|
| `/en-oisterwijk` | `/en` | | `/bg-oisterwijk` | `/bg` |
| `/en-tilburg` | `/en` | | `/bg-tilburg` | `/bg` |
| `/en-boxtel` | `/en` | | `/bg-boxtel` | `/bg` |
| `/en-den-bosch` | `/en` | | `/bg-den-bosch` | `/bg` |
| `/ro-oisterwijk` | `/ro` | | `/ua-oisterwijk` | `/ua` |
| `/ro-tilburg` | `/ro` | | `/ua-tilburg` | `/ua` |
| `/ro-boxtel` | `/ro` | | `/ua-boxtel` | `/ua` |
| `/ro-den-bosch` | `/ro` | | `/ua-den-bosch` | `/ua` |
| `/pl-oisterwijk` | `/pl` | | | |
| `/pl-tilburg` | `/pl` | | | |
| `/pl-boxtel` | `/pl` | | | |
| `/pl-den-bosch` | `/pl` | | | |

De `Location`-header moet de absolute doel-URL bevatten (`https://repayz.nl/ro`), en
dat doel moet zelf 200 geven — geen redirectketen.

**Waarom een 301 en niet weghalen:** Google kent deze URL's. Laat je ze 404'en, dan
gooi je weg wat ze hebben opgebouwd. Dat is de enige manier waarop deze ingreep
schadelijker is dan niets doen.

**Waarom samenvoegen:** `/en`, `/en-tilburg`, `/en-boxtel` en `/en-den-bosch`
verschillen in een stadsnaam en een afstandsgetal; de bodytekst is identiek. Dat
patroon valt bij Google onder *scaled content*. Daarnaast bestonden `/en` én
`/en-oisterwijk` allebei — letterlijke duplicatie.

## C4. De sitemap

*Hoort bij sectie 13 en 14 van de test.*

- De 20 samengevoegde URL's eruit.
- `/ro`, `/bg` en `/ua` erin.
- **Elke URL een `lastmod`**, gegenereerd uit de werkelijke wijzigingsdatum.

Reken niet met een vast totaal. Tel vóór en na, en controleer dat het verschil klopt
met de regel: min de twintig, plus de drie. Het totaal verandert per publicatie omdat
er blogartikelen bijkomen. De acceptatietest toetst de regel, niet het getal.

## C5. Twee dingen om te controleren, niet blind aan te passen

**De videositemap op de homepage.** Er staan tien campagnevideo's van Statiegeld
Nederland aangegeven, met eigen titels en beschrijvingen. Dat kan videoresultaten in
Google opleveren — **mits die video's ook echt op `/` staan ingebed.** Zo niet, dan is
de aangifte ongeldig. Controleer dat, en haal ze weg of zet ze op de pagina.

**Het URL-patroon voor taalpagina's.** `/en/statiegeld-app` en `/pl/aplikacja-statiegeld`
gebruiken de prefixvorm, en die past bij `/en` en `/pl` als wortel. Houd die zo. Nieuwe
anderstalige pagina's komen onder `/en/...`, `/ro/...` enzovoort. **Geen suffixvarianten
meer aanmaken** — dat is precies hoe de twintig URL's uit C3 zijn ontstaan.

---

# DEEL D — De bedrijfsfeiten

Alleen deze waarden zijn geldig, overal, ook op de nieuwe `/ro`, `/bg` en `/ua`:

| | |
|---|---|
| Adres | Sprendlingenstraat 20, 5061 KN Oisterwijk |
| Openingstijden | dagelijks 07:00 - 23:00, zeven dagen per week |
| Verpakkingen | blikjes en PET-flesjes, geen glas |
| Tarieven | €0,15 klein / €0,25 groot / €0,15 blik |
| Uitbetaling | Tikkie (Statiegeld App aangekondigd als extra) |
| Doneren | via de doneerknop op de machine |
| E-mail | info@repayz.nl |

**Verboden varianten, nergens toegestaan:** `20B`, `5061 KJ`, `5061 KE`, `5061 JX`,
`10:00-21:00`, `10:00-18:00`, `07:00 tot 22:00`, `10:00-22:00`.

**Uitzondering:** Scooterpoint zit op dezelfde locatie maar is een ander bedrijf met
eigen openingstijden (10:00-18:00). Die regels moeten expliciet als Scooterpoint
gelabeld zijn, anders slaat de test erop aan.

Zowel `server/facts.test.ts` als sectie 7 van de acceptatietest controleert hierop.
Ook de JSON-LD: sectie 8 controleert dat er geen dag als gesloten wordt doorgegeven.

---

# DEEL E — Wat je met rust laat

Dit staat erbij omdat het verleidelijk is om door te poetsen. De rest van de site is
goed:

- **De 26 blogartikelen.** Het sterkste bezit van deze site. Echte onderwerpen, lokale
  nieuwshaken, en meerdere artikelen die precies de juiste zoekintentie raken. Niets
  samenvoegen, niets weghalen.
- **De commerciële pagina's**: `/horeca-statiegeld`, `/statiegeld-bedrijven`,
  `/supermarkt-alternatief`, `/statiegeld-blikjes`, `/statiegeld-flesjes`,
  `/statiegeld-wiki`, `/statiegeld-app`, `/retourshop-xl-statiegeld`.
- **De 14 dorpspagina's en 11 Vinted-lockerpagina's.** Daar wordt een apart besluit
  over genomen zodra er Search Console-data is. Nu niet aankomen.
- **De actie- en eventpagina's**: `/donatiebak`, `/vrijdag-hulpdag`, `/tikkie-winactie`,
  `/check-loten`, `/youtube`, `/intents-festival`.

---

# DEEL F — Definitie van klaar

Er is één maatstaf, en die is niet voor interpretatie vatbaar:

```bash
bash scripts/acceptatie.sh
```

**Exitcode 0 en nul fouten.** Publiceer niets en meld niets als klaar zolang de
exitcode 1 is. Stuur de volledige uitvoer mee bij de oplevering.

Het script draait ook tegen een testomgeving:

```bash
bash scripts/acceptatie.sh http://localhost:3000
```

Gebruik dat **vóór** publicatie in plaats van erna.

## Wat het script controleert

| # | Sectie |
|---|---|
| 1 | Elke route levert een pagina |
| 2 | Een onbekende route geeft 404 |
| 3 | Elke pagina verwijst naar zichzelf als canonical |
| 4 | Er staat inhoud in de HTML, niet alleen een leeg React-omhulsel |
| 5 | Het `lang`-attribuut past bij de taal van de pagina |
| 6 | hreflang staat in de HTML en verwijst wederkerig |
| 7 | De bedrijfsfeiten kloppen en er staat geen verboden variant in |
| 8 | De JSON-LD geeft geen gesloten dagen door |
| 9 | De landingspagina's zijn intern gelinkt in de HTML |
| 10 | De sitemap is actueel |
| 11 | Elke URL in de sitemap bestaat ook echt |
| 12 | De samengevoegde URL's geven een 301 naar de juiste pagina |
| 13 | De samengevoegde URL's staan niet meer in de sitemap |
| 14 | Elke URL in de sitemap heeft een `lastmod` |

Het script bevat geen enkel hard aantal voor de sitemap. Sectie 10 telt en
rapporteert; 13 en 14 toetsen regels. Het blijft dus geldig als er blogartikelen
bijkomen.

## Waarom deze test bestaat

De afgelopen week is er een patroon geweest: er werd een bevinding gemeld, er werd
gemeld dat het gerepareerd was, niemand kon dat aantonen, en dan begon het zoeken
opnieuw. Deze test maakt daar een eind aan door "klaar" een exitcode te maken in plaats
van een mening. Hij kent de goede antwoorden en beoordeelt zichzelf.

De voortgang tot nu toe, allemaal gemeten tegen de live site:

```
37 goed / 37 fout   ->   69 / 8   ->   78 / 0   ->   104 / 0
```

---

# DEEL G — Volgorde

1. **Meten.** `bash scripts/acceptatie.sh`, uitvoer bewaren. Plus de `/ro` `/bg` `/ua`
   404-controle uit A2.
2. **Alleen als sectie 3, 4 of 5 rood is op de gewone routes:** server-side rendering
   herstellen (deel C1). Dit eerst; de rest is zinloos zonder. Verwacht niet nodig.
3. **`/ro`, `/bg`, `/ua` aanmaken en op 200 krijgen.** Dit is vrijwel zeker wél nodig.
4. **De hreflang-set** op alle zes de pagina's (deel C2).
5. **Pas dán de 20 redirects** aanzetten (deel C3). Andersom verwijs je naar pagina's
   die nog niet bestaan.
6. **Sitemap bijwerken** (deel C4).
7. **`acceptatie.sh` draaien tot exitcode 0.**
8. **In Search Console** herindexering aanvragen voor `/`, `/en`, `/ro`, `/pl`, `/bg`
   en `/ua`.

Reken erop dat Google enkele weken nodig heeft om de samenvoeging te verwerken. Dat de
test groen is, betekent dat de techniek klopt — niet dat de index al is bijgewerkt.

---

# DEEL H — Zorg dat een volgende migratie niets meer kost

Deze rollback heeft het werk uit deel C gekost en het werk uit deel B niet. Het
verschil zat niet in hoe belangrijk het was of hoe goed er is opgelet. Het zat in
één ding:

> **Wat in git stond, staat er nog. Wat alleen in de publicatie stond, is weg.**

Een gegevensmigratie op de bouwomgeving is niets bijzonders en zal nog eens gebeuren.
De vraag is niet hoe je dat voorkomt — dat kun je niet — maar hoe je zorgt dat het de
volgende keer een half uur kost in plaats van een week.

## H1. Zet het server-side werk in de repo

Dit is de enige maatregel die er echt toe doet.

De 301-redirects, de server-side rendering, de hreflang-generatie en de
sitemapgeneratie bestaan nu alleen als publicatiestaat. Zet ze als code op branch
`claude/new-session-2z19uv`. Dan geldt voor dat werk hetzelfde als voor deel B: een
migratie raakt het niet, en herstellen is een merge in plaats van opnieuw bouwen.

Concreet, ergens in het serverdeel van de repo:

- de redirecttabel uit C3 als data, niet als losse regels
- de hreflang-set uit C2 op één plaats, zoals `shared/facts.ts` dat voor de
  bedrijfsfeiten doet
- de sitemapgeneratie als script, zodat de sitemap uit de routes volgt en niet
  handmatig wordt bijgehouden

## H2. Commit voordat je publiceert, niet erna

De volgorde die dit probleem had voorkomen:

```
werken  ->  acceptatie.sh tegen localhost  ->  commit + push  ->  publiceren
```

Niet andersom. De publicatie is dan een afgeleide van git, en git is de waarheid.

## H3. Leg vast wat de live site uitzendt

`scripts/seo-live-check.sh` schrijft precies op wat een crawler op elke route
terugkrijgt: canonical, hreflang, `lang`, H1, JSON-LD, sitemapaantal. Draai dat na elke
publicatie en bewaar de uitvoer:

```bash
bash scripts/seo-live-check.sh > seo-snapshot-$(date +%F).txt
```

Dat is geen back-up — je kunt de site er niet mee terugzetten. Maar het is wél een
verschilbaar verslag: bij een volgende rollback zie je in één `diff` wat er is
veranderd, in plaats van het opnieuw te moeten uitzoeken.

## H4. Voor Ronald: waar het werk nu staat

Alles staat op GitHub, `ronald-sketch/repayz`, branch `claude/new-session-2z19uv`. Dat
is de enige plaats waar het werk van deze week volledig bewaard is gebleven — de
rapporten, de testen, de bedrijfsfeitenbron en de acceptatietest.

Raakt de Manus-omgeving nog eens iets kwijt, dan is dat de plek om te beginnen. De
branch is niet afhankelijk van Manus en wordt door een migratie daar niet geraakt.
