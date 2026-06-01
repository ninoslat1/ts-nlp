import { distance } from "fastest-levenshtein";
import type { EntityService } from "../services/entity.service";
import type { TfIdf } from "./tf_idf";
import { cosine } from "../utils/vector";

export class NLPModule {
  constructor(
    private readonly tfidf: TfIdf,
    private readonly intents: { label: string; text: string }[],
    private readonly entityService: EntityService,
  ) {}

  private score(input: string, target: string) {
    const a = this.tfidf.transform(input);
    const b = this.tfidf.transform(target);

    const tfidfScore = cosine(a, b);

    const lev = distance(input, target);
    const maxLen = Math.max(input.length, target.length);

    const levScore = maxLen === 0 ? 1 : 1 - lev / maxLen;

    return tfidfScore * 0.7 + levScore * 0.3;
  }

  predict(text: string) {
    let best = {
      label: "",
      score: 0,
    };

    for (const intent of this.intents) {
      const score = this.score(text, intent.text);

      if (score > best.score) {
        best = {
          label: intent.label,
          score,
        };
      }
    }

    return best;
  }

  private findBestMatch<T>(text: string, items: T[], getText: (item: T) => string) {
    let bestMatch: T | null = null;
    let bestScore = 0;

    for (const item of items) {
      const score = this.score(text, getText(item));

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    return bestMatch;
  }

  extractEntities(text: string) {
    return {
      customer: this.findBestMatch(text, this.entityService.getCustomers(), (x) => x.customer_name),

      location: this.findBestMatch(text, this.entityService.getLocations(), (x) => x.name),

      area: this.findBestMatch(text, this.entityService.getAreas(), (x) => x.remark),
    };
  }
}
