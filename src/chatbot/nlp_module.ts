import { distance } from "fastest-levenshtein";
import type { EntityService } from "../services/entity.service";
import type { TfIdf } from "./tf_idf";
import { cosine } from "../utils/vector";
import { GUARDRAILS } from "../static/GUARDRAIL";
import type { MatchResult } from "../types/filter";

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

  getIntentKeywords(label: string): string[] {
    return this.intents.filter((x) => x.label === label).map((x) => x.text);
  }

  private findBestMatch<T>(text: string, items: T[], getText: (item: T) => string): MatchResult<T> {
    const candidates: {
      item: T;
      score: number;
    }[] = [];

    for (const item of items) {
      const score = this.score(text, getText(item));

      candidates.push({
        item,
        score,
      });
    }

    candidates.sort((a, b) => b.score - a.score);

    const best = candidates[0];
    const second = candidates[1];

    if (!best || best.score < GUARDRAILS.minEntityScore) {
      return {
        entity: null,
        score: 0,
        type: "not_found",
      };
    }

    if (second && Math.abs(best.score - second.score) < 0.05) {
      return {
        type: "ambiguous",
        entity: null,
        score: 0,
        candidates: [best.item, second.item],
      };
    }

    return {
      type: "matched",
      entity: best.item,
      score: best.score,
    };
  }

  extractEntities(text: string) {
    const customer = this.findBestMatch(
      text,
      this.entityService.getCustomers(),
      (x) => x.customer_name,
    );
    return {
      customer,

      location: this.findBestMatch(text, this.entityService.getLocations(), (x) => x.name),

      area: this.findBestMatch(text, this.entityService.getAreas(), (x) => x.remark),
    };
  }
}
