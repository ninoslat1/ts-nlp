import type { Intent } from "../types/intent";

export class IntentDetector {
  constructor(
    private readonly intents: Record<Intent, string[]>
  ) {}

  detect(tokens: string[]): Intent | null {
    for (const [intent, keywords] of Object.entries(this.intents)) {
      if (tokens.some(token => keywords.includes(token))) {
        return intent as Intent;
      }
    }

    return null;
  }
}