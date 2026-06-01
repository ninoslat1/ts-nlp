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
  private isInit = false;

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
    this.locationByName.clear();
    this.areaByName.clear();
    this.customerByName.clear();

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

    this.isInit = true;
  }

  private ensureInit() {
    if (!this.isInit) {
      throw new Error("EntityService not initialized");
    }
  }

  getCustomers() {
    this.ensureInit();
    return this.customers;
  }

  getLocations() {
    this.ensureInit();
    return this.locations;
  }

  getAreas() {
    this.ensureInit();
    return this.areas;
  }

  getLocationById(id: number) {
    this.ensureInit();
    return this.locationById.get(id);
  }

  getAreaById(id: number) {
    this.ensureInit();
    return this.areaById.get(id);
  }

  getCustomerByNameExact(name: string) {
    this.ensureInit();
    return this.customerByName.get(name.toLowerCase());
  }

  getLocationByNameExact(name: string) {
    this.ensureInit();
    return this.locationByName.get(name.toLowerCase());
  }

  getAreaByNameExact(name: string) {
    this.ensureInit();
    return this.areaByName.get(name.toLowerCase());
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
}
