import { IntentDetector } from "../intents/detector";
import type { EntityService } from "../services/entity.service";
import type { DateExtractor } from "../entities/date_extractor";
import type { AnalysisResult } from "../types/analysis";

export class QueryAnalyzer {
  constructor(
    private readonly intentDetector: IntentDetector,
    private readonly entityService: EntityService,
    private readonly dateExtractor: DateExtractor,
  ) {}

  analyze(text: string): AnalysisResult {
    const normalized = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "");

    const tokens = normalized.split(/\s+/);
    const customer = this.entityService.getCustomerByName(normalized);
    const location = this.entityService.getLocationByName(normalized);
    const area = this.entityService.getAreaByName(normalized);

    return {
      intent: this.intentDetector.detect(tokens),
      customer,
      area,
      location,
      date: this.dateExtractor.extract(normalized),
    };
  }
}
