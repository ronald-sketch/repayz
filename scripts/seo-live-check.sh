#!/usr/bin/env bash
#
# seo-live-check.sh — haalt per route de SEO-signalen op uit de HTML zoals een
# crawler zonder JavaScript die krijgt.
#
# Gebruik:
#   bash scripts/seo-live-check.sh                      # tegen https://repayz.nl
#   bash scripts/seo-live-check.sh http://localhost:3000
#
# Vereist alleen curl en standaard shell-tools. Geen node, geen dependencies.
#
# De uitvoer is bedoeld om integraal te delen: per route staat er de exacte URL,
# de HTTP-status, de canonical, de hreflang-set, het lang-attribuut, de H1 en of
# er server-side body-content is meegekomen.

set -uo pipefail

BASIS="${1:-https://repayz.nl}"
UA="Mozilla/5.0 (compatible; SEO-check/1.0)"

ROUTES=(
  "/"
  "/locatie"
  "/hoe-het-werkt"
  "/faq"
  "/statiegeld-inleveren"
  "/statiegeld-nederland"
  "/statiegeld-udenhout"
  "/statiegeld-tilburg"
  "/vinted-locker-boxtel"
  "/en"
  "/en-tilburg"
  "/pl"
  "/pl-tilburg"
  "/ro-boxtel"
  "/ua-den-bosch"
  "/statiegeld-wiki"
  "/retourshop-xl-statiegeld"
)

# Een route die niet hoort te bestaan, om de 404-afhandeling te toetsen.
NIETBESTAAND="/deze-route-bestaat-niet-$(date +%s 2>/dev/null || echo x)"

haal() { curl -sSL --max-time 25 -A "$UA" "$1" 2>/dev/null; }
status() { curl -sS -o /dev/null --max-time 25 -A "$UA" -w "%{http_code}" "$1" 2>/dev/null; }
status_zonder_volgen() { curl -sS -o /dev/null --max-time 25 -A "$UA" -w "%{http_code}" "$1" 2>/dev/null; }

tag() { grep -o "$1" <<<"$2" | head -"${3:-1}"; }

echo "==============================================================="
echo " SEO-controle tegen: $BASIS"
echo " Datum (UTC):        $(date -u '+%Y-%m-%d %H:%M:%SZ')"
echo " Methode:            GET zonder JavaScript (curl -sL)"
echo "==============================================================="
echo

for route in "${ROUTES[@]}"; do
  url="${BASIS}${route}"
  code="$(status_zonder_volgen "$url")"
  html="$(haal "$url")"

  echo "---------------------------------------------------------------"
  echo "URL         : $url"
  echo "HTTP        : ${code:-geen antwoord}"

  if [ -z "$html" ]; then
    echo "  (geen body ontvangen)"
    echo
    continue
  fi

  canon="$(tag '<link[^>]*rel="canonical"[^>]*>' "$html")"
  echo "canonical   : ${canon:-ONTBREEKT}"

  ogurl="$(tag '<meta[^>]*property="og:url"[^>]*>' "$html")"
  echo "og:url      : ${ogurl:-ONTBREEKT}"

  titel="$(tag '<title>[^<]*</title>' "$html" | sed 's/<[^>]*>//g')"
  echo "title       : ${titel:-ONTBREEKT}"

  lang="$(tag '<html[^>]*lang="[^"]*"' "$html" | grep -o 'lang="[^"]*"')"
  echo "html lang   : ${lang:-ONTBREEKT}"

  robots="$(tag '<meta[^>]*name="robots"[^>]*>' "$html")"
  echo "robots      : ${robots:-ONTBREEKT}"

  h1="$(grep -o '<h1[^>]*>.*</h1>' <<<"$html" | head -1 | sed 's/<[^>]*>//g' | cut -c1-90)"
  echo "h1          : ${h1:-GEEN H1 IN DE HTML}"

  ssr="$(grep -c 'data-server-content' <<<"$html")"
  echo "server-body : $( [ "$ssr" -gt 0 ] && echo "ja (data-server-content aanwezig)" || echo "nee" )"

  hrefl="$(grep -o '<link[^>]*hreflang="[^"]*"[^>]*>' <<<"$html")"
  aantal="$(printf '%s' "$hrefl" | grep -c 'hreflang=' || true)"
  echo "hreflang    : $aantal tag(s)"
  if [ "$aantal" -gt 0 ]; then
    while IFS= read -r r; do
      h="$(grep -o 'hreflang="[^"]*"' <<<"$r")"
      t="$(grep -o 'href="[^"]*"' <<<"$r")"
      echo "              $h  $t"
    done <<<"$hrefl"
  fi

  jsonld="$(grep -c 'application/ld+json' <<<"$html")"
  echo "JSON-LD     : $jsonld blok(ken)"
  if [ "$jsonld" -gt 0 ]; then
    for veld in streetAddress postalCode telephone opens closes openingHours; do
      w="$(grep -o "\"$veld\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" <<<"$html" | sort -u | tr '\n' ' ')"
      [ -n "$w" ] && echo "              $w"
    done
  fi

  # Interne links naar landingspagina's, zoals ze in de HTML staan
  intern="$(grep -o 'href="/statiegeld-[a-z-]*"' <<<"$html" | sort -u | wc -l)"
  echo "links naar dorpspaginas in de HTML : $intern"
  echo
done

echo "---------------------------------------------------------------"
echo "404-afhandeling"
echo "URL         : ${BASIS}${NIETBESTAAND}"
echo "HTTP        : $(status_zonder_volgen "${BASIS}${NIETBESTAAND}")   (verwacht: 404)"
echo

echo "---------------------------------------------------------------"
echo "robots.txt"
curl -sS --max-time 20 -A "$UA" "${BASIS}/robots.txt" 2>/dev/null | head -25
echo

echo "---------------------------------------------------------------"
echo "sitemap.xml"
sm="$(curl -sS --max-time 25 -A "$UA" "${BASIS}/sitemap.xml" 2>/dev/null)"
echo "URL-aantal    : $(grep -c '<loc>' <<<"$sm")"
echo "lastmod-set   : $(grep -o '<lastmod>[^<]*' <<<"$sm" | sed 's/<lastmod>//' | sort -u | tr '\n' ' ')"
echo "eerste 5 URLs :"
grep -o '<loc>[^<]*' <<<"$sm" | sed 's/<loc>/  /' | head -5
echo

echo "==============================================================="
echo "Einde. Deel deze uitvoer integraal; elke bevinding is eruit te herleiden."
echo "==============================================================="
