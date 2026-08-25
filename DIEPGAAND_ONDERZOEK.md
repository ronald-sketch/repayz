# REPAYZ — diepgaand onderzoek: de gegevensketen

**Datum:** 19 augustus 2026
**Code:** `ronald-sketch/repayz`, branch `claude/new-session-2z19uv`, HEAD `49f2c8f`
**Voorlopers:** `AUDIT_BREED_2026-08-18.md`, `BEVINDINGEN_EN_ADVIES.md`

---

## Waar dit onderzoek over gaat, en waarover niet

De eerdere audits keken naar wat een bezoeker ziet: teksten, prestaties, toegankelijkheid,
privacy. Dit onderzoek gaat één laag dieper, naar de keten waar het geld en het vertrouwen
in zitten:

> machineteller → toewijzing aan een persoon → leaderboard → wat de site als waarheid toont

Die keten was nog door niemand opengeslagen. `server/machineBackbone.ts` (869 regels),
`server/db.ts` (822 regels), `server/eportalWebhook.ts` en de drizzle-schema's waren in de
brede audit alleen van de buitenkant bekeken.

**Twee kanttekeningen vooraf.**

Ten eerste: de fixes waar je het over had, zijn hier niet aangekomen. `origin/main` staat
nog op `ea75d46` en de enige commits op de remote zijn die van mij. Ik heb ze dus niet
kunnen verifiëren, en dit onderzoek gaat over de code die ik wél kan lezen.

Ten tweede, en dat is de reden dat dit rapport zwaarder weegt dan het vorige: waar de
audits veel moesten afleiden, kon ik hier **draaien en meten**. De server is opgestart, de
endpoints zijn echt aangeroepen, de tijdzonelogica is uitgerekend, en de JWT-aanname is
empirisch getoetst. Waar hieronder "bewezen" staat, staat er ook hoe.

---

## Samenvatting

**De gamification — "Game On!", een eigen item in de hoofdnavigatie en een eigen pagina —
werkt van begin tot eind niet.** Niet gedeeltelijk, niet soms: er is geen enkel pad waarlangs
een bezoeker die zijn naam invult ooit op het klassement verschijnt. Vijf onafhankelijke
defecten stapelen op elkaar. Eén ervan is een HTTP 404 die twee keer per tien seconden
afgaat.

**De tellers op de homepage kunnen niet kloppen.** Het grote getal en de uitsplitsing
eronder komen uit twee verschillende bronnen die niets van elkaar weten, en de
boekhouding die de uitsplitsing bijhoudt kan alleen omhoog drijven, nooit terug.

**De ePortal-credentials gaan als querystring over de lijn**, dus ze staan in serverlogs aan
beide kanten van de verbinding.

Daar staat tegenover dat de authenticatielaag beter in elkaar zit dan hij op het eerste
gezicht lijkt. Drie dingen die er alarmerend uitzagen, falen bij nader inzien dicht. Die
staan in deel D, even expliciet als de rest.

---

# A. De gamification-keten

Dit is de hoofdbevinding. Ik loop de keten af zoals een bezoeker hem doorloopt.

## A1. De leaderboard-pagina roept een procedure aan die niet bestaat

**Status: bewezen, live.**

`client/src/pages/Leaderboard.tsx:23` en `:29` doen allebei:

```ts
trpc.drop.getLeaderboard.useQuery({ period: "week", limit: 10 }, { refetchInterval: 10000 })
```

De `drop`-router (`server/routers/gamification.ts:78-111`) kent vijf procedures:
`isQueueAvailable`, `addToQueue`, `getPendingDrop`, `getDropsHistory`, `cancelPendingDrop`.
`getLeaderboard` zit er niet bij.

Ik heb de server gestart en het endpoint aangeroepen:

```
GET /api/trpc/drop.getLeaderboard?input=...
{"error":{"json":{"message":"No procedure found on path \"drop.getLeaderboard\"",
 "code":-32004,"data":{"code":"NOT_FOUND","httpStatus":404, ...
```

Ter vergelijking, de procedure die wél bestaat:

```
GET /api/trpc/leaderboard.getTopSessions?input=...
{"result":{"data":{"json":[]}}}
```

