import { dbMst } from "../db";
import { lotTable } from "../db/schemas/lot";

export class LotRepository {
  constructor() {}

  async load_lot(): Promise<(typeof lotTable.$inferSelect)[]> {
    const data = await dbMst.select().from(lotTable);
    return data;
  }
}
