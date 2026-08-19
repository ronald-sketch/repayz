#!/usr/bin/env bash
#
# acceptatie.sh — de definitie van "klaar" voor repayz.nl.
#
# Dit script beweert niets, het controleert. Elke test kent het juiste antwoord
# en geeft GOED of FOUT. Aan het eind staat er een score en de exitcode is 0 als
# alles klopt en 1 als er iets faalt.
#
# Bedoeld om te draaien VOORDAT iemand zegt dat het gerepareerd is, en daarna
# opnieuw bij elke publicatie om te zien of het zo blijft.
#
#   bash scripts/acceptatie.sh                       # tegen https://repayz.nl
#   bash scripts/acceptatie.sh http://localhost:3000 # tegen een testomgeving
#
# Alleen curl en shell-tools nodig.

set -uo pipefail

BASIS="${1:-https://repayz.nl}"
UA="Mozilla/5.0 (compatible; REPAYZ-acceptatie/1.0)"

GOED=0
FOUT=0
FOUTEN=()

groen()  { printf '  \033[32mGOED\033[0m  %s\n' "$1"; GOED=$((GOED+1)); }
rood()   { printf '  \033[31mFOUT\033[0m  %s\n' "$1"; printf '        verwacht : %s\n        gevonden : %s\n' "$2" "$3"; FOUT=$((FOUT+1)); FOUTEN+=("$1"); }
kop()    { printf '\n\033[1m%s\033[0m\n' "$1"; }

haal()   { curl -sSL --max-time 25 -A "$UA" "$1" 2>/dev/null; }
code()   { curl -sS -o /dev/null --max-time 25 -A "$UA" -w "%{http_code}" "$1" 2>/dev/null; }

# ---------------------------------------------------------------- bevestigde feiten
ADRES="Sprendlingenstraat 20"
POSTCODE="5061 KN"
OPENT="07:00"
SLUIT="23:00"

VERBODEN_ADRES='Sprendlingenstraat 20B|Sprendlingenstraat\+20B'
VERBODEN_POSTCODE='5061 K[^N]|5061 J[A-Z]'
VERBODEN_TIJD='10:00 ?- ?21:00|10:00-18:00|10:00 - 18:00|07:00 tot 22:00|10:00-22:00'
VERBODEN_TELEFOON='12345678|XXX-XXXXXX'

ROUTES_NL="/ /locatie /hoe-het-werkt /faq /statiegeld-inleveren /statiegeld-nederland /statiegeld-udenhout /statiegeld-tilburg /vinted-locker-boxtel"
ROUTES_INT="/en /en-tilburg /pl /pl-tilburg /ro-boxtel /ua-den-bosch"

echo "==============================================================="
echo " REPAYZ acceptatietest"
echo " Doel   : $BASIS"
echo " Datum  : $(date -u '+%Y-%m-%d %H:%M:%SZ') (UTC)"
echo " Methode: GET zonder JavaScript"
echo "==============================================================="

# ================================================================== 1. bereikbaarheid
kop "1. Elke route levert een pagina"
for r in $ROUTES_NL $ROUTES_INT; do
  c="$(code "${BASIS}${r}")"
  if [ "$c" = "200" ]; then groen "$r -> 200"; else rood "$r" "200" "${c:-geen antwoord}"; fi
done

kop "2. Een onbekende route geeft 404"
NEP="/bestaat-niet-acceptatietest-$$"
c="$(code "${BASIS}${NEP}")"
if [ "$c" = "404" ]; then groen "$NEP -> 404"; else rood "$NEP" "404" "$c"; fi

