import { intentCorpus, intents } from "./static/INTENT";

import { QueryAnalyzer } from "./chatbot/query_analyzer";
import { QueryProcessor } from "./chatbot/query_processor";
import { NLPModule } from "./chatbot/nlp_module";
import { TfIdf } from "./chatbot/tf_idf";

import { IntentDetector } from "./intents/detector";

import { EntityService } from "./services/entity.service";

import { AreaRepository } from "./repositories/area.repository";
import { CustomerRepository } from "./repositories/customer.repository";
import { LocationRepository } from "./repositories/location.repository";

import { DateExtractor } from "./entities/date_extractor";
import { EntityValidator } from "./entities/validate_entities";

import { AnalysisValidator } from "./chatbot/validate_analyzer";

export class App {
  processor!: QueryProcessor;

  readonly entityService: EntityService;

  constructor() {
    this.entityService = new EntityService(
      new AreaRepository(),
      new CustomerRepository(),
      new LocationRepository(),
    );
  }

  async bootstrap() {
    console.log("Loading entities...");

    await this.entityService.init();

    console.log("Entities loaded");

    const tfidf = new TfIdf();

    const corpus = [
      ...intentCorpus.map((x) => x.text),

      ...this.entityService.getCustomers().map((x) => x.customer_name),

      ...this.entityService.getLocations().map((x) => x.name),

      ...this.entityService.getAreas().map((x) => x.remark),
    ];

    tfidf.fit(corpus);

    const nlpModule = new NLPModule(tfidf, intentCorpus, this.entityService);

    const analyzer = new QueryAnalyzer(new DateExtractor(), nlpModule);

    this.processor = new QueryProcessor(
      analyzer,
      new AnalysisValidator(),
      new EntityValidator(this.entityService),
    );
  }
}
