import { dbMst } from "../db";
import { eq, and } from "drizzle-orm";
import { areaTable } from "../db/schemas/area";

export class AreaRepository {
  constructor() {}

  async load_area(): Promise<(typeof areaTable.$inferSelect)[]> {
    const data = await dbMst.select().from(areaTable);
    return data;
  }

//   async belongsToLocation(areaId: number, locationId: number): Promise<boolean> {
//     const result = await dbMst
//       .select()
//       .from(areaTable)
//       .where(and(eq(areaTable.id, areaId), eq(areaTable.locationId, locationId)))
//       .limit(1);

//     return result.length > 0;
//   }
}
