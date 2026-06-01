import { distance } from "fastest-levenshtein";
import type { AreaRepository } from "../repositories/area.repository";
import type { CustomerRepository } from "../repositories/customer.repository";
import type { LocationRepository } from "../repositories/location.repository";
import type { AreaEntity } from "../types/area";
import type { CustomerEntity } from "../types/customer";
import type { LocationEntity } from "../types/location";

export class EntityService {
  private areas: AreaEntity[] = [];
  private customers: CustomerEntity[] = [];
  private locations: LocationEntity[] = [];
  private is_init: boolean = false;
  private locationById = new Map<number, LocationEntity>();
  private areaById = new Map<number, AreaEntity>();
  private locationByName = new Map<string, LocationEntity>();
  private areaByName = new Map<string, AreaEntity>();
  private customerByName = new Map<string, CustomerEntity>();

  constructor(
    private readonly areaRepo: AreaRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly locationRepo: LocationRepository,
  ) {}

  async init() {
    const [customers, areas, locations] = await Promise.all([
      this.customerRepo.load_customer(),
      this.areaRepo.load_area(),
      this.locationRepo.load_location(),
    ]);

    this.customers = customers.map((x) => ({
      id: x.id,
      customer_name: x.customer_name?.toLowerCase() ?? "",
    }));

    this.areas = areas.map((x) => ({
      id: x.id,
      remark: x.remark?.toLowerCase() ?? "",
      locationId: x.locationId,
    }));

    this.locations = locations.map((x) => ({
      id: x.id,
      name: x.name?.toLowerCase() ?? "",
      customerId: x.customerId,
    }));

    this.locationById.clear();
    this.areaById.clear();

    for (const loc of this.locations) {
      this.locationById.set(loc.id, loc);
      this.locationByName.set(loc.name, loc);
    }

    for (const area of this.areas) {
      this.areaById.set(area.id, area);
      this.areaByName.set(area.remark, area);
    }

    for (const cust of this.customers) {
      this.customerByName.set(cust.customer_name, cust);
    }

    this.is_init = true;
  }

  getCustomers() {
    if (!this.is_init) {
      throw new Error("EntityService not initialized");
    }

    return this.customers;
  }

  belongsToCustomer(locationId: number, customerId: number): boolean {
    const location = this.locationById.get(locationId);
    if (!location) return false;

    return location.customerId === customerId;
  }

  belongsToLocation(areaId: number, locationId: number): boolean {
    const area = this.areaById.get(areaId);
    if (!area) return false;

    return area.locationId === locationId;
  }

  getLocationByName(text: string) {
    let bestMatch: LocationEntity | null = null;
    let bestDistance = Infinity;

    const words = text.split(/\s+/);
    const maxWords = Math.max(...this.locations.map((l) => l.name.split(" ").length));

    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= Math.min(i + maxWords, words.length); j++) {
        const chunk = words.slice(i, j).join(" ");

        for (const loc of this.locations) {
          const d = distance(chunk, loc.name);
          const maxAllowed = Math.floor(loc.name.length * 0.4);

          if (d < bestDistance && d <= maxAllowed) {
            bestDistance = d;
            bestMatch = loc;
          }
        }
      }
    }

    return bestMatch;
  }

  getCustomerByName(text: string) {
    let bestMatch: CustomerEntity | null = null;
    let bestDistance = Infinity;

    const words = text.split(/\s+/);
    const maxWords = Math.max(...this.customers.map((l) => l.customer_name.split(" ").length));

    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= Math.min(i + maxWords, words.length); j++) {
        const chunk = words.slice(i, j).join(" ");

        for (const loc of this.customers) {
          const d = distance(chunk, loc.customer_name);
          const maxAllowed = Math.floor(loc.customer_name.length * 0.4);

          if (d < bestDistance && d <= maxAllowed) {
            bestDistance = d;
            bestMatch = loc;
          }
        }
      }
    }

    return bestMatch;
  }

  getAreaByName(text: string) {
    let bestMatch: AreaEntity | null = null;
    let bestDistance = Infinity;

    const words = text.split(/\s+/);
    const maxWords = Math.max(...this.areas.map((a) => a.remark.split(" ").length));

    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= Math.min(i + maxWords, words.length); j++) {
        const chunk = words.slice(i, j).join(" ");

        for (const area of this.areas) {
          const d = distance(chunk, area.remark);
          const maxAllowed = Math.floor(area.remark.length * 0.4);

          if (d < bestDistance && d <= maxAllowed) {
            bestDistance = d;
            bestMatch = area;
          }
        }
      }
    }

    return bestMatch;
  }

  getLocationById(id: number) {
    if (!this.is_init) throw new Error("EntityService not initialized");
    return this.locationById.get(id);
  }

  getAreaById(id: number) {
    if (!this.is_init) throw new Error("EntityService not initialized");
    return this.areaById.get(id);
  }
}
