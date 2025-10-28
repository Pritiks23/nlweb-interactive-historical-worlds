import { Region, World } from '../types';

export class RegionManager {
    private regions: Region[];

    constructor() {
        this.regions = [];
    }

    loadRegions(worlds: World[]): Region[] {
        // Extract all regions from all worlds
        this.regions = worlds.flatMap(world => world.regions);
        return this.regions;
    }

    getRegions(): Region[] {
        return this.regions;
    }

    getRegionsByTimePeriod(timePeriodId: string): Region[] {
        return this.regions.filter(region => region.timePeriodId === timePeriodId);
    }

    getRegionById(regionId: string): Region | undefined {
        return this.regions.find(region => region.id === regionId);
    }
}