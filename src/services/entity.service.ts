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

    constructor(
        private readonly areaRepo: AreaRepository,
        private readonly customerRepo: CustomerRepository,
        private readonly locationRepo: LocationRepository
    ) {}

    async init() {
        this.is_init = true;
        const areas = await this.areaRepo.load_area();
        const customers = await this.customerRepo.load_customer();
        const locations = await this.locationRepo.load_location();

        this.areas = areas.map(x => ({
            id: x.id,
            remark: x.remark?.toLowerCase() ?? ""
        }));
        this.customers = customers.map(x => ({
            id: x.id,
            customer_name: x.customer_name?.toLowerCase() ?? ""
        }));
        this.locations = locations.map(x => ({
            id: x.id,
            name: x.name?.toLowerCase() ?? ""
        }))
    }

    getAreas() {
        if (!this.is_init) {
            throw new Error(
                "EntityService not initialized"
            );
        }

        return this.areas;
    }

    getCustomers() {
        if (!this.is_init) {
            throw new Error(
                "EntityService not initialized"
            );
        }

        return this.customers;
    }

    getLocations(){
        if (!this.is_init) {
            throw new Error(
                "EntityService not initialized"
            );
        }

        return this.locations;
    }
}