# Controleopdracht — de zes app-pagina's

**Voor:** Manus
**Van:** Ronald
**Datum:** 25 augustus 2026
**Omvang:** eerst controleren, dan pas besluiten. Raak nog niets aan.

---

## Waar dit over gaat

In de sitemap staan zes URL's die op 14 augustus zijn aangemaakt en die over hetzelfde
onderwerp lijken te gaan: de Statiegeld App en uitbetaling via Tikkie.

| Taal | Als vaste pagina | Als blogartikel |
|---|---|---|
| NL | `/statiegeld-app` | `/blog/statiegeld-app-uitbetaling-tikkie-qr-code-repayz` |
| EN | `/en/statiegeld-app` | `/blog/statiegeld-app-payment-tikkie-coming-soon` |
| PL | `/pl/aplikacja-statiegeld` | `/blog/aplikacja-statiegeld-tikkie-wkrotce` |

Twee sets van drie, in dezelfde drie talen, allemaal met `lastmod` 2026-08-14.

**Dit is een vraag, geen bevinding.** Ik kan de inhoud niet beoordelen. Het kan
volstrekt in orde zijn. Er zijn twee dingen die het niet zouden zijn, en dit document
vraagt je om vast te stellen welke van de drie situaties geldt.

---

## Vraag 1 — Overlappen de twee sets?

Vergelijk per taal de vaste pagina met het blogartikel. Zeggen ze grotendeels
hetzelfde, of hebben ze een eigen doel?

Wat "eigen doel" betekent: de vaste pagina legt uit wat de app is en hoe je hem
gebruikt; het artikel brengt een aankondiging of een nieuwshaak met een datum eraan.
Dat zijn twee verschillende zoekintenties en dan mogen ze allebei bestaan.

Wat overlap betekent: dezelfde uitleg, dezelfde koppen, dezelfde alinea's, alleen een
andere URL. Dan concurreren ze met elkaar op dezelfde zoekopdracht en wint geen van
beide.

**Beoordeel dit op de tekst, niet op de titel.** Twee verschillende titels boven
dezelfde inhoud is nog steeds duplicatie.

## Vraag 2 — Hebben deze pagina's hreflang?

```bash
for u in /statiegeld-app /en/statiegeld-app /pl/aplikacja-statiegeld \
         /blog/statiegeld-app-uitbetaling-tikkie-qr-code-repayz \
         /blog/statiegeld-app-payment-tikkie-coming-soon \
         /blog/aplikacja-statiegeld-tikkie-wkrotce; do
  echo -n "$u -> "
  curl -sL "https://repayz.nl$u" | grep -c 'hreflang=' 
done
```

Vermeld per URL het aantal, en als er tags staan: welke.

---

## Wat je daarna doet — drie situaties

### Situatie A: de sets overlappen

Voeg samen. Houd de **vaste pagina** aan (`/statiegeld-app` en de taalvarianten
daarvan) en zet een **301** van het blogartikel naar de vaste pagina in dezelfde taal:

```
/blog/statiegeld-app-uitbetaling-tikkie-qr-code-repayz  ->  /statiegeld-app
/blog/statiegeld-app-payment-tikkie-coming-soon         ->  /en/statiegeld-app
/blog/aplikacja-statiegeld-tikkie-wkrotce               ->  /pl/aplikacja-statiegeld
```

Waarom de vaste pagina wint: die is niet gebonden aan een datum en blijft geldig als de
app er eenmaal is. Een artikel met "coming soon" in de URL veroudert vanzelf.

Haal de drie blog-URL's daarna uit de sitemap.

### Situatie B: de sets verschillen wezenlijk

Laat ze staan. Dan is er niets aan de hand en is er alleen werk aan vraag 2 (hieronder).

### Situatie C: twijfel

Meld dat, met per paar een korte omschrijving van wat er in staat. Dan besluit Ronald.
**Ga niet gokken en ga niets samenvoegen bij twijfel** — een 301 is moeilijk terug te
draaien.

---

## Wat er in alle drie de situaties moet gebeuren: hreflang

`/statiegeld-app`, `/en/statiegeld-app` en `/pl/aplikacja-statiegeld` zijn drie
vertalingen van dezelfde pagina. Dat is een echt taalcluster en daar hoort hreflang bij.
Nu hebben ze het waarschijnlijk niet.

Alle drie krijgen **dezelfde vier tags**, in de HTML en niet via JavaScript:

```html
<link rel="alternate" hreflang="nl"        href="https://repayz.nl/statiegeld-app" />
<link rel="alternate" hreflang="en"        href="https://repayz.nl/en/statiegeld-app" />
<link rel="alternate" hreflang="pl"        href="https://repayz.nl/pl/aplikacja-statiegeld" />
<link rel="alternate" hreflang="x-default" href="https://repayz.nl/statiegeld-app" />
```

Identiek op alle drie, om dezelfde reden als bij de taalwortels: dan is de set per
definitie wederkerig en claimt precies één pagina de Nederlandse variant.

Blijft in situatie B de blogset bestaan als eigen cluster, dan krijgt **die set een
eigen, aparte hreflang-groep** met dezelfde opzet: alle drie dezelfde vier tags, wijzend
naar de drie blog-URL's. Meng de twee groepen niet — een pagina hoort bij één cluster.

**Let op:** dit is een uitzondering op de regel uit de vorige opdracht dat alleen `/`,
`/en`, `/ro`, `/pl`, `/bg` en `/ua` hreflang krijgen. Die regel ging over de
landingspagina's. Een echt vertaald paar hoort altijd aan elkaar gekoppeld te zijn. De
zes landingspagina's houden hun eigen set van zeven tags — daar verandert niets aan.

---

## Wat je NIET doet

- **Geen andere pagina's aanraken.** De 26 blogartikelen, de 14 dorpspagina's, de 11
  Vinted-pagina's en de commerciële pagina's blijven zoals ze zijn.
- **Geen canonical van de ene naar de andere taal.** Een Poolse pagina is geen duplicaat
  van een Nederlandse. Elke taalversie houdt een zelfverwijzende canonical.
- **Niets samenvoegen zonder de vergelijking uit vraag 1 te hebben gedaan.**

---

## Definitie van klaar

```bash
bash scripts/acceptatie.sh
```

De 103 groene controles **moeten groen blijven**. Deze opdracht mag daar niets aan
veranderen.

Lever daarnaast op:

1. Per taal: overlappen de vaste pagina en het blogartikel? Situatie A, B of C.
2. De uitvoer van het hreflang-commando hierboven, vóór en na.
3. Als je hebt samengevoegd: de drie 301's, met `curl -sSI` aangetoond.

---

## Los hiervan blijft openstaan

De 503 op onbekende URL's. Zie `OPDRACHT_404_NA_MIGRATIE.md` — dat is het zwaarder
wegende punt van de twee.
