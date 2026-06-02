import type { DateExtractor } from "../entities/date_extractor";
import type { AnalysisResult } from "../types/analysis";
import type { NLPModule } from "./nlp_module";
import type { QueryPreprocessor } from "./query_preprocessor";

export class QueryAnalyzer {
  constructor(
    private readonly dateExtractor: DateExtractor,
    private readonly nlpModule: NLPModule,
    private readonly queryPreprocessor: QueryPreprocessor,
  ) {}

  analyze(text: string): AnalysisResult {
    const normalized = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "");

    const date = this.dateExtractor.extract(normalized);

    const intent = this.nlpModule.predict(normalized);

    const intentKeyword = this.nlpModule.getIntentKeywords(intent.label);

    let entityText = normalized;

    entityText = this.queryPreprocessor.stripDate(entityText, date);

    entityText = this.queryPreprocessor.stripIntent(entityText, intentKeyword);

    entityText = this.queryPreprocessor.stripStopwords(entityText);

    const entities = this.nlpModule.extractEntities(entityText);

    const location = entities.location.type === "matched" ? entities.location.entity : null;

    const ambiguousLocations =
      entities.location.type === "ambiguous" ? entities.location.candidates : undefined;

    return {
      intent: intent.label,

      customer: entities.customer.entity,
      customerScore: entities.customer.score,

      location: location,
      ambiguousLocations,
      locationScore: entities.location.score,

      area: entities.area.entity,
      areaScore: entities.area.score,

      date: this.dateExtractor.extract(normalized),
    };
  }
}