**Waarom niemand dit heeft gemerkt:** `Leaderboard.tsx` begint met `// @ts-nocheck`. Dat is
één van de 111 bestanden met die regel. Met typecontrole aan zou TypeScript deze fout bij de
build hebben afgevangen — `getLeaderboard` bestaat niet op het `drop`-type. Dit is het
concreetste bewijs van wat die 111 bestanden kosten: `pnpm check` staat op groen terwijl een
hele pagina stuk is.

**Nevenschade:** `refetchInterval: 10000` op twee mislukkende queries betekent twaalf 404's
per minuut per geopende tab, elk met een `console.error` uit de globale foutafhandeling in
`main.tsx:30`.

**Ik heb dit systematisch nagelopen.** Ik heb de echte procedurelijst uit `appRouter._def`
gehaald (37 procedures) en die vergeleken met elke `trpc.X.Y.useQuery/useMutation` in de
client. Twee aanroepen hebben geen procedure:

| Aanroep | Waar | Oordeel |
|---|---|---|
| `drop.getLeaderboard` | `Leaderboard.tsx:23`, `:29` | **Echt kapot**, live pagina |
| `ai.chat` | `AIChatBox.tsx:80` | Onschadelijk — staat in een commentaarblok in een component die nergens wordt geïmporteerd |

De overige zestien aanroepen kloppen. Dat is een nulbevinding die de moeite van het
vermelden waard is: dit is geen wijdverbreid patroon, het is één fout op één pagina.

## A2. Het leaderboard leest een tabel die niets vult

**Status: waargenomen.**

`getTopSessions` (`server/db.ts:484-524`) leest uit `recyclingSessions`. Wie schrijft die
tabel? Vier functies in `db.ts`: `startRecyclingSession`, `updateSessionActivity`,
`completeRecyclingSession`, `timeoutInactiveSessions`.

Geen van die vier wordt ergens buiten `db.ts` aangeroepen:

```bash
grep -rn "startRecyclingSession\|completeRecyclingSession\|updateSessionActivity\|timeoutInactiveSessions" \
  server/ --include=*.ts | grep -v "^server/db.ts"
# geen resultaat
```

De routers roepen uit die groep alleen `getTopSessions` aan — de lezer, niet de schrijvers.
Er is geen scheduler, geen cron, geen aanroep vanuit `index.ts`.

**Dus zelfs als A1 wordt gerepareerd, blijft het klassement leeg.** Er zijn twee bugs die
elkaar maskeren.

## A3. De toewijzing schrijft naar een derde tabel

**Status: waargenomen.**

Er zijn drie tabellen voor "wie heeft wat ingeleverd", en ze zijn niet met elkaar verbonden:

| Tabel | Wordt geschreven door | Wordt gelezen door |
|---|---|---|
| `dropsHistory` | `eportalWebhook.ts:108`, `:132` en `dropTracking.ts:100` | alleen `getDropsHistory` |
| `recyclingSessions` | vier functies in `db.ts`, **geen bereikbaar** | `getTopSessions` (het leaderboard) |
| `recyclingContributions` | `db.ts:105`, `:424` | alleen de ingelogde gebruiker zelf |

De webhook — het enige pad dat werkelijk een naam aan een bon koppelt — schrijft naar
`dropsHistory`. Het leaderboard leest `recyclingSessions`. Die twee raken elkaar nergens.

## A4. De "recente drops" bevriezen na tien rijen

**Status: waargenomen.**

`server/dropTracking.ts:128-132`:

```ts
.from(dropsHistory)
.where(eq(dropsHistory.machineId, MACHINE_ID))
.orderBy(dropsHistory.assignedAt)   // <-- oplopend
.limit(limit)
```

Zonder `desc()` sorteert dit **oplopend**. Zodra er meer dan tien rijen in de tabel staan,
levert deze query voor altijd dezelfde tien oudste drops op. De lijst met "recente" drops
verandert daarna nooit meer.

De vergelijkbare query in `getTopSessions` (`db.ts:514`) doet het wél goed:
`.orderBy(desc(recyclingSessions.totalItems))`. Eén van de twee is vergeten.

## A5. De teller-spion is dode code; toewijzing loopt alleen via het open endpoint

**Status: waargenomen.**

`dropTracking.ts:84-119` bevat `assignDropToQueue(previousCounter, newCounter)` — de route
die een stijging van de machineteller aan de wachtende naam zou koppelen. Die functie wordt
nergens aangeroepen.

