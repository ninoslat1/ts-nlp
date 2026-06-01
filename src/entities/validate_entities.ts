import type { AreaRepository } from "../repositories/area.repository";
import type { LocationRepository } from "../repositories/location.repository";
import type { AnalysisResult } from "../types/analysis";
import { EntityRelationError } from "../utils/error";

export class EntityValidator {

    constructor(
        private readonly locationRepo: LocationRepository,
        private readonly areaRepo: AreaRepository
    ) {}

    async validateChain(
        result: AnalysisResult
    ): Promise<void> {

        if (
            result.customer &&
            result.location
        ) {

            const valid =
                await this.locationRepo.belongsToCustomer(
                    result.location.id,
                    result.customer.id
                );

            if (!valid) {
                throw new EntityRelationError(
                    `Lokasi "${result.location.name}" tidak ditemukan pada customer "${result.customer.customer_name}".`
                );
            }
        }

        if (
            result.location &&
            result.area
        ) {

            const valid =
                await this.areaRepo.belongsToLocation(
                    result.area.id,
                    result.location.id
                );

            if (!valid) {
                throw new EntityRelationError(
                    `Area "${result.area.remark}" tidak ditemukan pada lokasi "${result.location.name}".`
                );
            }
        }
    }
}