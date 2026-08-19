import { describe, expect, it } from "vitest";
import { amsterdamDateString } from "./machineBackbone";

/**
 * Bewaakt de datum die aan ePortal wordt gevraagd.
 *
 * De oude implementatie gebruikte `new Date().toISOString().split('T')[0]`,
 * wat de UTC-datum geeft. Tussen middernacht en 02:00 Amsterdamse tijd
 * (01:00 in de winter) is dat nog gisteren, dus vroeg de backbone elke nacht
 * een paar uur lang de verkeerde dag op. Dat was ook waarneembaar op de site:
 * tussen twaalf en twee stonden de cijfers van gisteren als "vandaag".
 *
 * Deze test legt precies dat venster vast.
 */
describe("amsterdamDateString", () => {
  const gevallen: Array<{ label: string; utc: string; verwacht: string }> = [
    // Zomertijd (CEST, UTC+2)
    { label: "zomer, 23:30 Amsterdam", utc: "2026-08-18T21:30:00Z", verwacht: "2026-08-18" },
    { label: "zomer, 00:00 Amsterdam", utc: "2026-08-18T22:00:00Z", verwacht: "2026-08-19" },
    { label: "zomer, 00:30 Amsterdam", utc: "2026-08-18T22:30:00Z", verwacht: "2026-08-19" },
    { label: "zomer, 01:59 Amsterdam", utc: "2026-08-18T23:59:00Z", verwacht: "2026-08-19" },
    { label: "zomer, 02:01 Amsterdam", utc: "2026-08-19T00:01:00Z", verwacht: "2026-08-19" },
    { label: "zomer, 12:00 Amsterdam", utc: "2026-08-19T10:00:00Z", verwacht: "2026-08-19" },

    // Wintertijd (CET, UTC+1)
    { label: "winter, 23:30 Amsterdam", utc: "2026-12-18T22:30:00Z", verwacht: "2026-12-18" },
    { label: "winter, 00:30 Amsterdam", utc: "2026-12-18T23:30:00Z", verwacht: "2026-12-19" },
    { label: "winter, 01:30 Amsterdam", utc: "2026-12-19T00:30:00Z", verwacht: "2026-12-19" },

    // Rond de overgang zomer- naar wintertijd (laatste zondag van oktober)
    { label: "overgang, 02:30 CEST", utc: "2026-10-25T00:30:00Z", verwacht: "2026-10-25" },
    { label: "overgang, 02:30 CET", utc: "2026-10-25T01:30:00Z", verwacht: "2026-10-25" },
  ];

  for (const { label, utc, verwacht } of gevallen) {
    it(`${label} -> ${verwacht}`, () => {
      expect(amsterdamDateString(new Date(utc))).toBe(verwacht);
    });
  }

  it("geeft het formaat YYYY-MM-DD", () => {
    expect(amsterdamDateString(new Date("2026-01-05T12:00:00Z"))).toBe("2026-01-05");
  });

  it("wijkt af van de UTC-datum in het nachtvenster", () => {
    // Dit is precies het geval dat eerder fout ging: als de twee gelijk zouden
    // zijn, is de UTC-implementatie teruggekeerd.
    const middernachtAms = new Date("2026-08-18T22:30:00Z"); // 00:30 Amsterdam
    expect(amsterdamDateString(middernachtAms)).not.toBe(
      middernachtAms.toISOString().split("T")[0]
    );
  });

  it("valt samen met de UTC-datum overdag", () => {
    const middag = new Date("2026-08-19T10:00:00Z"); // 12:00 Amsterdam
    expect(amsterdamDateString(middag)).toBe(middag.toISOString().split("T")[0]);
  });
});
