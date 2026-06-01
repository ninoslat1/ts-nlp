import {
  mysqlTable,
  bigint,
  int,
  varchar,
  datetime,
  decimal,
  tinyint,
} from "drizzle-orm/mysql-core";

export const trsTable = mysqlTable("trslot", {
  trsId: bigint("TrsID", { mode: "number" }).autoincrement().primaryKey(),

  id: varchar("ID", { length: 255 }),

  areaId: int("AreaID"),

  timeIn: datetime("TimeIn"),

  timeOut: datetime("TimeOut"),

  userId: int("UserID").default(0),

  shiftLotId: int("ShiftLotID").default(0),

  classId: int("ClassID").default(0),

  locId: int("LocID").default(0),

  lotId: int("LotID").default(0),

  hardwareId: int("HardwareID").default(0),

  rateLot: decimal("RateLot", {
    precision: 10,
    scale: 2,
  }).default("0.00"),

  barcode: varchar("Barcode", {
    length: 20,
  }),

  regNo: varchar("RegNo", {
    length: 20,
  }),

  status: tinyint("Status").default(0),

  dbStatus: tinyint("DBStatus").default(0),

  partnerReference: varchar("PartnerReference", {
    length: 255,
  }),

  referenceNo: varchar("ReferenceNo", {
    length: 255,
  }),

  span: varchar("Span", {
    length: 255,
  }),

  flag: tinyint("Flag"),

  timeExpired: datetime("TimeExpired"),

  timePaid: datetime("TimePaid"),

  description: varchar("Description", {
    length: 50,
  }),
});
