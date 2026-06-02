import type { DateEntity } from "../types/date";

export class QueryPreprocessor {
  stripDate(text: string, date: DateEntity | null) {
    if (!date) return text;

    return text.replace(date.text, "");
  }

  stripIntent(text: string, keywords: string[]) {
    let result = text;

    for (const keyword of keywords) {
      result = result.replaceAll(keyword, "");
    }

    return result;
  }

  stripStopwords(text: string) {
    const stopwords = ["list", "laporan", "di", "dari", "untuk"];

    let result = text;

    for (const word of stopwords) {
      result = result.replaceAll(word, "");
    }

    return result;
  }
}
