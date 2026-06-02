import type { EntityValidator } from "../entities/validate_entities";
import { AmbiguousEntityError } from "../utils/error";
import type { QueryAnalyzer } from "./query_analyzer";
import type { AnalysisValidator } from "./validate_analyzer";

export class QueryProcessor {
  constructor(
    private analyzer: QueryAnalyzer,
    private analysisValidator: AnalysisValidator,
    private entityValidator: EntityValidator,
  ) {}

  async process(text: string) {
    const result = this.analyzer.analyze(text);

    if (result.ambiguousLocations) {
      console.log(result.ambiguousLocations.map((x) => x.name));

      throw new AmbiguousEntityError("Maaf, ada dua lokasi yang sesuai dengan permintaan Anda");
    }

    this.analysisValidator.validate(result);

    this.entityValidator.validateChain(result);

    return result;
  }
}
