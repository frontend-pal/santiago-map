import { LatLngExpression } from "leaflet";

export interface SelectValue {
    name: string;
    value: string;
}

export interface RiskSelectValue extends SelectValue {
    risk: string;
}

export interface RiskSelectFacValue extends RiskSelectValue {
    riskcat: string
}


export const COLCOORDS: LatLngExpression = {
    lng: -74.5472906,
    lat: 4.561896
};

export const DISEASES: SelectValue[] = [
    { name: 'PCV - Circovirosis Porcina', value: 'PCV' },
    { name: 'PED - Diarrea Epidémica Porcina', value: 'PED' },
    { name: 'PPE - IleItis Porcina ', value: 'PPE' },
    { name: 'SIV - Influenza Porcina', value: 'SIV' },
    { name: 'MH - Micoplasmosis Porcina', value: 'MH' },
    { name: 'PPV - Parvovirosis Porcina', value: 'PPV' },
    { name: 'ASF - Peste Porcina Africana', value: 'ASF' },
    { name: 'APP - Pleuropneumonia Porcina', value: 'APP' },
    { name: 'PRRS - Síndrome Reproductivo y Respiratorio Porcino', value: 'PRRS' }
];

export const VISUALIZATIONTYPES: SelectValue[] = [
    { name: 'En las áreas de producción porcina nacional', value: 'PRONAC' },
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
    { name: 'Bioseguridad', value: 'BIO', risk: 'COA' },
    { name: 'Manejo Sanitario', value: 'SAN', risk: 'COA' },
    { name: 'Movilización', value: 'MOV', risk: 'COA' },
    // Componente Vulnerabilidad
    { name: 'Entorno Biofísico Ambiental', value: 'EBA', risk: 'COV' },
    { name: 'Entorno Socioeconómico', value: 'ESO', risk: 'COV' },
    { name: 'Espacio Biofisico', value: 'EBI', risk: 'COV' },
    { name: 'Manejo Sanitario', value: 'SAN', risk: 'COV' },
    { name: 'Proceso Productivo', value: 'PRO', risk: 'COV' }
];

