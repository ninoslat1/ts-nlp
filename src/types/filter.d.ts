export interface FilterResult {
  customerId?: number;
  areaId?: number;
  locationId?: number;
  startDate?: Date;
  endDate?: Date;
}

export type MatchResult<T> = {
  entity: T | null;
  candidates?: [T, T];
  score: number;
  type: string;
};
