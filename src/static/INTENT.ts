import type { Intent } from "../types/intent";

export const intents: Record<Intent, string[]> = {
  transaction_report: ["transaksi"],
  revenue_report: ["pendapatan", "revenue"],
};
