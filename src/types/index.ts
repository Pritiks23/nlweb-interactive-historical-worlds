export interface World {
    id: string;
    name: string;
    description: string;
    regions: Region[];
}

export interface Region {
    id: string;
    name: string;
    description: string;
    timePeriodId: string;
}

export interface TimePeriod {
    id: string;
    name: string;
    description: string;
    regions: string[];
}