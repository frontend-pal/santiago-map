import { LatLngExpression } from "leaflet";

export interface SelectValue {
    name: string;
    value: string;
}

export interface RiskSelectValue extends SelectValue {
    risk: string;
}

export const COLCOORDS: LatLngExpression = {
    lng: -74.5472906,
    lat: 4.561896
};

export const DISEASES: SelectValue[] = [
    { name: 'Circovirosis Porcina', value: 'PCV' },
    { name: 'Diarrea Epidémica', value: 'PED' },
    { name: 'Ileítis Porcina ', value: 'EPP' },
    { name: 'Influenza Porcina', value: 'IIP' },
    { name: 'Microplasmosis Porcina', value: 'CRP' },
    { name: 'Parvovirosis Porcina', value: 'PVP' },
    { name: 'Peste Porcina Africana', value: 'PPA' },
    { name: 'Pleuropneumonia Porcina', value: 'APP' },
    { name: 'PRRS - Síndrome Reproductivo y Respiratorio Porcino', value: 'PRRS' }
];

export const VISUALIZATIONTYPES: SelectValue[] = [
    { name: 'En las áreas de producción porcina nacional', value: 'PNAC' },
    { name: 'En frontera agrícola nacional', value: 'FRONAC' },
    { name: 'En áreas de aptitud para la producción porcina  tecnificada', value: 'ARTECN' }
];

export const RISK: SelectValue[] = [
    { name: 'Riesgo Específico', value: 'RES' },
    { name: 'Componente Amenaza', value: 'COA' },
    { name: 'Componente Vulnerabilidad ', value: 'COV' }
];

export const RISKCOMP: RiskSelectValue[] = [
    // Componente Amenaza
    { name: 'Bioseguridad', value: '', risk: 'COA' },
    { name: 'Manejo Sanitario', value: '', risk: 'COA' },
    { name: 'Movilización', value: '', risk: 'COA' },
    // Componente Vulnerabilidad
    { name: 'Entorno Biofísico Ambiental', value: '', risk: 'COV' },
    { name: 'Entorno Socioeconómico', value: '', risk: 'COV' },
    { name: 'Espacio Biofisico', value: '', risk: 'COV' },
    { name: 'Manejo Sanitario', value: '', risk: 'COV' },
    { name: 'Proceso Productivo', value: '', risk: 'COV' }
];

export const RISKCAT: RiskSelectValue[] = [
    // Componente Amenaza
    { name: 'Bioseguridad', value: '', risk: 'COA' },
    { name: 'Manejo Sanitario', value: '', risk: 'COA' },
    { name: 'Movilización', value: '', risk: 'COA' },
    // Componente Vulnerabilidad
    { name: 'Entorno Biofísico Ambiental', value: '', risk: 'COV' },
    { name: 'Entorno Socioeconómico', value: '', risk: 'COV' },
    { name: 'Espacio Biofisico', value: '', risk: 'COV' },
    { name: 'Manejo Sanitario', value: '', risk: 'COV' },
    { name: 'Proceso Productivo', value: '', risk: 'COV' }
];

// Contacto indirecto asociado con personas	Bioseguridad
// Infraestructura y uso de instalaciones	Bioseguridad
// Manejo de animales muertos	Bioseguridad
// Manejo de cerdos reproductores	Bioseguridad
// Presencia de otras especies en la granja	Bioseguridad
// Tipo de alimentación	Bioseguridad
// Condiciones biofísico ambientales	Entorno Biofísico Ambiental
// Contacto con agua contaminada	Entorno Biofísico Ambiental
// Presencia de cerdos asilvestrados	Entorno Biofísico Ambiental
// "Susceptibilidad al contagio por proximidad a humedales, aves migratorias y granjas avícolas"	Entorno biofísico ambiental
// Ingreso de porcinos, material genético, carne, derivados y productos cárnicos de cerdo	Entorno Socioeconómico
// Movimiento Internacional de personas	Entorno Socioeconómico
// Capacitación en salud y sanidad	Entorno Socioeconómico
// Cultura frente al Diagnóstico	Entorno Socioeconómico
// Zonas epidemiológicas	Entorno Socioeconómico
// Densidad poblacional de la producción potencial en las granjas porcinas	Entorno Socioeconómico
// Cercanía a basureros y rellenos sanitarios	Espacio Biofisico
// Cercanía a centros urbanos	Espacio Biofisico
// Cercanía a concentraciones	Espacio Biofisico
// Cercanía a fronteras 	Espacio Biofisico
// Cercanía a plantas de beneficio	Espacio Biofisico
// Cercanía a puertos y/o aeropuertos	Espacio Biofisico
// Cercanía a vías	Espacio Biofisico
// Cercanía procesadoras de productos cárnicos	Espacio Biofisico
// Densidad de granjas porcinas en el territorio	Espacio Biofisico
// Acceso a servicios de diagnóstico	Manejo Sanitario
// Acceso a Servicios Veterinarios	Manejo Sanitario
// Existencia de la Enfermedad	Manejo Sanitario
// Existencia de Vacunación	Manejo Sanitario
// Movilizacion de concentracion a concentracion	Movilización
// Movilizacion de concentracion a matadero	Movilización
// Movilizacion de concentracion a predio	Movilización
// Movilización de personas en el territorio nacional	Movilización
// Movilizacion de predio a concentracion	Movilización
// Movilizacion de predio a matadero	Movilización
// Movilizacion de predio a predio	Movilización
// Movilización de productos y subproductos de la cadena porcina	Movilización
// Movilizacion matadero a concentracion	Movilización
// Movilizacion matadero a matadero	Movilización
// Movilizacion matadero a predio	Movilización
// Densidad de animales en levante y ceba en granjas porcinas	Proceso Productivo
// Densidad de granjas de producción comercial tecnificada vs granjas produccon porcina	Proceso Productivo
// Densidad de granjas de producción de cria	Proceso Productivo
// Densidad de granjas de producción de levante y ceba	Proceso Productivo
// Densidad de granjas de producción Familiar vs granjas produccon porcina	Proceso Productivo
// Densidad de hembras en cria en granjas porcinas	Proceso Productivo
// Índice de granjas de levante/ceba vs producción de cria	Proceso Productivo
// Índice de granjas de producción comercial tecnificada vs producción familiar	Proceso Productivo
