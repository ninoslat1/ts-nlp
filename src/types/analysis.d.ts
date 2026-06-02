import type { AreaEntity } from "./area";
import type { CustomerEntity } from "./customer";
import type { DateEntity } from "./date";
import type { LocationEntity } from "./location";

export interface AnalysisResult {
  intent: string;
  customer: CustomerEntity | null;
  customerScore: number;

  location: LocationEntity | null;
  locationScore: number;
  ambiguousLocations?: LocationEntity[];
  area: AreaEntity | null;
  areaScore: number;
  date: DateEntity | null;
}
