import { dbMst } from "../db";
import { locationTable } from "../db/schemas/location";

export class LocationRepository {
    constructor(){}

    async load_location(): Promise<typeof locationTable.$inferSelect[]>{
        const data = await dbMst.select().from(locationTable)
        return data
    }
}