import type { Intent } from "../types/intent";

export const intents: Record<Intent, string[]> = {
  transaction_report: ["transaksi"],
  revenue_report: ["pendapatan", "revenue"],
};

export const intentCorpus = Object.entries(intents).flatMap(([label, keywords]) =>
  keywords.map((text) => ({
    label,
    text,
  })),
);
