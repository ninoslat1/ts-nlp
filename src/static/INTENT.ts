import type { Intent } from "../types/intent";

export const intents: Record<Intent, string[]> = {
  transaction_report: ["transaksi", "laporan transaksi", "jumlah transaksi", "transaksi parkir"],

  revenue_report: ["pendapatan", "revenue", "omzet", "penghasilan", "laporan pendapatan"],
};

export const intentCorpus = Object.entries(intents).flatMap(([label, keywords]) =>
  keywords.map((text) => ({
    label,
    text,
  })),
);
