import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const customerTable = mysqlTable("mycust", {
    id: int("ID")
        .autoincrement()
        .primaryKey(),
    customer_name: varchar("CustomerName", { length: 255 }),
    uid: varchar("UID", {length: 50} )
})