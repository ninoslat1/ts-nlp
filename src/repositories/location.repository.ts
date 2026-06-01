import { eq, and } from "drizzle-orm";
import { dbMst } from "../db";
import { locationTable } from "../db/schemas/location";

export class LocationRepository {
    constructor(){}

    async load_location(): Promise<typeof locationTable.$inferSelect[]>{
        const data = await dbMst.select().from(locationTable)
        return data
    }

    async belongsToCustomer(
        locationId: number,
        customerId: number
    ): Promise<boolean> {
        
        const result = await dbMst
            .select()
            .from(locationTable)
            .where(
                and(
                    eq(locationTable.id, locationId),
                    eq(locationTable.customerId, customerId)
                )
            )
            .limit(1);

        return result.length > 0;
    }
}