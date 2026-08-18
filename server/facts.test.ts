import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ADDRESS, OPENING_HOURS, SCOOTERPOINT } from "@shared/facts";

/**
 * Bewaakt dat de bedrijfsfeiten maar op één plek staan: shared/facts.ts.
 *
 * Deze test faalt zodra een verboden variant van het adres, de postcode of
 * de openingstijden ergens letterlijk in de code terechtkomt. Dat is precies
 * de fout die eerder is gemaakt: dezelfde openingstijd stond op 48 plekken,
 * in drie varianten, waarvan geen enkele klopte.
 *
 * Scooterpoint zit op dezelfde locatie maar is een ander bedrijf met eigen
 * openingstijden. Regels die expliciet "Scooterpoint" noemen mogen daarom
 * afwijkende tijden bevatten — een adres of postcode nooit, want dat delen
 * ze.
 */

const REPO_ROOT = path.resolve(__dirname, "..");

const SCAN_DIRS = ["client/src", "server", "shared"];
const SCAN_FILES = ["client/public/content.json"];
const SCAN_EXTENSIONS = [".ts", ".tsx", ".json"];

/** Bestanden die per definitie feiten mogen bevatten. */
const ALLOWLIST = [
  "shared/facts.ts", // de bron zelf
];

type Rule = {
  name: string;
  pattern: RegExp;
  /** Mag op een regel staan die expliciet Scooterpoint noemt. */
  scooterpointExempt: boolean;
  hint: string;
};

const RULES: Rule[] = [
  {
    name: "huisnummer 20B",
    pattern: /Sprendlingenstraat[\s+]*20B/gi,
    scooterpointExempt: false,
    hint: "Gebruik ADDRESS.street of ADDRESS.full uit shared/facts.ts.",
  },
  {
    name: "afwijkende postcode",
    // Elke 5061-postcode die niet de bevestigde is.
    pattern: /5061\s+(?!KN\b)[A-Z]{2}\b/g,
    scooterpointExempt: false,
    hint: "Gebruik ADDRESS.postalCode uit shared/facts.ts.",
  },
  {
    name: "verboden openingstijd",
    pattern:
      /\b(10:00\s*-\s*21:00|10:00\s*-\s*18:00|10:00\s*-\s*22:00|07:00\s+tot\s+22:00)\b/g,
    scooterpointExempt: true,
    hint: "Gebruik OPENING_HOURS uit shared/facts.ts, of SCOOTERPOINT voor Scooterpoint.",
  },
  {
    name: "losse tijdliteral",
    // Elke HH:MM die niet de bevestigde open- of sluittijd is.
    pattern: /\b(?!07:00\b|23:00\b)(?:[01]\d|2[0-3]):[0-5]\d\b/g,
    scooterpointExempt: true,
    hint: "Tijden horen in shared/facts.ts te staan, niet in de code eromheen.",
  },
];

function collectFiles(): string[] {
  const found: string[] = [];

  const walk = (dir: string) => {
    const abs = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(abs)) return;
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      const rel = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === "dist") continue;
        walk(rel);
      } else if (SCAN_EXTENSIONS.includes(path.extname(entry.name))) {
        found.push(rel);
      }
    }
  };

  SCAN_DIRS.forEach(walk);
  for (const file of SCAN_FILES) {
    if (fs.existsSync(path.join(REPO_ROOT, file))) found.push(file);
  }

  return found.filter(rel => {
    const normalised = rel.split(path.sep).join("/");
    if (ALLOWLIST.includes(normalised)) return false;
    // De testbestanden zelf noemen de verboden varianten noodzakelijkerwijs.
    if (normalised.endsWith(".test.ts")) return false;
    return true;
  });
}

function findViolations(rule: Rule): string[] {
  const violations: string[] = [];

  for (const rel of collectFiles()) {
    const contents = fs.readFileSync(path.join(REPO_ROOT, rel), "utf-8");
    const lines = contents.split("\n");

    lines.forEach((line, index) => {
      if (rule.scooterpointExempt && /scooterpoint/i.test(line)) return;
      const matches = line.match(new RegExp(rule.pattern.source, rule.pattern.flags));
      if (!matches) return;
      violations.push(
        `${rel}:${index + 1}  ${matches.join(", ")}  →  ${line.trim().slice(0, 100)}`
      );
    });
  }

  return violations;
}

describe("bedrijfsfeiten staan alleen in shared/facts.ts", () => {
  it("scant daadwerkelijk bestanden", () => {
    // Vangnet: als het pad ooit verschuift, moet de test luidruchtig falen
    // in plaats van stilzwijgend nul bestanden te scannen en groen te worden.
    expect(collectFiles().length).toBeGreaterThan(50);
  });

  for (const rule of RULES) {
    it(`bevat nergens een ${rule.name}`, () => {
      const violations = findViolations(rule);
      expect(
        violations,
        `\n${violations.length} overtreding(en) van "${rule.name}".\n` +
          `${rule.hint}\n\n${violations.join("\n")}\n`
      ).toEqual([]);
    });
  }
});

describe("de feitenbron bevat de bevestigde waarden", () => {
  it("adres", () => {
    expect(ADDRESS.street).toBe("Sprendlingenstraat 20");
    expect(ADDRESS.postalCode).toBe("5061 KN");
    expect(ADDRESS.city).toBe("Oisterwijk");
    expect(ADDRESS.full).toBe("Sprendlingenstraat 20, 5061 KN Oisterwijk");
  });

  it("openingstijden", () => {
    expect(OPENING_HOURS.opens).toBe("07:00");
    expect(OPENING_HOURS.closes).toBe("23:00");
    expect(OPENING_HOURS.openHour).toBe(7);
    expect(OPENING_HOURS.closeHour).toBe(23);
    expect(OPENING_HOURS.schemaDays).toHaveLength(7);
  });

  it("houdt Scooterpoint gescheiden van REPAYZ", () => {
    expect(SCOOTERPOINT.range).not.toBe(OPENING_HOURS.range);
    expect(SCOOTERPOINT.name).toBe("Scooterpoint");
  });
});
