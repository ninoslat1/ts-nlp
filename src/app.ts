import { intents } from "./static/INTENT";

import { QueryAnalyzer } from "./chatbot/query_analyzer";

import { IntentDetector } from "./intents/detector";
import { EntityExtractor } from "./entities/entity_extractor";

import { EntityService } from "./services/entity.service";

import { AreaRepository } from "./repositories/area.repository";
import { CustomerRepository } from "./repositories/customer.repository";
import { LocationRepository } from "./repositories/location.repository";
import { DateExtractor } from "./entities/date_extractor";

export class App {
    readonly analyzer: QueryAnalyzer;
    readonly entityService: EntityService;

    constructor() {
        this.entityService = new EntityService(
            new AreaRepository(),
            new CustomerRepository(),
            new LocationRepository()
        );

        this.analyzer = new QueryAnalyzer(
            new IntentDetector(intents),
            new EntityExtractor(),
            this.entityService,
            new DateExtractor()
        );
    }

    async bootstrap() {
        console.log("Loading entities...");

        await this.entityService.init();

        console.log("Entities loaded");
    }
}