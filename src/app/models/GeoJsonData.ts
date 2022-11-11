export interface Properties {
    name: string;
}

export interface Crs {
    type: string;
    properties: Properties;
}

export interface Properties2 {
    area: number;
    perimeter: number;
    dpto: string;
    nombre_dpt: string;
    mpio: string;
    nombre_mpi: string;
    nombre_cab: string;
    mpios: string;
    hectares: number;
}

export interface Geometry {
    type: string;
    coordinates: number[][][][];
}

export interface Feature {
    type: string;
    properties: Properties2;
    geometry: Geometry;
}

export interface GeoJsonData {
    type: string;
    name: string;
    crs: Crs;
    features: Feature[];
}