Daarmee blijft er precies één toewijzingsroute over: `processEportalWebhook`, aangeroepen
vanuit `POST /api/eportal-webhook`. En dat is het endpoint waarvan de
authenticatiecontrole is uitgecommentarieerd (`server/_core/index.ts:44-48`), terwijl
`verifyWebhookAuth` op regel 11 wél wordt geïmporteerd.

**De enige manier waarop iemand op het klassement komt, loopt dus via een endpoint dat
iedereen op internet kan aanroepen.** Dat de rest van de keten kapot is, is op dit moment
het enige wat dat onschadelijk maakt.

## A6. Het "enige" wachtrijslot is niet afgedwongen

**Status: waargenomen.**

`pendingDrop` (`drizzle/schema.ts:178-184`) heeft geen unique constraint op `machineId`. De
exclusiviteit komt uit `addToQueue` (`dropTracking.ts:42-56`), dat eerst `isQueueAvailable()`
aanroept en daarna insert — een klassieke check-then-act zonder transactie of lock.

Twee gelijktijdige aanvragen zien allebei `available: true` en inserten allebei. De webhook
pakt er vervolgens met `.limit(1)` willekeurig één uit. Ter vergelijking: `lifetimeCounters`
(`schema.ts:211`) heeft wél `.unique()` op `machineId`. Bij `pendingDrop` is het vergeten.

## A7. Kleinere gebreken in dezelfde keten

- **`cancelPendingDrop` geeft altijd `true`** (`dropTracking.ts:149`), ook als er niets is
  verwijderd. De UI meldt succes bij het annuleren van een sessie die niet bestaat of niet
  van jou is. Het resultaat van de `delete` wordt niet gelezen.
- **Ongematchte bonnen krijgen een huisaccount.** `eportalWebhook.ts:132` schrijft
  `name: "Scooterpoint"` als er geen wachtende naam is. Op een werkend klassement zou dat
  account per definitie bovenaan eindigen.
- **`previousCounter` en `newCounter` krijgen betekenisloze waarden** in de webhookroute:
  `previousCounter: 0, newCounter: receipt.TotalCnt`, met een comment dat het niet klopt. De
  dode teller-spion vult dezelfde kolommen met echte tellerstanden. Twee schrijvers, twee
  betekenissen voor dezelfde kolommen.
- **Geen index** op `dropsHistory.machineId` of `.assignedAt`, terwijl daarop wordt
  gefilterd en gesorteerd. Bij het huidige volume geen probleem, wel iets om te weten.

## Wat A bij elkaar betekent

Om het klassement werkend te krijgen zijn vijf onafhankelijke reparaties nodig: de
ontbrekende procedure, de tabel die niemand vult, de omgekeerde sortering, de dode
teller-spion, en de race op het wachtrijslot. Dat is geen bugfix maar een feature die af
moet worden gebouwd.

**Advies: neem daar een besluit over voordat je erin investeert.** De eerlijke vraag is of
gamification bij een inleverpunt met één machine genoeg oplevert. Zolang het antwoord er
niet is, is het beste wat je vandaag kunt doen "Game On!" uit de navigatie halen — nu leidt
een menu-item bezoekers naar een lege pagina die twee 404's per tien seconden afvuurt.

---

# B. De tellers die de bezoeker als waarheid krijgt

## B1. De backbone vraagt de verkeerde dag op, elke nacht opnieuw

**Status: bewezen door berekening.**

`machineBackbone.ts:320`:

```ts
const targetDate = new Date().toISOString().split('T')[0];
```

`toISOString()` geeft **UTC**. Nederland loopt in de zomer twee uur voor, in de winter één.
Wat er dus per Amsterdams moment aan ePortal wordt gevraagd:

| Amsterdams moment | Opgevraagde `rvmDate` |
|---|---|
| 18 aug, 23:30 | 2026-08-18 ✓ |
| 19 aug, 00:30 | 2026-08-18 ✗ (gisteren) |
| 19 aug, 01:59 | 2026-08-18 ✗ (gisteren) |
| 19 aug, 02:01 | 2026-08-19 ✓ |
| 19 dec, 00:30 | 2026-12-18 ✗ (gisteren) |

Twee uur per etmaal in de zomer, één in de winter, toont de site als "vandaag" de cijfers van
gisteren. Met openingstijden 07:00-23:00 valt dat venster buiten de openingstijden, dus er
gaan waarschijnlijk geen tellingen verloren — maar het weergegeven cijfer is wel fout, elke
nacht.

