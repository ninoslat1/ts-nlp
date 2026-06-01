import { dbMst } from "../db";
import { customerTable } from "../db/schemas/customer";

export class CustomerRepository {
    constructor(){}

    async load_customer(): Promise<typeof customerTable.$inferSelect[]>{
        const data = await dbMst.select().from(customerTable)
        return data
    }
}