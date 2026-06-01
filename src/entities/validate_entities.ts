import type { AreaRepository } from "../repositories/area.repository";
import type { LocationRepository } from "../repositories/location.repository";
import type { EntityService } from "../services/entity.service";
import type { AnalysisResult } from "../types/analysis";
import { EntityRelationError } from "../utils/error";

export class EntityValidator {
  constructor(
    private entityService: EntityService
  ) {}

    validateChain(result: AnalysisResult): void {
    if (result.customer && result.location) {
      const valid = this.entityService.belongsToCustomer(
        result.location.id,
        result.customer.id,
      );

      if (!valid) {
        throw new EntityRelationError(
          `Lokasi "${result.location.name}" tidak ditemukan pada customer "${result.customer.customer_name}".`,
        );
      }
    }

    if (result.location && result.area) {
      const valid = this.entityService.belongsToLocation(result.area.id, result.location.id);

      if (!valid) {
        throw new EntityRelationError(
          `Area "${result.area.remark}" tidak ditemukan pada lokasi "${result.location.name}".`,
        );
      }
    }
  }
}
