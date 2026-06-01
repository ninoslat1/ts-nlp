import { IntentDetector } from "../intents/detector";
import { EntityExtractor } from "../entities/entity_extractor";
import type { EntityService } from "../services/entity.service";
import type { Intent } from "../types/intent";
import type { DateExtractor } from "../entities/date_extractor";
import type { AnalysisResult } from "../types/analysis";

export class QueryAnalyzer {
  constructor(
    private readonly intentDetector: IntentDetector,
    private readonly entityExtractor: EntityExtractor,
    private readonly entityService: EntityService,
    private readonly dateExtractor: DateExtractor
  ) {}

  analyze(text: string): AnalysisResult {

    const normalized = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "");

    const tokens = normalized.split(/\s+/);
    const areas = this.entityService.getAreas();
    const customers = this.entityService.getCustomers();
    const locations = this.entityService.getLocations();

    return {
      intent: this.intentDetector.detect(tokens),
      customer: this.entityExtractor.find(normalized, customers, x => x.customer_name),
      area: this.entityExtractor.find(normalized, areas, x => x.remark),
      location: this.entityExtractor.find(normalized, locations, x => x.name),
      date: this.dateExtractor.extract(normalized)
    };
  }
}