Belangrijker is het gevolg voor B2: de middernachtdetectie hieronder slaat daardoor niet om
middernacht aan, maar twee uur later.

## B2. De middernacht-accumulator kan alleen omhoog drijven

**Status: waargenomen, met redenering.**

`machineBackbone.ts:168-181`:

```ts
if (todayBottles < lifetimeCache.lastDailyBottles || todayCans < lifetimeCache.lastDailyCans) {
  lifetimeCache.accumulatedBottles += lifetimeCache.lastDailyBottles;
  lifetimeCache.accumulatedCans   += lifetimeCache.lastDailyCans;
}
```

Drie problemen in vier regels:

**De conditie is een OR, de actie hoogt beide op.** Zakt alleen het flessenaantal — een
partiële API-respons, een hertelling, wat dan ook — dan wordt óók het blikjestotaal van de
vorige dag opgeteld, terwijl dat helemaal niet is gereset. Elke eenzijdige dip telt de
andere categorie een dag dubbel.

**Er is geen datumcontrole.** De code leidt "het is middernacht geweest" af uit "het getal is
lager dan de vorige keer". Elke transiënte hapering van de ePortal-API die een lager getal
oplevert, wordt als een dagovergang gelezen.

**Er is geen correctie.** De accumulator kent alleen `+=`. Een keer te veel opgeteld is
permanent; de fout blijft in de weergegeven levenstotalen zitten tot iemand de rij in
`lifetime_counters` met de hand rechtzet.

## B3. Het grote getal en de uitsplitsing eronder komen uit verschillende bronnen

**Status: waargenomen.**

Op de homepage staat, boven elkaar:

- `Home.tsx:44-45` → `allTimeTotal`, dat is `rvmData.StatusInfoMeter` — de levensmeter van de
  machine zelf. Betrouwbaar.
- `BelowTheFold.tsx:166` → `allTimeBottles` PET flessen · `allTimeCans` blikjes, en die komen
  uit `calculateAllTimeSplit()`: `BASELINE + accumulated + today`. Dat is de handgebouwde
  boekhouding uit B2.

Er is niets dat die twee met elkaar in overeenstemming houdt. De baseline (2504 + 7519 =
10023) is een handmatige momentopname waarvan een comment zegt dat hij "should match
StatusInfoMeter at that time". Vanaf dat moment drijven ze uit elkaar met elke fout uit B2.

**Zichtbaar gevolg:** de uitsplitsing telt niet op tot het totaal dat er direct boven staat.

## B4. Bij API-uitval toont de site de baseline als live cijfer

**Status: waargenomen.**

`BelowTheFold.tsx:166` gebruikt als fallback:

```tsx
{(machineStatus?.allTimeBottles || 2504).toLocaleString('nl-NL')} PET flessen ·
{(machineStatus?.allTimeCans   || 7519).toLocaleString('nl-NL')} blikjes
```

2504 en 7519 zijn exact de `BASELINE_BOTTLES` en `BASELINE_CANS` uit de backbone. Een
bezoeker die de site opent terwijl de koppeling stuk is, ziet die twee getallen zonder enige
aanduiding dat ze niets meten.

## B5. "Laatst bijgewerkt" verbergt hoe oud de data is

**Status: waargenomen.**

`BelowTheFold.tsx:171`:

```tsx
Laatst bijgewerkt: {new Date(machineStatus.lastUpdated).toLocaleTimeString('nl-NL')}
```

`toLocaleTimeString` geeft alleen het tijdstip, geen datum. Data van drie dagen geleden
verschijnt als "Laatst bijgewerkt: 14:32" — wat iedereen leest als vandaag. Het element dat
er is om vertrouwen te geven, doet precies het omgekeerde.

## B6. Versheid wordt wel doorgegeven maar nergens gebruikt

**Status: waargenomen.**

`machine.getStatus` levert `apiStatus` en `lastUpdated` mee. `fetchMachineStats` zet bij een
fout netjes `apiStatus: 'error'` en geeft de gecachete waarden terug — de informatie is er
dus.

Maar de publieke UI kijkt er niet naar. `apiStatus` komt alleen voor in `ApiDebug.tsx`, een
pagina die door `robots.txt` wordt geblokkeerd en die geen bezoeker bezoekt. Op de homepage
en in de header bepaalt uitsluitend `statusType` wat er wordt getoond.

