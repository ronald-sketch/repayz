/**
 * herstel-originele-status.js
 *
 * Tijdelijke Cloudflare Worker voor repayz.nl.
 *
 * PROBLEEM
 * De Manus-laag vervangt foutstatussen door 503 en zet er een `retry-after`
 * van 60 uur bij. De oorspronkelijke status blijft bewaard in de header
 * `x-manus-original-status`. Gemeten 25 augustus 2026:
 *
 *   HTTP/2 503
 *   retry-after: 216000
 *   x-manus-original-status: 404
 *
 * Voor Google is dat het verschil tussen "deze pagina bestaat niet" (404,
 * URL verdwijnt uit de index) en "server kan even niet, kom over 60 uur
 * terug" (503, URL blijft in de wachtrij). Structureel 503's kunnen de
 * crawlsnelheid voor het hele domein verlagen.
 *
 * WAT DEZE WORKER DOET
 * Precies één ding: is het antwoord een 503 mét die header, dan wordt de
 * oorspronkelijke status teruggezet en de `retry-after` verwijderd. Al het
 * andere verkeer gaat onaangeraakt door.
 *
 * VEILIGHEID
 * - `passThroughOnException()` staat bovenaan: gaat er iets mis in deze
 *   code, dan levert Cloudflare het oorspronkelijke antwoord alsnog uit.
 *   De site kan hier dus niet door omvallen.
 * - Er wordt niets aangeraakt bij een status die geen 503 is.
 * - Er wordt niets aangeraakt als de header ontbreekt of onzin bevat.
 * - De body gaat ongewijzigd door.
 *
 * ZELFUITSCHAKELEND
 * Lost Manus het probleem op, dan komt er geen 503-met-header meer langs en
 * doet deze Worker niets meer. Hij hoeft dan niet met spoed weg. Ruim hem
 * daarna wel op, zodat er geen twee lagen hetzelfde doen.
 */

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

    // Zelfde body, zelfde headers, alleen de status terug en de
    // "kom over 60 uur terug"-instructie eruit.
    const headers = new Headers(response.headers);
    headers.delete('retry-after');
    headers.set('x-status-hersteld-door', 'cloudflare-worker');

    return new Response(response.body, { status, headers });
  },
};
