import { describe, expect, it } from "vitest";
import { applyMidnightRollover, type LifetimeCache } from "./machineBackbone";

/**
 * Bewaakt de boekhouding van de levenstellers.
 *
 * Deze cijfers staan op de homepage. De oude implementatie had twee fouten
 * die de teller alleen omhoog konden laten drijven, zonder mogelijkheid tot
 * correctie:
 *
 *  - de conditie was een OR maar hoogde beide categorieen op;
 *  - er was geen datumcontrole, dus elke API-hapering met een lager getal
 *    werd als dagovergang gelezen.
 */

const basis = (over: Partial<LifetimeCache> = {}): LifetimeCache => ({
  accumulatedBottles: 1000,
  accumulatedCans: 2000,
  lastDailyBottles: 40,
  lastDailyCans: 60,
  lastPolledDate: "2026-08-18",
  ...over,
});

describe("applyMidnightRollover", () => {
  it("telt niets op als de dag niet is veranderd", () => {
    const { cache, rolloverToegepast } = applyMidnightRollover(
      basis(),
      45,
      65,
      "2026-08-18"
    );
    expect(rolloverToegepast).toBe(false);
    expect(cache.accumulatedBottles).toBe(1000);
    expect(cache.accumulatedCans).toBe(2000);
    expect(cache.lastDailyBottles).toBe(45);
    expect(cache.lastDailyCans).toBe(65);
  });

  it("telt beide categorieen op bij een echte dagovergang", () => {
    const { cache, rolloverToegepast } = applyMidnightRollover(
      basis(),
      0,
      0,
      "2026-08-19"
    );
    expect(rolloverToegepast).toBe(true);
    expect(cache.accumulatedBottles).toBe(1040);
    expect(cache.accumulatedCans).toBe(2060);
    expect(cache.lastPolledDate).toBe("2026-08-19");
  });

  it("telt alleen de categorie op die daadwerkelijk is teruggezet", () => {
    // Dit is de asymmetrische dubbeltelling uit de oude code: flessen zakken,
    // blikjes niet. Oud gedrag telde beide op.
    const { cache } = applyMidnightRollover(basis(), 0, 75, "2026-08-19");
    expect(cache.accumulatedBottles).toBe(1040); // wel opgeteld
    expect(cache.accumulatedCans).toBe(2000); // niet opgeteld
  });

  it("negeert een daling binnen dezelfde dag", () => {
    // Een hapering van de ePortal-API die een lager getal teruggeeft, mag
    // geen dagovergang zijn. Oud gedrag telde hier permanent 40 en 60 op.
    const { cache, rolloverToegepast } = applyMidnightRollover(
      basis(),
      3,
      5,
      "2026-08-18"
    );
    expect(rolloverToegepast).toBe(false);
    expect(cache.accumulatedBottles).toBe(1000);
    expect(cache.accumulatedCans).toBe(2000);
  });

  it("telt niet op als de dag wel verandert maar de tellers niet zakken", () => {
    // Kan gebeuren als de machine 's nachts open is en er direct na
    // middernacht al meer is ingeleverd dan de vorige dag totaal.
    const { cache, rolloverToegepast } = applyMidnightRollover(
      basis({ lastDailyBottles: 5, lastDailyCans: 5 }),
      10,
      10,
      "2026-08-19"
    );
    expect(rolloverToegepast).toBe(false);
    expect(cache.accumulatedBottles).toBe(1000);
    expect(cache.accumulatedCans).toBe(2000);
  });

  it("valt bij een verse start terug op vergelijken op waarde", () => {
    // Na een herstart komt de cache uit de database en kan hij van gisteren
    // zijn. lastPolledDate is dan onbekend.
    const { cache, rolloverToegepast } = applyMidnightRollover(
      basis({ lastPolledDate: undefined }),
      0,
      0,
      "2026-08-19"
    );
    expect(rolloverToegepast).toBe(true);
    expect(cache.accumulatedBottles).toBe(1040);
    expect(cache.accumulatedCans).toBe(2060);
  });

  it("muteert de meegegeven cache niet", () => {
    const origineel = basis();
    applyMidnightRollover(origineel, 0, 0, "2026-08-19");
    expect(origineel.accumulatedBottles).toBe(1000);
    expect(origineel.lastPolledDate).toBe("2026-08-18");
  });

  it("houdt de teller stabiel over een reeks pollings op een dag", () => {
    // Twaalf pollings op één dag met oplopende waarden mogen samen niets
    // aan het geaccumuleerde totaal toevoegen.
    let cache = basis({ lastDailyBottles: 0, lastDailyCans: 0 });
    for (let i = 1; i <= 12; i++) {
      cache = applyMidnightRollover(cache, i * 3, i * 4, "2026-08-19").cache;
    }
    expect(cache.accumulatedBottles).toBe(1000);
    expect(cache.accumulatedCans).toBe(2000);
    expect(cache.lastDailyBottles).toBe(36);
    expect(cache.lastDailyCans).toBe(48);
  });

  it("telt over drie dagen precies drie keer op", () => {
    let cache = basis({
      accumulatedBottles: 0,
      accumulatedCans: 0,
      lastDailyBottles: 0,
      lastDailyCans: 0,
      lastPolledDate: "2026-08-17",
    });

    for (const [dag, flessen, blikjes] of [
      ["2026-08-17", 100, 200],
      ["2026-08-18", 150, 250],
      ["2026-08-19", 120, 220],
    ] as const) {
      // per dag twee pollings: een tussenstand en een eindstand
      cache = applyMidnightRollover(cache, 0, 0, dag).cache;
      cache = applyMidnightRollover(cache, flessen, blikjes, dag).cache;
    }

    // Dag 17 en 18 zijn afgesloten; dag 19 loopt nog en zit in lastDaily.
    expect(cache.accumulatedBottles).toBe(100 + 150);
    expect(cache.accumulatedCans).toBe(200 + 250);
    expect(cache.lastDailyBottles).toBe(120);
  });
});