**Dat is de scherpere versie van bevinding H1 uit de brede audit.** Het probleem is niet
alleen de fallback op `'operational'` bij ontbrekende data. Het is dat de status **helemaal
geen houdbaarheidsdatum heeft**. Valt de ePortal-koppeling weg terwijl de machine in storing
staat, dan blijft de laatst bekende toestand — inclusief het groene bolletje — onbeperkt
staan, terwijl het signaal dat hij verouderd is gewoon in de payload zit.

Nuancering die ik in de eerdere audit miste: `initializeBackbone()` (`:647-663`) laadt bij
het opstarten wél de laatst bekende status uit de database. De verzonnen `'operational'`
uit `machine.ts:155` treft dus alleen een verse deployment zonder databaserij. De stille
veroudering hierboven is het grotere probleem.

---

# C. Beveiliging in de ePortal-koppeling

## C1. Het ePortal-wachtwoord staat in de querystring van een GET

**Status: waargenomen. Ernstigste beveiligingspunt van dit onderzoek.**

`machineBackbone.ts:115`:

```ts
await fetch(
  `${EPORTAL_BASE_URL}/login?username=${encodeURIComponent(EPORTAL_USERNAME)}&password=${encodeURIComponent(EPORTAL_PASSWORD)}`,
  { method: 'GET', headers: { 'Accept': 'application/json' } }
);
```

Querystrings worden gelogd. Niet door de TLS-verbinding, maar door alles eromheen: de
toegangslogs van ePortal, elke proxy of load balancer ertussen, en je eigen
uitgaande-verkeerlogs als die er zijn. Het wachtwoord van jullie machinebeheeraccount komt
daarmee in platte tekst in logbestanden waar jij geen controle over hebt.

Hetzelfde geldt voor de API-sleutel op `:332` (`rvmStats?apiKey=${key}`) en `:742`
(`events?apiKey=${key}`), al is die maar veertien minuten geldig.

**Ingreep:** als de ePortal-API POST met een body of een `Authorization`-header accepteert,
overstappen. Zo niet, dan is dit een beperking van hun kant die je moet weten en vastleggen —
en dan is het argument om het wachtwoord regelmatig te roteren sterker.

## C2. De OAuth-state is geen nonce

**Status: waargenomen.**

`client/src/const.ts:14` bouwt de state als `btoa(redirectUri)` — een voorspelbare
codering van de terugkeer-URL. `oauth.ts:14-25` accepteert die state en geeft hem door aan
`exchangeCodeForToken` zonder te controleren of hij ooit door deze server is uitgegeven.

Een state hoort een eenmalige, willekeurige waarde te zijn die serverzijde aan de sessie is
gekoppeld. Zonder die koppeling is er geen bescherming tegen login-CSRF: een aanvaller kan
een callback-URL met zijn eigen `code` laten aanroepen en het slachtoffer in zijn account
laten belanden.

Impact op deze site is beperkt — inloggen doet alleen het admin-dashboard — maar het is een
gratis reparatie: genereer een willekeurige nonce, zet die in een korte cookie, vergelijk bij
terugkomst.

## C3. Een sessiecookie van een jaar, met SameSite=None

`oauth.ts:44` zet de cookie met `maxAge: ONE_YEAR_MS`, en `cookies.ts:45` zet
`sameSite: "none"`. Elk van beide is te verdedigen; samen betekenen ze dat een gestolen of
meegereisde cookie een jaar lang geldig blijft en bij cross-site-verzoeken meegaat, zonder
CSRF-token ergens in de tRPC-laag.

## C4. Een 303-redirect wordt blind gevolgd

`machineBackbone.ts:345-351` leest bij een 303 de `Location`-header uit en doet daar een
tweede `fetch` naartoe, zonder te controleren of dat nog wel een ePortal-host is. De
sessiecookie wordt daarbij niet meegestuurd — vermoedelijk onbedoeld, want de normale route
doet dat wel.

Kleine kans op misbruik zolang TLS staat, maar het is een onnodig vertrouwen in een header
van buiten.

## C5. `verifyWebhookAuth` vergelijkt met `===`

