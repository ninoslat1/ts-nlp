import type { AnalysisResult } from "../types/analysis";
import { EntityNotFoundError } from "../utils/error";

export class AnalysisValidator {

    validate(
        result: AnalysisResult
    ): void {

        if (
            !result.customer &&
            !result.location &&
            !result.area
        ) {
            throw new EntityNotFoundError(
                "Tidak ditemukan customer, lokasi, atau area."
            );
        }
    }
}