import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { trsTable } from "./schemas/trslot";
import { lotTable } from "./schemas/lot";
import { customerTable } from "./schemas/customer";
import { locationTable } from "./schemas/location";
import { areaTable } from "./schemas/area";

const trsPoolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT ?? "3306"),
  database: process.env.DB_TRS,
});

// const usrPoolConnection = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   port: parseInt(process.env.DB_PORT ?? "3306"),
//   database: process.env.DB_USR,
// });

const mstPoolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT ?? "3306"),
  database: process.env.DB_MST,
});

// export const dbTrs = drizzle(trsPoolConnection, {schema: {trsTable, trsLogTable, shiftSiagaTable, trsSiagaTable}, mode: "default"});
// export const dbUsr = drizzle(usrPoolConnection, {schema: {userTable}, mode: "default"});
// export const dbMst = drizzle(mstPoolConnection, {schema: {siagaTable, numberTable, siagaServTable, classTable, configTable, shiftWorkTable}, mode: "default"})

export const dbTrs = drizzle(trsPoolConnection, { schema: { trsTable }, mode: "default" });
export const dbMst = drizzle(mstPoolConnection, {
  schema: { lotTable, customerTable, locationTable, areaTable },
  mode: "default",
});
