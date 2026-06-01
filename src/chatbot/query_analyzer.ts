import type { DateExtractor } from "../entities/date_extractor";
import type { AnalysisResult } from "../types/analysis";
import type { NLPModule } from "./nlp_module";

export class QueryAnalyzer {
  constructor(
    private readonly dateExtractor: DateExtractor,
    private readonly nlpModule: NLPModule,
  ) {}

  analyze(text: string): AnalysisResult {
    const normalized = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "");

    const entities = this.nlpModule.extractEntities(normalized);

    const mlIntent = this.nlpModule.predict(normalized);

    return {
      intent: mlIntent.label,
      customer: entities.customer,
      location: entities.location,
      area: entities.area,
      date: this.dateExtractor.extract(normalized),
    };
  }
}