`eportalWebhook.ts:170` doet `password === expectedPassword`. Dat is een niet-constante-tijd
vergelijking. In de praktijk is dat over een netwerk moeilijk uit te buiten, en de functie
wordt op dit moment sowieso niet aangeroepen — maar als je hem aanzet (wat je moet doen),
zet er dan meteen `crypto.timingSafeEqual` in.

## C6. Zestig regels gedupliceerde code in het geldpad

`fetchMachineStats` bevat de complete verwerking twee keer: één keer in de 303-tak
(`:353-398`) en één keer in de normale tak (`:405-451`). Vrijwel identiek. Een correctie in
de ene bereikt de andere niet — en dit is precies de functie die bepaalt welke cijfers de
bezoeker ziet.

---

# D. Wat geverifieerd goed is

Drie dingen die er bij eerste lezing verontrustend uitzagen en het bij nader onderzoek niet
zijn. Die horen er even expliciet bij als de rest.

**De ontbrekende JWT-sleutel faalt dicht.** `env.ts:3` doet
`cookieSecret: process.env.JWT_SECRET ?? ""`, wat eruitziet alsof sessietokens zonder
geheim ondertekend zouden worden — en dus door iedereen te vervalsen. Getest:

```
jose met een sleutel van lengte nul → "Zero-length key is not supported"
```

`jose` weigert het. Zonder `JWT_SECRET` mislukt zowel ondertekenen als verifiëren, wat
betekent dat inloggen simpelweg niet werkt in plaats van dat het onveilig wordt. De veilige
uitkomst.

**Het JWT-algoritme is vastgepind.** `sdk.ts:210-212` roept `jwtVerify` aan met
`algorithms: ["HS256"]`. Daarmee is de klassieke `alg: none`-verwarringsaanval uitgesloten.
Dat is bewust goed gedaan.

**Admin word je niet per ongeluk.** `db.ts:62` verhoogt de rol alleen bij
`user.openId === ENV.ownerOpenId`. `ownerOpenId` valt terug op `""` als de variabele
ontbreekt, maar een lege `openId` komt nergens door: de OAuth-callback weigert hem
(`oauth.ts:27`) en `verifySession` eist een niet-lege string (`sdk.ts:216`). Er is ook geen
pad waarlangs een gebruiker zijn eigen rol kan meesturen.

**Verder in orde bevonden:**

- De foutenlijst in de backbone wordt getrimd op 50 (`:577-580`) — geen geheugenlek, wat ik
  aanvankelijk vermoedde.
- `machineStatus` en `lifetimeCounters` worden weggeschreven met `onDuplicateKeyUpdate` —
  upserts, geen ongebreidelde tabelgroei bij een poll elke vijf minuten.
- `initializeBackbone` laadt bij opstart de laatst bekende status uit de database, dus na een
  herstart is de cache niet leeg.
- De API-sleutel wordt op veertien minuten gezet bij een poll-interval van vijf — ruime marge.
- **`useOpeningHours` klopt.** Het gebruikt het patroon
  `new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }))`, dat berucht is,
  maar ik heb het getest onder drie server-tijdzones (UTC, America/New_York, Asia/Tokyo) en
  het leest in alle drie het juiste Amsterdamse uur. Wel fragiel: het hangt aan de
  `en-US`-notatie. Zou iemand die ooit op `nl-NL` zetten, dan geeft de parser `Invalid Date`
  — gedemonstreerd: `new Date("19/8/2026, 01:30:00")` → `Invalid Date`. Zet er een comment
  bij dat die locale bewust gekozen is.
- Van de achttien tRPC-aanroepen in de client kloppen er zestien. Het defect uit A1 is één
  fout, geen patroon.

---

# E. Ontbrekende opstartvalidatie

`server/_core/env.ts` geeft aan zeven omgevingsvariabelen een lege string als default, zonder
enige controle. Het gevolg is dat een ontbrekende variabele zich verderop als een raadsel
manifesteert:

| Ontbreekt | Wat je ziet |
|---|---|
| `JWT_SECRET` | OAuth-callback geeft een generieke 500 "OAuth callback failed" |
| `DATABASE_URL` | `getDb()` geeft `null`; alle queries geven stilzwijgend `[]` of `false` terug |
| `EPORTAL_USERNAME`/`PASSWORD` | Eén waarschuwing in het log, daarna draait de site door op oude cijfers |

Bij het opstarten van de dev-server in deze sessie zag ik letterlijk:

