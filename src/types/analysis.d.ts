import type { AreaEntity } from "./area";
import type { CustomerEntity } from "./customer";
import type { DateEntity } from "./date";
import type { LocationEntity } from "./location";

export interface AnalysisResult {
  intent: string;
  // intentScore: number;
  // ruleIntent: Intent | null;
  customer: CustomerEntity | null;
  area: AreaEntity | null;
  location: LocationEntity | null;
  date: DateEntity | null;
}
