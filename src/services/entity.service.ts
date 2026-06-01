import type { AreaRepository } from "../repositories/area.repository";
import type { CustomerRepository } from "../repositories/customer.repository";
import type { LocationRepository } from "../repositories/location.repository";
import type { AreaEntity } from "../types/area";
import type { CustomerEntity } from "../types/customer";
import type { LocationEntity } from "../types/location";
import { normalizeTxt } from "../utils/parser";

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

    console.log("=== LOCATION INDEX ===");
        for (const [k, v] of this.locationByName) {
        console.log(JSON.stringify(k), "=>", v.id);
    }

    this.customers = customers.map((x) => ({
        id: x.id,
        customer_name: x.customer_name?.toLowerCase() ?? "",
    }));

    this.areas = areas.map((x) => ({
        id: x.id,
        remark: x.remark?.toLowerCase() ?? "",
        locationId: x.locationId
    }));

    this.locations = locations.map((x) => ({
        id: x.id,
        name: x.name?.toLowerCase() ?? "",
        customerId: x.customerId
    }));

    this.locationById.clear();
    this.areaById.clear();

    for (const loc of this.locations) {
        this.locationById.set(loc.id, loc);
        this.locationByName.set(normalizeTxt(loc.name), loc)
    }

    for (const area of this.areas) {
        this.areaById.set(area.id, area);
        this.areaByName.set(normalizeTxt(area.remark), area);
    }

    for (const cust of this.customers) {
        this.customerByName.set(normalizeTxt(cust.customer_name), cust);
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
  const normalized = normalizeTxt(text);

  

  for (const [name, loc] of this.locationByName) {
    console.log("COMPARE:", {
    text: normalized,
    name,
    includes: normalized.includes(name),
  });

    if (normalized.includes(name)) {
        console.log("MATCH FOUND:", loc);
        return loc;
    }
  }

  return null;
}

getCustomerByName(text: string) {
    const normalized = normalizeTxt(text);
  for (const [name, loc] of this.customerByName) {
    if (normalized.includes(name)) return loc;
  }
  return null;
}

getAreaByName(text: string) {
  const normalized = normalizeTxt(text);

  for (const [name, area] of this.areaByName) {
    if (normalized.includes(name)) return area;
  }

  return null;
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
