import { IntentDetector } from "../intents/detector";
import { EntityExtractor } from "../entities/entity_extractor";
import type { EntityService } from "../services/entity.service";
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

    const customer = this.entityExtractor.find(normalized, customers, x => x.customer_name)
    const location = this.entityExtractor.find(normalized, locations, x => x.name)
    const area = this.entityExtractor.find(normalized, areas, x => x.remark)

    return {
      intent: this.intentDetector.detect(tokens),
      customer,
      area,
      location,
      date: this.dateExtractor.extract(normalized)
    };
  }
}