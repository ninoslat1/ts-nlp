import type { DateEntity, ParsedDate } from "../types/date";
import { DateFormatError } from "../utils/error";

export class DateExtractor {
  private readonly RANGE_SEPARATORS = /\bhingga\b|\bsampai\b/i;
  private readonly MONTHS: Record<string, number> = {
    januari: 0,
    februari: 1,
    maret: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    agustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    desember: 11,
  };

  extract(text: string): DateEntity | null {
    const lower = text.toLowerCase().trim();

    if (this.RANGE_SEPARATORS.test(lower)) {
      return this.extractRange(lower);
    }

    return this.extractSingle(lower);
  }

  private extractRange(text: string): DateEntity | null {
    const [leftRaw, rightRaw] = text.split(this.RANGE_SEPARATORS);

    const left = this.parseSingleDate(leftRaw ? leftRaw.trim() : "");
    const right = this.parseSingleDate(rightRaw ? rightRaw.trim() : "");
    if (!left || !right) return null;
    const startDate = new Date(left.year, left.month, left.day, 0, 0, 0);
    const endDate = new Date(right.year, right.month, right.day, 23, 59, 59);

    if (startDate > endDate) {
      throw new DateFormatError("Invalid date format: start date must not be after end date");
    }

    return {
      text: text.trim(),
      range: { start: startDate, end: endDate },
    };
  }

  private extractSingle(text: string): DateEntity | null {
    const now = new Date();

    if (text.includes("hari ini")) {
      return {
        text: "hari ini",
        range: {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
        },
      };
    }

    if (text.includes("kemarin")) {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      return {
        text: "kemarin",
        range: {
          start: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0),
          end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59),
        },
      };
    }

    if (text.includes("bulan ini")) {
      return {
        text: "bulan ini",
        range: {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
        },
      };
    }

    if (text.includes("tahun ini")) {
      return {
        text: "tahun ini",
        range: {
          start: new Date(now.getFullYear(), 0, 1, 0, 0, 0),
          end: new Date(now.getFullYear(), 11, 31, 23, 59, 59),
        },
      };
    }

    if (text.includes("tahun lalu")) {
      const lastYear = now.getFullYear() - 1;
      return {
        text: "tahun lalu",
        range: {
          start: new Date(lastYear, 0, 1, 0, 0, 0),
          end: new Date(lastYear, 11, 31, 23, 59, 59),
        },
      };
    }

    const parsed = this.parseSingleDate(text);
    if (!parsed) return null;

    const matchedMonth = this.findMonthName(text);

    return {
      text: matchedMonth ?? text.trim(),
      range: {
        start: new Date(parsed.year, parsed.month, parsed.day, 0, 0, 0),
        end: new Date(parsed.year, parsed.month, parsed.day, 23, 59, 59),
      },
    };
  }

  private parseSingleDate(text: string): ParsedDate | null {
    const now = new Date();
    const currentYear = now.getFullYear();

    const monthEntry = this.findMonthEntry(text);
    if (!monthEntry) return null;

    const [_, month] = monthEntry;

    // Resolve year
    const year = this.resolveYear(text, currentYear);

    // Resolve day
    const dayMatch = text.match(/\b(\d{1,2})\b/);
    const day = dayMatch?.[1] !== undefined ? parseInt(dayMatch[1], 10) : 1;

    const maxDay = new Date(year, month + 1, 0).getDate();
    const clampedDay = Math.min(day, maxDay);

    return { day: clampedDay, month, year };
  }

  private resolveYear(text: string, currentYear: number): number {
    const explicitYear = text.match(/\b(20\d{2})\b/);
    if (explicitYear && explicitYear?.[1] !== undefined) return parseInt(explicitYear[1], 10);

    if (/\btahun lalu\b/.test(text)) return currentYear - 1;
    if (/\btahun depan\b/.test(text)) return currentYear + 1;
    if (/\btahun ini\b/.test(text)) return currentYear;

    return currentYear;
  }

  private findMonthEntry(text: string): [string, number] | null {
    for (const [name, index] of Object.entries(this.MONTHS)) {
      if (text.includes(name)) return [name, index];
    }
    return null;
  }

  private findMonthName(text: string): string | null {
    return this.findMonthEntry(text)?.[0] ?? null;
  }
}