```
[OAuth] ERROR: OAUTH_SERVER_URL is not configured!
[Database] ⚠️ DATABASE_URL not set!
```

Dat zijn waarschuwingen, geen stops. De server luistert vrolijk verder en serveert een site
die niets kan opslaan.

**Ingreep, ongeveer tien regels:** valideer bij het opstarten welke variabelen in productie
verplicht zijn en stop met een duidelijke foutmelding als er één ontbreekt. Dat verandert een
half etmaal zoeken in een regel bij het opstarten.

---

# Prioriteit

**Vandaag, klein:**

1. **Haal "Game On!" uit de navigatie** (`Header.tsx:140` en `:187`) tot de keten werkt. Nu
   stuurt een menu-item bezoekers naar een lege pagina die twaalf 404's per minuut afvuurt.
   Eén regel, en het stopt de zichtbaarste schade.
2. **`desc()` in `getDropsHistory`** (`dropTracking.ts:131`). Eén woord.
3. **Webhook-authenticatie aanzetten** (`_core/index.ts:44-48`). Het is nu de enige
   toewijzingsroute en hij staat open.

**Deze week:**

4. **`rvmDate` in Amsterdamse tijd berekenen** in plaats van UTC. Dat repareert B1 en haalt
   de tweeurige vertraging uit de middernachtdetectie.
5. **Versheidsgrens op de machinestatus.** Is `lastUpdated` ouder dan pakweg drie
   pollintervallen, toon dan "status onbekend" in plaats van de laatst bekende toestand. En
   maak van "Laatst bijgewerkt: 14:32" een datum-en-tijd.
6. **Baseline-fallbacks weghalen** uit `BelowTheFold.tsx:166`. Liever niets tonen dan 2504 en
   7519 als levende cijfers.
7. **Opstartvalidatie van de omgevingsvariabelen.**
8. **ePortal-credentials uit de querystring**, als hun API dat toestaat.

**Als besluit, niet als bugfix:**

9. **Wil je gamification?** Zo ja, dan is het een feature die af moet: één tabel kiezen, de
   ontbrekende procedure bouwen, de teller-spion aansluiten of weggooien, en een unique
   constraint op `pendingDrop.machineId`. Zo nee, dan kan een flinke hoeveelheid code weg —
   `dropTracking.ts`, de sessiefuncties in `db.ts`, de leaderboard-pagina en drie tabellen.
   Beide antwoorden zijn beter dan de huidige toestand.

10. **De uitsplitsing bottles/cans.** Zolang die uit een eigen boekhouding komt naast de
    hardwaremeter, blijven de getallen uit elkaar lopen. Overweeg de uitsplitsing helemaal
    niet te tonen en alleen het metergetal te gebruiken. Dat is één bron, en die klopt.

---

# Wat ik niet kon vaststellen

| Wat | Waarom |
|---|---|
| Of jullie fixes deze bevindingen al raken | `origin/main` staat nog op `ea75d46`; de fixes zijn hier niet aangekomen |
| Of `recyclingSessions` in productie rijen bevat | Geen databasetoegang. Statisch staat vast dat geen bereikbare code de tabel vult; oudere versies kunnen rijen hebben achtergelaten |
| Of de ePortal-API POST of een auth-header ondersteunt | Geen toegang tot hun documentatie of endpoint |
| Hoe vaak de middernacht-accumulator in de praktijk misgaat | Vereist de historie in `lifetime_counters` naast de meterstanden van ePortal |
| Of het klassement ooit heeft gewerkt | Er is één commit in deze repo; er is geen historie om in te kijken |

---

# Vragen

1. **Moet gamification blijven?** Dit is de enige vraag in dit rapport die de omvang van het
   werk bepaalt. De keten repareren is een dag of meer; hem weghalen is een uur.
2. **Ondersteunt de ePortal-API POST met een body, of een `Authorization`-header?** Bepaalt
   of C1 te repareren is of dat je ermee moet leven.
3. **Is `lifetime_counters` ooit met de hand rechtgezet?** Zo ja, dan is dat een aanwijzing
   dat de drift uit B2 zich al heeft voorgedaan.
4. **Klopt de baseline van 10.023 nog** ten opzichte van de levensmeter van de machine? Dat
   is met één blik op ePortal te controleren en vertelt je meteen hoe ver de boekhouding is
   afgedreven.
