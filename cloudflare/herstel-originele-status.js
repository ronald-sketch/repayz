/**
 * herstel-originele-status.js
 *
 * Tijdelijke Cloudflare Worker voor repayz.nl.
 *
 * PROBLEEM (gemeten 25 augustus 2026)
 * De Manus-laag beantwoordt onbekende URL's met een onderhoudspagina en de
 * status 503, plus een `retry-after` van 60 uur. De oorspronkelijke status
 * blijft bewaard in de header `x-manus-original-status`:
 *
 *   HTTP/2 503
 *   retry-after: 216000
 *   x-manus-original-status: 404
 *   <title>Site under maintenance</title>
 *
 * Twee problemen tegelijk. Voor Google is 503 "kom over 60 uur terug" in
 * plaats van "deze pagina bestaat niet", waardoor dode URL's in de index
 * blijven hangen en de crawlsnelheid voor het hele domein omlaag kan gaan.
 * Voor bezoekers is het een Engelstalige storingsmelding op een moment dat
 * er niets aan de hand is.
 *
 * WAT DEZE WORKER DOET
 * Is het antwoord een 503 met die header, dan:
 *   - wordt de oorspronkelijke status teruggezet
 *   - wordt de `retry-after` verwijderd
 *   - wordt bij een 404 de onderhoudspagina vervangen door een echte,
 *     Nederlandse 404-pagina
 * Al het andere verkeer gaat onaangeraakt door.
 *
 * VEILIGHEID
 * - `passThroughOnException()` staat bovenaan: gaat er iets mis in deze
 *   code, dan levert Cloudflare het oorspronkelijke antwoord alsnog uit.
 *   De site kan hier niet door omvallen.
 * - Er wordt niets aangeraakt bij een status die geen 503 is, of als de
 *   header ontbreekt of onzin bevat.
 * - Bij het vervangen van de body worden verse headers gebouwd. De headers
 *   van het origineel worden dan NIET overgenomen, omdat `content-encoding`
 *   en `content-length` daarin bij de oude body horen.
 *
 * ZELFUITSCHAKELEND
 * Zet Manus de onderhoudsstand uit, dan komt er geen 503-met-header meer
 * langs en doet deze Worker niets meer. Ruim hem daarna op.
 */

const PAGINA_404 = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pagina niet gevonden — REPAYZ</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex;
    align-items: center; justify-content: center; padding: 24px;
    font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    background: #ffffff; color: #1a1a1a;
  }
  main { max-width: 34rem; text-align: center; }
  .code { font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; color: #6b7280; margin: 0 0 .75rem; }
  h1 { font-size: 1.75rem; line-height: 1.25; margin: 0 0 .75rem; }
  p { margin: 0 0 1.5rem; color: #4b5563; }
  nav { display: flex; flex-wrap: wrap; gap: .5rem; justify-content: center; }
  a {
    display: inline-block; padding: .6rem 1.1rem; border-radius: 999px;
    text-decoration: none; border: 1px solid #d1d5db; color: #1a1a1a;
  }
  a.primair { background: #16a34a; border-color: #16a34a; color: #fff; }
  a:hover { border-color: #9ca3af; }
  a.primair:hover { background: #15803d; border-color: #15803d; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f1115; color: #f3f4f6; }
    p, .code { color: #9ca3af; }
    a { border-color: #374151; color: #f3f4f6; }
    a:hover { border-color: #6b7280; }
  }
</style>
</head>
<body>
<main>
  <p class="code">Foutcode 404</p>
  <h1>Deze pagina bestaat niet</h1>
  <p>Misschien is het adres verkeerd overgenomen of is de pagina verplaatst.</p>
  <nav>
    <a class="primair" href="/">Naar de homepage</a>
    <a href="/locatie">Locatie</a>
    <a href="/hoe-het-werkt">Hoe het werkt</a>
    <a href="/faq">Veelgestelde vragen</a>
  </nav>
</main>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    // Gaat er hieronder iets mis, dan levert Cloudflare het originele
    // antwoord uit in plaats van een foutpagina. Dit moet als eerste.
    ctx.passThroughOnException();

    const response = await fetch(request);

    // Alleen ingrijpen bij precies het gemeten geval.
    if (response.status !== 503) return response;

    const bewaard = response.headers.get('x-manus-original-status');
    if (!bewaard) return response;

    const status = Number.parseInt(bewaard, 10);
    if (!Number.isInteger(status) || status < 200 || status > 599) return response;

    // Bij een 404 vervangen we ook de onderhoudspagina. Verse headers, want
    // content-encoding en content-length van het origineel horen bij de
    // oude body en zouden het antwoord onleesbaar maken.
    if (status === 404) {
      return new Response(PAGINA_404, {
        status: 404,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
          'x-status-hersteld-door': 'cloudflare-worker',
        },
      });
    }

    // Andere statussen: alleen de status terug en de "kom over 60 uur
    // terug"-instructie eruit. De body blijft ongewijzigd, dus de
    // oorspronkelijke headers passen er nog bij.
    const headers = new Headers(response.headers);
    headers.delete('retry-after');
    headers.set('x-status-hersteld-door', 'cloudflare-worker');

    return new Response(response.body, { status, headers });
  },
};
