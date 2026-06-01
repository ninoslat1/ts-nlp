import { dbMst } from "../db";
import { areaTable } from "../db/schemas/area";

export class AreaRepository {
    constructor(){}

    async load_area(): Promise<typeof areaTable.$inferSelect[]>{
        const data = await dbMst.select().from(areaTable)
        return data
    }
}