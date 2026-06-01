import { intents } from "./static/INTENT";

import { QueryAnalyzer } from "./chatbot/query_analyzer";
import { QueryProcessor } from "./chatbot/query_processor";

import { IntentDetector } from "./intents/detector";
import { EntityExtractor } from "./entities/entity_extractor";

import { EntityService } from "./services/entity.service";

import { AreaRepository } from "./repositories/area.repository";
import { CustomerRepository } from "./repositories/customer.repository";
import { LocationRepository } from "./repositories/location.repository";
import { DateExtractor } from "./entities/date_extractor";
import { AnalysisValidator } from "./chatbot/validate_analyzer";
import { EntityValidator } from "./entities/validate_entities";

export class App {
    readonly processor: QueryProcessor;
    readonly entityService: EntityService;

    constructor() {
        this.entityService = new EntityService(
            new AreaRepository(),
            new CustomerRepository(),
            new LocationRepository()
        );

        const analyzer = new QueryAnalyzer(
            new IntentDetector(intents),
            new EntityExtractor(),
            this.entityService,
            new DateExtractor()
        );

        const analysisValidator = new AnalysisValidator();

        const entityValidator = new EntityValidator(
            new LocationRepository(),
            new AreaRepository()
        );

        this.processor = new QueryProcessor(
            analyzer,
            analysisValidator,
            entityValidator
        );
    }

    async bootstrap() {
        console.log("Loading entities...");

        await this.entityService.init();

        console.log("Entities loaded");
    }
}