export const RISKFACT: RiskSelectFacValue[] = [
    {
        name: "Contacto indirecto asociado con personas",
        value: "FacRiesgo_Contac_IndirecPerson",
        riskcat: "BIO",
        risk: "COA"
    },
    {
        name: "Infraestructura y uso de instalaciones",
        value: "FacRiesgo_infra_y_uso_intalaciones",
        riskcat: "BIO",
        risk: "COA"
    },
    {
        name: "Manejo de animales muertos",
        value: "FacRiesgo_Manejo_muertos",
        riskcat: "BIO",
        risk: "COA"
    },
    {
        name: "Manejo de cerdos reproductores",
        value: "FacRiesgo_Manejo_Reprod",
        riskcat: "BIO",
        risk: "COA"
    },
    {
        name: "Presencia de otras especies en la granja",
        value: "FacRiesgo_Presen_OtrasEspecie",
        riskcat: "BIO",
        risk: "COA"
    },
    {
        name: "Tipo de alimentación",
        value: "FacRiesgo_Tipo_de_alimentación",
        riskcat: "BIO",
        risk: "COA"
    },
    {
        name: "Existencia de la Enfermedad",
        value: "FacRiesgo_Existencia_de_la_Enfermedad",
        riskcat: "SAN",
        risk: "COA"
    },
    {
        name: "Existencia de Vacunación",
        value: "FacRiesgo_Existencia_de_Vacunación",
        riskcat: "SAN",
        risk: "COA"
    },
    {
        name: "Movilización de personas en el territorio nacional",
        value: "FacRiesgo_Movilización_de_personas_en_el_territorio_nacional",
        riskcat: "MOV",
        risk: "COA"
    },
    {
        name: "Movilización de productos y subproductos de la cadena porcina",
        value: "FacRiesgo_Moviliza_de_productos",
        riskcat: "MOV",
        risk: "COA"
    },
    {
        name: "Movilización Animal",
        value: "FacRiesgo_Movilizacion_animal",
        riskcat: "MOV",
        risk: "COA"
    },
    {
        name: "Contacto con agua contaminada",
        value: "FacRiesgo_Contacto_con_agua_contaminada",
        riskcat: "EBA",
        risk: "COV"
    },
    {
        name: "Presencia de cerdos asilvestrados",
        value: "FacRiesgo_Presen_Asilvestrados",
        riskcat: "EBA",
        risk: "COV"
    },
    {
        name: "Susceptibilidad al contagio\npor proximidad\na humedales, aves migratorias y granjas avícolas",
        value: "FacRiesgo_Susceptibilidad_al_contagio_por_proximidad_a_humedales,_aves_migratorias_y_granjas_avícolas",
        riskcat: "EBA",
        risk: "COV"
    },
    {
        name: "Ingreso de porcinos, material genético, carne, derivados y productos cárnicos de cerdo",
        value: "FacRiesgo_Ingr_Porci",
        riskcat: "ESO",
        risk: "COV"
    },
    {
        name: "Movimiento Internacional de personas",
        value: "FacRiesgo_Mov_Internacional_pers",
        riskcat: "ESO",
        risk: "COV"
    },
    {
        name: "Capacitación en salud y sanidad",
        value: "FacRiesgo_Capacitación_en_salud_y_sanidad",
        riskcat: "ESO",
        risk: "COV"
    },
    {
        name: "Cultura frente al Diagnóstico",
        value: "FacRiesgo_Cultura_frente_al_Diagnóstico",
        riskcat: "ESO",
        risk: "COV"
    },
    {
        name: "Zonas epidemiológicas",
        value: "FacRiesgo_Zonas_epidemiológicas",
        riskcat: "ESO",
        risk: "COV"
    },
    {
        name: "Densidad poblacional de la producción potencial en las granjas porcinas",
        value: "FacRiesgo_Densidad_poblacional_de_la_producción_potencial_en_las_granjas_porcinas",
        riskcat: "ESO",
        risk: "COV"
    },
    {
        name: "Cercanía a basureros y rellenos sanitarios",
        value: "FacRiesgo_Cerc_a_basureros",
        riskcat: "EBI",
        risk: "COV"
    },
    {
        name: "Cercanía a centros poblados",
        value: "FacRiesgo_Cerc_Centros_poblados",
        riskcat: "EBI",
        risk: "COV"
    },
    {
        name: "Cercanía a ferias comerciales",
        value: "FacRiesgo_Cerc_Ferias_comerciales",
        riskcat: "EBI",
        risk: "COV"
    },
    {
        name: "Cercanía a fronteras",
        value: "FacRiesgo_Cerc_a_fronteras",
        riskcat: "EBI",
        risk: "COV"
    },
    {
        name: "Cercanía a plantas de beneficio",
        value: "FacRiesgo_Cerc_Plantas_de_beneficio",
        riskcat: "EBI",
        risk: "COV"
    },
    {
        name: "Cercanía a puertos y\/o aeropuertos",
        value: "FacRiesgo_Cerc_a_puertos",
        riskcat: "EBI",
        risk: "COV"
    },
    {
        name: "Cercanía a vías",
        value: "FacRiesgo_Cerc_a_vias",
        riskcat: "EBI",
        risk: "COV"
    },
    {
        name: "Cercanía procesadoras de productos cárnicos",
        value: "FacRiesgo_Cerc_Procesadoras_de_productos_cárnicos",
        riskcat: "EBI",
        risk: "COV"
    },
    {
        name: "Densidad de granjas porcinas en el territorio",
        value: "FacRiesgo_Densidad_de_granjas_porcinas_en_el_territorio",
        riskcat: "EBI",
        risk: "COV"
    },
    {
        name: "Acceso a servicios de diagnóstico",
        value: "FacRiesgo_Acceso_a_servicios_de_diagnóstico",
        riskcat: "SAN",
        risk: "COV"
    },
    {
        name: "Acceso a Servicios Veterinarios",
        value: "FacRiesgo_Acceso_a_Servicios_Veterinarios",
        riskcat: "SAN",
        risk: "COV"
    },
    {
        name: "Densidad de animales en levante y ceba en granjas porcinas",
        value: "FacRiesgo_Densidad_de_animales_en_levante_y_ceba_en_granjas_porcinas",
        riskcat: "pro",
        risk: "COV"
    },
    {
        name: "Densidad de granjas de producción comercial tecnificada vs granjas produccon porcina",
        value: "FacRiesgo_Densidad_de_granjas_de_producción_comercial_tecnificada_vs_granjas_produccon_porcina",
        riskcat: "PRO",
        risk: "COV"
    },
    {
        name: "Densidad de granjas de producción de cria",
        value: "FacRiesgo_Densidad_de_granjas_de_producción_de_cria",
        riskcat: "PRO",
        risk: "COV"
    },
    {
        name: "Densidad de granjas de producción de levante y ceba",
        value: "FacRiesgo_Densidad_de_granjas_de_producción_de_levante_y_ceba",
        riskcat: "PRO",
        risk: "COV"
    },
    {
        name: "Densidad de granjas de producción Familiar vs granjas produccon porcina",
        value: "FacRiesgo_Densidad_de_granjas_de_producción_Familiar_vs_granjas_produccon_porcina",
        riskcat: "PRO",
        risk: "COV"
    },
    {
        name: "Densidad de hembras en cria en granjas porcinas",
        value: "FacRiesgo_Densidad_de_hembras_de_cría_en_granjas_porcinas",
        riskcat: "PRO",
        risk: "COV"
    }
] 