# ================================================================== 3. canonical
kop "3. Elke pagina verwijst naar zichzelf als canonical"
for r in $ROUTES_NL $ROUTES_INT; do
  html="$(haal "${BASIS}${r}")"
  can="$(grep -o '<link[^>]*rel="canonical"[^>]*>' <<<"$html" | head -1 | grep -o 'href="[^"]*"' | sed 's/href="//; s/"//')"
  verwacht="${BASIS}${r}"
  # De homepage mag met of zonder afsluitende slash: https://host en https://host/
  # zijn dezelfde URL en worden door elke client en door Google genormaliseerd.
  if [ "$r" = "/" ]; then
    if [ "$can" = "${BASIS}/" ] || [ "$can" = "${BASIS}" ]; then
      groen "$r (canonical: $can)"
    else
      rood "$r canonical" "${BASIS}/ of ${BASIS}" "${can:-ONTBREEKT}"
    fi
  elif [ "$can" = "$verwacht" ]; then
    groen "$r"
  else
    rood "$r canonical" "$verwacht" "${can:-ONTBREEKT}"
  fi
done

# ================================================================== 4. H1 en server-content
kop "4. Er staat inhoud in de HTML, niet alleen een leeg React-omhulsel"
for r in / /locatie /statiegeld-udenhout /en-tilburg; do
  html="$(haal "${BASIS}${r}")"
  h1="$(grep -o '<h1[^>]*>' <<<"$html" | head -1)"
  if [ -n "$h1" ]; then groen "$r heeft een H1 in de bron"; else rood "$r H1" "een <h1> in de HTML" "geen"; fi
done

# ================================================================== 5. taalattribuut
kop "5. Het lang-attribuut past bij de taal van de pagina"
declare -A TAAL=( ["/"]="nl" ["/locatie"]="nl" ["/en"]="en" ["/en-tilburg"]="en" ["/pl"]="pl" ["/pl-tilburg"]="pl" ["/ro-boxtel"]="ro" ["/ua-den-bosch"]="uk" )
for r in "${!TAAL[@]}"; do
  html="$(haal "${BASIS}${r}")"
  l="$(grep -o '<html[^>]*lang="[^"]*"' <<<"$html" | head -1 | grep -o 'lang="[^"]*"' | sed 's/lang="//; s/"//')"
  if [[ "$l" == "${TAAL[$r]}"* ]]; then groen "$r -> lang=$l"; else rood "$r lang" "${TAAL[$r]}" "${l:-ONTBREEKT}"; fi
done

# ================================================================== 6. hreflang
kop "6. hreflang staat in de HTML en verwijst wederkerig"
for r in $ROUTES_INT; do
  html="$(haal "${BASIS}${r}")"
  n="$(grep -c 'rel="alternate"[^>]*hreflang=\|hreflang="[^"]*"[^>]*rel="alternate"' <<<"$html")"
  if [ "$n" -gt 0 ]; then groen "$r heeft $n hreflang-tag(s) in de bron"; else rood "$r hreflang" "minstens 1 tag" "0"; fi
done

echo "  -- wederkerigheid --"
for r in /en /pl /en-tilburg /pl-tilburg /ro-boxtel; do
  html="$(haal "${BASIS}${r}")"
  zelf="${BASIS}${r}"
  # verwijst de pagina naar zichzelf?
  if grep -q "hreflang=\"[^\"]*\"[^>]*href=\"${zelf}\"\|href=\"${zelf}\"[^>]*hreflang=" <<<"$html"; then
    groen "$r noemt zichzelf in zijn eigen hreflang-set"
  else
    rood "$r zelfverwijzing" "een hreflang-tag naar $zelf" "niet aanwezig"
  fi
  # pakt een van de alternatieven en kijkt of die terugwijst
  ander="$(grep -o 'hreflang="[^"]*"[^>]*href="[^"]*"' <<<"$html" | grep -o 'href="[^"]*"' | sed 's/href="//; s/"//' | grep -v "^${zelf}$" | grep -v 'x-default' | head -1)"
  if [ -n "$ander" ]; then
    terug="$(haal "$ander")"
    if grep -q "href=\"${zelf}\"" <<<"$terug"; then
      groen "$ander wijst terug naar $r"
    else
      rood "wederkerigheid $r <-> $ander" "$ander noemt $zelf" "doet dat niet"
    fi
  fi
done

echo "  -- verwijzen de hreflang-tags naar bestaande pagina's? --"
gecontroleerd=""
dood=0
for r in $ROUTES_INT; do
  html="$(haal "${BASIS}${r}")"
  doelen="$(grep -o 'hreflang="[^"]*"[^>]*href="[^"]*"' <<<"$html" \
    | grep -o 'href="[^"]*"' | sed 's/href="//; s/"//' | sort -u)"
  while IFS= read -r d; do
    [ -z "$d" ] && continue
    case " $gecontroleerd " in *" $d "*) continue ;; esac
    gecontroleerd="$gecontroleerd $d"
    c="$(code "$d")"
    if [ "$c" != "200" ]; then
      rood "hreflang-doel $d (genoemd op $r)" "200" "$c"
      dood=$((dood+1))
    fi
  done <<<"$doelen"
done
if [ "$dood" -eq 0 ]; then
  aantal="$(printf '%s' "$gecontroleerd" | wc -w | tr -d ' ')"
  groen "alle $aantal unieke hreflang-doelen geven 200"
fi

# ================================================================== 7. bedrijfsfeiten
kop "7. De bedrijfsfeiten kloppen en er staat geen verboden variant in"
for r in / /locatie /faq /statiegeld-udenhout; do
  html="$(haal "${BASIS}${r}")"

  if grep -qE "$VERBODEN_ADRES" <<<"$html"; then
    rood "$r huisnummer" "$ADRES" "bevat 20B"
  else groen "$r geen 20B"; fi

  if grep -qE "$VERBODEN_POSTCODE" <<<"$html"; then
    rood "$r postcode" "$POSTCODE" "$(grep -oE '5061 [A-Z]{2}' <<<"$html" | sort -u | tr '\n' ' ')"
  else groen "$r postcode in orde"; fi

  if grep -qE "$VERBODEN_TIJD" <<<"$html"; then
    rood "$r openingstijd" "${OPENT}-${SLUIT}" "$(grep -oE "$VERBODEN_TIJD" <<<"$html" | sort -u | tr '\n' ' ')"
  else groen "$r geen verboden openingstijd"; fi

  if grep -qE "$VERBODEN_TELEFOON" <<<"$html"; then
    rood "$r telefoonnummer" "een echt nummer of geen" "plaatshouder aanwezig"
  else groen "$r geen plaatshouder-telefoonnummer"; fi
done

kop "8. De JSON-LD geeft geen gesloten dagen door"
for r in / /statiegeld-nederland /statiegeld-udenhout; do
  html="$(haal "${BASIS}${r}")"
  if grep -q '"opens"[[:space:]]*:[[:space:]]*"00:00"' <<<"$html"; then
    rood "$r JSON-LD" "geen gesloten-dagblok" "bevat opens 00:00"
  else groen "$r geen gesloten-dagblok"; fi
done

# ================================================================== 9. interne links
kop "9. De landingspagina's zijn intern gelinkt in de HTML"
html="$(haal "${BASIS}/")"
# /statiegeld-inleveren en /statiegeld-nederland zijn kernpaginas, geen dorpspaginas.
dorpen="$(grep -o 'href="/statiegeld-[a-z-]*"' <<<"$html" \
  | sed 's/href="//; s/"//' \
  | grep -vE '^/statiegeld-(inleveren|nederland|wiki)$' \
  | sort -u)"
n="$(printf '%s' "$dorpen" | grep -c . || true)"
if [ "$n" -ge 3 ]; then
  groen "homepage linkt naar $n dorpspagina's: $(printf '%s' "$dorpen" | tr '\n' ' ')"
else
  rood "echte dorpslinks vanaf de homepage" "minstens 3" "$n ($(printf '%s' "$dorpen" | tr '\n' ' '))"
fi

# ================================================================== 10. sitemap
kop "10. De sitemap is actueel"
sm="$(haal "${BASIS}/sitemap.xml")"
aantal="$(grep -c '<loc>' <<<"$sm")"
if [ "$aantal" -gt 0 ]; then groen "sitemap bevat $aantal URL's"; else rood "sitemap" "URL's" "leeg of niet gevonden"; fi

nieuwste="$(grep -o '<lastmod>[^<]*' <<<"$sm" | sed 's/<lastmod>//' | cut -c1-10 | sort | tail -1)"
if [ -n "$nieuwste" ]; then
  grens="$(date -u -d '120 days ago' '+%Y-%m-%d' 2>/dev/null || date -u -v-120d '+%Y-%m-%d' 2>/dev/null || echo "")"
  if [ -z "$grens" ] || [[ "$nieuwste" > "$grens" ]]; then
    groen "nieuwste lastmod is $nieuwste"
  else
    rood "sitemap lastmod" "niet ouder dan $grens" "$nieuwste"
  fi
fi

kop "11. Elke URL in de sitemap bestaat ook echt"
# Dit vangt het geval dat er dode URL's aan Google worden gevoed. Bij meer dan
# 40 URL's wordt er een steekproef genomen, anders duurt de test te lang.
# De sitemap bevat absolute productie-URL's. Draai je tegen een testomgeving,
# dan wordt de host omgezet naar BASIS, zodat dezelfde paden daar worden getoetst.
mapped="$(grep -o '<loc>[^<]*' <<<"$sm" | sed 's/<loc>//' \
  | sed -E "s#^https?://[^/]+#${BASIS}#")"
totaal="$(printf '%s' "$mapped" | grep -c . || true)"
if [ "$totaal" -gt 40 ]; then
  # elke n-de URL, zodat de steekproef over de hele sitemap verdeeld is
  stap=$(( totaal / 30 + 1 ))
  steek="$(printf '%s\n' "$mapped" | awk -v s="$stap" 'NR % s == 1')"
  echo "  (steekproef: elke ${stap}e van $totaal URL's)"
else
  steek="$mapped"
fi
dood=0
while IFS= read -r u; do
  [ -z "$u" ] && continue
  c="$(code "$u")"
  if [ "$c" != "200" ]; then
    rood "sitemap-URL $u" "200" "$c"
    dood=$((dood+1))
  fi
done <<<"$steek"
[ "$dood" -eq 0 ] && groen "alle gecontroleerde sitemap-URL's geven 200"

# ================================================================== uitkomst
echo
echo "==============================================================="
printf " Uitkomst: \033[32m%d goed\033[0m, \033[31m%d fout\033[0m\n" "$GOED" "$FOUT"
if [ "$FOUT" -gt 0 ]; then
  echo
  echo " Wat er nog niet klopt:"
  for f in "${FOUTEN[@]}"; do echo "   - $f"; done
  echo
  echo " Nog niet klaar."
  echo "==============================================================="
  exit 1
fi
echo
echo " Alles groen. Dit is de definitie van klaar."
echo "==============================================================="
exit 0
