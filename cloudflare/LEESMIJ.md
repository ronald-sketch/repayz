# Cloudflare Worker — 503 terugzetten naar de oorspronkelijke status

**Tijdelijk.** Weghalen zodra Manus het bij de bron oplost.

---

## Eerst controleren: wat staat er in de body?

De Worker laat de body ongewijzigd. Dat is goed als Manus alleen de
*statuscode* vervangt en de echte 404-pagina doorlaat. Vervangt Manus ook de
pagina zelf, dan zien bezoekers een storingsmelding met een 404-status.

```bash
curl -sL https://repayz.nl/bestaat-niet-test | head -40
```

- **Je ziet de eigen 404-pagina van repayz** → de Worker hieronder is klaar voor gebruik.
- **Je ziet een storings- of onderhoudspagina van Manus** → laat het me weten,
  dan voeg ik een eigen 404-pagina aan de Worker toe.

---

## Plaatsen

1. Cloudflare → **Workers & Pages** → **Create** → **Create Worker**
2. Naam: `repayz-status-herstel`
3. Plak de inhoud van `herstel-originele-status.js` en klik **Deploy**
4. Ga naar de Worker → **Settings** → **Domains & Routes** → **Add route**
   - Route: `repayz.nl/*`
   - Zone: `repayz.nl`
5. Bestaat `www.repayz.nl` ook, voeg dan `www.repayz.nl/*` als tweede route toe

---

## Aantonen dat het werkt

```bash
# moet 404 geven, zonder retry-after
curl -sSI https://repayz.nl/bestaat-niet-na-worker | head -12

# echte pagina's moeten onveranderd 200 blijven geven
for r in / /locatie /en /ro /statiegeld-app; do
  echo -n "$r -> "; curl -sS -o /dev/null -w "%{http_code}\n" "https://repayz.nl$r"
done

# en de volledige test
bash scripts/acceptatie.sh
```

Verwacht na plaatsing: **104 goed, 0 fout**. Sectie 2 wordt groen; de overige
103 controles moeten groen blijven.

**Wordt iets anders rood, haal de route er dan meteen af** (Settings → Domains &
Routes → route verwijderen). Dat is één klik en de site is direct terug in de
oude toestand.

---

## Weghalen

Zodra Manus het bij de bron heeft opgelost:

1. Controleer eerst dat het echt is opgelost — zet de route tijdelijk uit en
   draai `bash scripts/acceptatie.sh`. Blijft sectie 2 groen, dan is het bij
   de bron gerepareerd.
2. Verwijder daarna de route en de Worker.

Geen haast: zonder 503-met-header doet de Worker niets. Maar twee lagen die
hetzelfde probleem oplossen is verwarrend voor wie er later naar kijkt.
