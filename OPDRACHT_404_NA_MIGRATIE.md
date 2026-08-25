# Onbekende URL's geven 503 in plaats van 404 — diagnose en escalatie

**Voor:** Manus
**Van:** Ronald
**Datum:** 25 augustus 2026
**Status:** oorzaak vastgesteld. Dit is geen codeprobleem.

---

## De meting

Uitgevoerd 25 augustus 08:08 UTC tegen https://repayz.nl.

```
=== meerdere onbekende paden ===
/bestaat-niet        -> 503
/xyz123              -> 503
/statiegeld-nergens  -> 503
/en-nergens          -> 503
/blog/bestaat-niet   -> 503

=== drie maal hetzelfde patroon ===
bestaat-niet-1 -> 503
bestaat-niet-2 -> 503
bestaat-niet-3 -> 503

=== headers ===
HTTP/2 503
date: Tue, 25 Aug 2026 08:08:56 GMT
content-type: text/html; charset=UTF-8
cache-control: no-cache, no-store, must-revalidate
expires: 0
retry-after: 216000
pragma: no-cache
x-manus-original-status: 404
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
server: cloudflare
cf-ray: a3091c978edda4dc-MIA
```

---

## Conclusie: de applicatie is niet stuk

```
x-manus-original-status: 404
```

Die header is het bewijs. De applicatie geeft **404**, precies zoals het hoort. Iets
tussen de applicatie en de bezoeker vervangt die status door 503 en bewaart de
oorspronkelijke waarde in een eigen header.

Drie waarnemingen bevestigen dat dit configuratie is en geen storing:

| Waarneming | Wat het uitsluit |
|---|---|
| Alle vijf paden geven 503, in verschillende vormen | Geen route-specifiek probleem |
| Drie identieke pogingen geven drie keer 503 | Geen overbelasting, geen toeval |
| `retry-after: 216000` — exact 60 uur | Geen server die het zwaar heeft. Een rond getal is ingesteld |
| `x-manus-original-status` is een Manus-header | Het gebeurt in de Manus-laag, niet in Cloudflare en niet in de app |

**Zoek dit dus niet in de repo en niet in de routes.** Er staat nergens een 503 in de
applicatiecode, en er hoeft geen 404-handler bij te komen — die werkt al.

Waarschijnlijke oorzaak: een onderhouds- of migratiestand die na de verplichte
gegevensmigratie is blijven staan. Een `retry-after` van 60 uur past bij zo'n
instelling. Dit is een vermoeden, geen vaststelling.

---

## Aanvulling 25 augustus, 09:45 — de klant kan dit niet zelf ondervangen

Er is geprobeerd de 503 aan klantzijde te onderscheppen met een Cloudflare Worker.
Dat werkt niet, en dat is zelf een bevinding.

**Wat er is gedaan.** Een Worker (`repayz-status-herstel`) is uitgerold op het
Cloudflare-account van de domeinhouder en gekoppeld aan de route `repayz.nl/*`. De
Worker zet de status uit `x-manus-original-status` terug en verwijdert de
`retry-after`.

**Wat er is gemeten.**

```
HTTP/1.1 503 Service Unavailable
Retry-After: 216000
X-Manus-Original-Status: 404
Server: cloudflare
CF-RAY: a309aa020c26cd17-AMS
```

De eigen header van de Worker, `x-status-hersteld-door`, ontbreekt. De Worker draait
dus niet, terwijl:

| Gecontroleerd | Stand |
|---|---|
| Worker uitgerold | ja — `Deployed repayz-status-herstel triggers` |
| Route aanwezig | ja — `repayz.nl/*` -> `repayz-status-herstel`, 1 van 1 |
| DNS-record `repayz.nl` | A -> `104.18.26.246`, **Proxied** |

**De verklaring.** Dat IP-adres is geen server van Manus maar een adres van Cloudflare
zelf. De opzet is dus *orange-to-orange*: twee Cloudflare-lagen achter elkaar. Daarbij
wordt het verzoek aan de rand doorgegeven aan de zone van de aanbieder, en worden
instellingen van de bovenliggende zone grotendeels overgeslagen — Workers daaronder.

Dit is een gevolgtrekking uit de drie waarnemingen hierboven, geen mededeling van
Cloudflare. Maar de uitkomst staat vast: **een Worker aan klantzijde krijgt het
verzoek niet te zien.**

**Wat dat betekent.** Er is geen ingreep aan klantzijde mogelijk. De 503 kan alleen
worden weggenomen in de laag die `x-manus-original-status` zet — en die staat bij
Manus. Dit is dus geen kwestie van meedenken maar van uitvoeren aan hun kant.

De Worker blijft uitgerold en gekoppeld. Hij kost niets zolang hij wordt overgeslagen,
en hij grijpt alleen in bij een 503 met die header. Verandert de opzet ooit, dan werkt
hij vanzelf.

---

## Sluitstuk 25 augustus, 10:0x — ook op het manus.space-domein zelf

