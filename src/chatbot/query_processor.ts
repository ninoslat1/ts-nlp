import type { EntityValidator } from "../entities/validate_entities";
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

    this.analysisValidator.validate(result);

    await this.entityValidator.validateChain(result);

    return result;
  }
}
