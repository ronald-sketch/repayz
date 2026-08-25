# Werkopdracht — onbekende URL's geven 503 in plaats van 404

**Voor:** Manus
**Van:** Ronald
**Datum:** 25 augustus 2026
**Omvang:** één ding. Raakt geen inhoud, geen pagina's, geen SEO-opzet.

---

## Stand van zaken

Het herstel na de gegevensmigratie is klaar. De acceptatietest van vandaag 07:55 UTC
geeft **103 goed, 1 fout**. Alles is terug: de sitemap op 86 URL's met `lastmod` van
vandaag, alle twintig redirects op 301, `/ro` `/bg` `/ua` op 200 met zeven wederkerige
hreflang-tags, server-side rendering, canonicals, `lang`, JSON-LD en de bedrijfsfeiten.

Er is één ding stuk, en dat is nieuw:

```
2. Een onbekende route geeft 404
  FOUT  /bestaat-niet-acceptatietest-25253
        verwacht : 404
        gevonden : 503
```

**Dit is een regressie van na de migratie.** Sectie 2 was groen bij de meting van 78/0
en bij die van 104/0. Er is dus iets in de routerings- of hostinglaag veranderd.

Het zit niet in de applicatiecode van de repo — daar staat nergens een 503, en er is
geen expliciete 404-handler. Zoek het in de hosting-, proxy- of routeringsconfiguratie.

---

## Waarom dit opgelost moet worden

Voor Google is het verschil tussen 404 en 503 groot:

| | Wat Google eruit leest | Wat Google doet |
|---|---|---|
| **404** | Deze pagina bestaat niet | Haalt de URL uit de index, stopt met langskomen |
| **503** | Server kan even niet, kom terug | Houdt de URL in de wachtrij, blijft terugkomen |

Elke onbekende URL geeft nu 503. Dat betreft typefouten in externe links, oude gedeelde
URL's, en alles wat Google nog van verdwenen pagina's in de index heeft. Die verdwijnen
nu niet, maar blijven hangen.

Het vervolgrisico is het punt: komt Google op een domein structureel 503's tegen, dan
verlaagt het de crawlsnelheid voor het hele domein. Dat is bedoeld om een haperende
server te ontzien. Bij een site die net vijf nieuwe taalpagina's en een samengevoegde
sitemap geïndexeerd wil krijgen, werkt dat direct tegen je.

---

## Stap 1 — Vaststellen wat er precies gebeurt

Draai dit en plak de uitvoer bij de oplevering:

```bash
# Meerdere onbekende paden, verschillende vormen
for p in /bestaat-niet /xyz123 /statiegeld-nergens /en-nergens /blog/bestaat-niet; do
  echo -n "$p -> "; curl -sS -o /dev/null -w "%{http_code}\n" "https://repayz.nl$p"
done

# Drie keer hetzelfde pad, om uit te sluiten dat het toeval is
for i in 1 2 3; do
  curl -sS -o /dev/null -w "%{http_code}\n" "https://repayz.nl/bestaat-niet-$i"
done

# De volledige headers, inclusief een eventuele Retry-After
curl -sSI "https://repayz.nl/bestaat-niet-headers-test" | head -20
```

Wat je eruit wilt weten:

- **Geeft élk onbekend pad 503, of alleen sommige vormen?** Dat wijst de laag aan.
- **Is het consistent of wisselend?** Wisselend betekent overbelasting, consistent
  betekent configuratie.
- **Staat er een `Retry-After`-header bij?** Dan komt de 503 uit een bewuste
  onderhouds- of rate-limitregel, en niet uit een ontbrekende 404-route.

---

## Stap 2 — Repareren

Een onbekend pad moet **404** geven, met een echte foutpagina in de HTML — niet een
leeg omhulsel en niet een omleiding naar de homepage.

Let op twee valkuilen:

**Geen soft-404.** Een pagina die 200 teruggeeft met "niet gevonden" in de tekst is
erger dan een 503: Google indexeert hem dan als geldige pagina. De statuscode moet
echt 404 zijn.

**Geen redirect naar `/`.** Dat lijkt vriendelijk maar levert bij Google hetzelfde
probleem op — de URL blijft bestaan en verwijst naar iets anders dan wat er stond.

Bestaat er een pagina waarvan je zeker weet dat hij nooit terugkomt, dan mag **410**
in plaats van 404. Google verwerkt die iets sneller. Voor het algemene geval is 404
goed.

---

## Stap 3 — Aantonen

```bash
bash scripts/acceptatie.sh
```

**Exitcode 0 en nul fouten.** Dat is de enige maatstaf. Stuur de volledige uitvoer mee.

De overige 103 controles zijn groen. **Die moeten groen blijven** — als er iets omvalt
door deze wijziging, is dat een regressie en geen bijkomstigheid.

---

## Daarna: het server-side werk in de repo

Dit is de tweede keer dat de publicatiestaat de enige plaats blijkt te zijn waar
belangrijk werk staat. De redirecttabel, de hreflang-set, de sitemapgeneratie en nu ook
de 404-afhandeling bestaan nergens in git.

Zet ze op branch `claude/new-session-2z19uv`. Dan is een volgende migratie een merge in
plaats van een week uitzoeken. Zie deel H van `HERSTELOPDRACHT_VOLLEDIG.md`.
