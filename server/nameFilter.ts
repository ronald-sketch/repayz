import { invokeLLM } from "./_core/llm";

interface NameCheckResult {
  isAllowed: boolean;
  reason?: string;
}

/**
 * AI-based name filter using LLM
 * Checks if a name is appropriate for a public leaderboard
 * Handles profanity, leet-speak, creative variants, and context
 */
export async function checkNameWithAI(name: string): Promise<NameCheckResult> {
  // Quick checks for obviously valid names
  if (!name || name.trim().length === 0) {
    return { isAllowed: false, reason: "Naam mag niet leeg zijn" };
  }
  
  if (name.length > 50) {
    return { isAllowed: false, reason: "Naam is te lang (max 50 tekens)" };
  }
  
  if (name.length < 2) {
    return { isAllowed: false, reason: "Naam is te kort (min 2 tekens)" };
  }

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `Je bent een content moderator voor een publiek leaderboard van een recycling app in Nederland.

Je taak is om te bepalen of een naam gepast is voor publiek gebruik.

BLOKKEER namen die:
- Scheldwoorden bevatten (Nederlands of Engels)
- Seksuele of vulgaire termen bevatten
- Discriminerend of beledigend zijn
- Leet-speak varianten van scheldwoorden zijn (bijv. "f*ck", "sh1t", "kl00tzak")
- Creatieve spellingen van ongepaste woorden zijn
- Haatdragende of gewelddadige content bevatten

ACCEPTEER namen die:
- Normale voornamen of bijnamen zijn
- Bedrijfsnamen of teamnamen zijn
- Grappig maar niet beledigend zijn
- Nummers of symbolen bevatten maar verder gepast zijn

Antwoord ALLEEN met een JSON object in dit formaat:
{"allowed": true} of {"allowed": false, "reason": "korte reden"}

Geen andere tekst, alleen het JSON object.`
        },
        {
          role: "user",
          content: `Controleer deze naam: "${name}"`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "name_check",
          strict: true,
          schema: {
            type: "object",
            properties: {
              allowed: { type: "boolean", description: "Of de naam toegestaan is" },
              reason: { type: "string", description: "Reden voor blokkade (alleen bij allowed=false)" }
            },
            required: ["allowed"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      // If AI fails, allow the name (fail open for UX)
      console.warn("[NameFilter] AI response empty, allowing name:", name);
      return { isAllowed: true };
    }

    // Handle both string and array content types
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const result = JSON.parse(contentStr);
    return {
      isAllowed: result.allowed,
      reason: result.reason
    };
  } catch (error) {
    // If AI fails, allow the name (fail open for UX)
    console.error("[NameFilter] AI check failed:", error);
    return { isAllowed: true };
  }
}

/**
 * Simple fallback filter for when AI is unavailable
 * Uses a basic list of blocked words
 */
const BLOCKED_WORDS = [
  // Dutch
  "kut", "lul", "hoer", "kanker", "tering", "tyfus", "klootzak", "eikel",
  "flikker", "mof", "neger", "nikker", "mongool", "debiel", "idioot",
  "godverdomme", "godver", "klerelijer", "kutwijf", "teringlijer",
  // English
  "fuck", "shit", "bitch", "ass", "dick", "cock", "pussy", "cunt",
  "nigger", "faggot", "retard"
];

export function checkNameBasic(name: string): NameCheckResult {
  const lowerName = name.toLowerCase().replace(/[^a-z]/g, "");
  
  for (const word of BLOCKED_WORDS) {
    if (lowerName.includes(word)) {
      return { isAllowed: false, reason: "Naam bevat ongepaste woorden" };
    }
  }
  
  return { isAllowed: true };
}

/**
 * Main entry point - tries AI first, falls back to basic filter
 */
export async function validateName(name: string): Promise<NameCheckResult> {
  // First do basic validation
  if (!name || name.trim().length === 0) {
    return { isAllowed: false, reason: "Naam mag niet leeg zijn" };
  }
  
  if (name.length > 50) {
    return { isAllowed: false, reason: "Naam is te lang (max 50 tekens)" };
  }
  
  if (name.length < 2) {
    return { isAllowed: false, reason: "Naam is te kort (min 2 tekens)" };
  }

  // Try AI-based check
  try {
    return await checkNameWithAI(name);
  } catch {
    // Fall back to basic check
    return checkNameBasic(name);
  }
}