De laatste twijfel is weggenomen door dezelfde niet-bestaande URL op te vragen via het
Manus-projectdomein, dat de Cloudflare-zone van de domeinhouder volledig overslaat:

```
curl -sSI https://repayz-recyc-gkymvzzt.manus.space/bestaat-niet-vergelijk

HTTP/1.1 503 Service Unavailable
Retry-After: 216000
X-Manus-Original-Status: 404
```

Zelfde antwoord, zelfde `retry-after`, zelfde bewaarde status.

| Ingang | Antwoord |
|---|---|
| `repayz.nl` | 503 + `X-Manus-Original-Status: 404` |
| `www.repayz.nl` | 301 naar apex, daarna diezelfde 503 |
| `repayz-recyc-gkymvzzt.manus.space` | 503 + `X-Manus-Original-Status: 404` |

**De onderhoudsstand zit op het project zelf**, niet op de domeinkoppeling, niet op
Cloudflare en niet op DNS. Elke ingang komt bij dezelfde instelling uit.

Daarmee vervalt elke denkbare ingreep aan klantzijde. Dit kan alleen worden omgezet in
de Manus-omgeving.

---

## Wat er hersteld moet worden

Eén ding: **laat de oorspronkelijke statuscode door.** Geeft de applicatie 404, dan
moet de bezoeker 404 krijgen. Geen 503, en geen `retry-after`.

Concreet aan Manus te vragen:

1. Staat er voor dit project een onderhouds-, migratie- of health-check-stand aan die
   foutstatussen omzet naar 503? Zo ja: uitzetten.
2. Zo nee: waar wordt `x-manus-original-status` gezet, en waarom vervangt die laag een
   404 door een 503?
3. Wordt dit ook gedaan bij andere statussen? De 301-redirects komen wél goed door, dus
   het lijkt beperkt tot foutstatussen — graag bevestigen.

---

## Waarom dit niet kan blijven staan

Voor Google is het verschil groot:

| | Wat Google eruit leest | Wat Google doet |
|---|---|---|
| **404** | Deze pagina bestaat niet | Haalt de URL uit de index, stopt met langskomen |
| **503 + retry-after** | Server kan even niet, kom over 60 uur terug | Houdt de URL in de wachtrij en blijft terugkomen |

Elke onbekende URL geeft nu 503. Dat betreft typefouten in externe links, oude gedeelde
URL's, en alles wat Google nog van verdwenen pagina's in de index heeft. Die verdwijnen
niet meer.

Het vervolgrisico weegt zwaarder: komt Google op een domein structureel 503's met een
`retry-after` tegen, dan verlaagt het de crawlsnelheid voor het hele domein. Dat is
bedoeld om een haperende server te ontzien. De site heeft net vijf nieuwe taalpagina's,
twintig verse redirects en een samengevoegde sitemap die geïndexeerd moeten worden — dat
is precies het verkeerde moment om Google te laten denken dat de server het moeilijk
heeft.

**Wat er niét aan de hand is, voor de duidelijkheid:** de echte pagina's geven allemaal
200 en zijn gewoon bereikbaar. De schade is beperkt tot foutpagina's en tot het signaal
dat het domein afgeeft. Dit is dringend, niet acuut.

---

## Wat je NIET moet doen

**Geen soft-404 bouwen.** Een pagina die 200 teruggeeft met "niet gevonden" in de tekst
is erger dan de 503: Google indexeert hem dan als geldige pagina. Bovendien lost het
niets op — de applicatie geeft al de goede status.

**Geen redirect naar de homepage.** Dan blijft de URL bestaan en verwijst hij naar iets
anders dan wat er stond.

**Niets in de repo aanpassen.** De code is niet het probleem. Elke wijziging daar is
een risico op regressie zonder dat het de 503 wegneemt.

---

## Wanneer is het klaar

```bash
bash scripts/acceptatie.sh
```

Exitcode 0 en nul fouten. De overige 103 controles zijn groen en **moeten groen
blijven**.

**Eerlijke kanttekening bij die maatstaf.** Als dit inderdaad in de platformlaag zit,
kun jij het als bouwer misschien niet zelf oplossen. Dan is de opdracht niet
"repareren" maar "escaleren en terugkoppelen". Meld in dat geval:

- bij wie het is neergelegd en wanneer
- wat het antwoord was
- of er een instelling is die Ronald zelf kan omzetten

**Dat is een geldige oplevering.** Wat niet geldig is, is een aanpassing in de repo die
het probleem niet raakt, of een melding dat het klaar is terwijl sectie 2 rood blijft.

---

## Daarna: het server-side werk in de repo

Los hiervan blijft staan wat in deel H van `HERSTELOPDRACHT_VOLLEDIG.md` is beschreven.
De redirecttabel, de hreflang-set en de sitemapgeneratie bestaan nergens in git. Zet ze
op branch `claude/new-session-2z19uv`, zodat een volgende migratie een merge is in
plaats van een week uitzoeken.
