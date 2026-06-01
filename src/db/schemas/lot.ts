import {
  mysqlTable,
  int,
  varchar,
  tinyint,
  datetime,
  date,
  decimal,
} from "drizzle-orm/mysql-core";

export const lotTable = mysqlTable("lot", {
  id: int("ID")
    .autoincrement()
    .primaryKey(),

  areaId: int("AreaID")
    .notNull()
    .default(0),

  battery: int("Barrier"),

  classId: int("ClassID")
    .notNull()
    .default(0),

  groupId: int("GroupID"),

  helpDate: datetime("HelpDate", {
    mode: "date",
  }),

  helpStatus: tinyint("HelpStatus")
    .notNull()
    .default(0),

  hppcAddress: varchar("HppcAddress", {
    length: 45,
  }),

  hppcId: int("HppcID")
    .notNull()
    .default(0),

  liveDate: date("LiveDate"),

  lock: tinyint("Lock")
    .notNull()
    .default(0),

  lotName: varchar("LotName", {
    length: 45,
  }),

  status: tinyint("Status")
    .notNull()
    .default(0),

  uid: varchar("UID", {
    length: 40,
  }),

  voltage: decimal("Voltage", {
    precision: 20,
    scale: 6,
  }),
});