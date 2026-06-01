import type { DateEntity } from "../types/date";

export class DateExtractor {
    private readonly months: Record<string, number> = {
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
        const now = new Date();

        for (const [monthName, month] of Object.entries(this.months)) {
            if (text.includes(monthName)) {

                const yearMatch =
                    text.match(/\b(20\d{2})\b/);

                const year =
                    yearMatch
                        ? Number(yearMatch[1])
                        : now.getFullYear();

                return {
                    text: monthName,
                    range: {
                        start: new Date(
                            year,
                            month,
                            1
                        ),
                        end: new Date(
                            year,
                            month + 1,
                            0,
                            23,
                            59,
                            59
                        ),
                    },
                };
            }
        }

        if (text.includes("hari ini")) {
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            return {
                text: "hari ini",
                range: { start, end }
            };
        }

        if (text.includes("kemarin")) {
            const start = new Date();
            start.setDate(start.getDate() - 1);
            start.setHours(0,0,0,0);

            const end = new Date();
            end.setDate(end.getDate() - 1);
            end.setHours(23,59,59,999);

            return {
                text: "kemarin",
                range: { start, end }
            };
        }

        if (text.includes("bulan ini")) {
            const now = new Date();

            return {
                text: "bulan ini",
                range: {
                    start: new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        1
                    ),
                    end: new Date(
                        now.getFullYear(),
                        now.getMonth() + 1,
                        0,
                        23,
                        59,
                        59
                    )
                }
            };
        }

        return null;
    }
}