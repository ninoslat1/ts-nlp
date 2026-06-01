export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateEntity {
  text: string;
  range: DateRange;
}

export interface ParsedDate {
  day: number
  month: number
  year: number
}
