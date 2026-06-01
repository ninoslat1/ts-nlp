import { intents } from "../static/INTENT";

export function detectIntent(tokens: string[]) {
  for (const [intent, keywords] of Object.entries(intents)) {
    if (tokens.some(token => keywords.includes(token))) {
      return intent;
    }
  }

  return null;
}