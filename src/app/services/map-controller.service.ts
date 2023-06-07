import { Injectable } from '@angular/core';
import L, { LatLngExpression, Map, GeoJSON, Layer } from 'leaflet';
import { JsonListService } from '../services/Json-list.service'
import { ControlFormService } from '../services/control-form.service';

interface MapLayers {
  name: string;
  layer: GeoJSON | any | null;
}

export const DEFAULT_LAT = 4.561896;
export const DEFAULT_LON = -74.5472906;

@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  private map!: Map;
  public info!: any;
  public mapLayers: MapLayers[] | any[] = [];
  public mapDataASF: any;
  private _toggleMenu!: boolean;
  private riskFact = false;

  get toggleMenu(): boolean {
    return this._toggleMenu;
  }

  set toggleMenu(value: boolean) {
    this._toggleMenu = value;
  }

  get isMapready() {
    return !!this.map;
  }

  get myMap() {
    return this.map;
  }

  constructor(
    private controlService: ControlFormService,
    private jsonService: JsonListService
  ) { }

  setMap(map: Map): void {
    this.map = map;
  }

  flyTo(coords: LatLngExpression, zoom = 6): void {
    if (!this.isMapready) throw new Error('El mapa no esta inicializado correctamente.');

    this.map?.flyTo(
      coords,
      zoom
    )
  }

  public getLegendColor(d: any) {
    return d == 100 ? '#800026' :
      d > 90 ? '#BD0026' :
        d > 80 ? '#E31A1C' :
          d > 60 ? '#FC4E2A' :
            d > 40 ? '#FD8D3C' :
              d > 20 ? '#FEB24C' :
                d > 0 ? '#FED976' :
                  '#FFEDA0';
  }

  public getColor(f: any, d?: any, dptoCode?: string, color?: string) {
    let currentDataValue;

    if (color) return color;

    if (!!dptoCode && dptoCode !== '') {
      const currentMunic = this.mapDataASF?.find((x: any) => x.DPTOMPIO.toString() === f.properties.mpios) || null;
      const idxValue = this.riskFact ? this.getCatIdx(d, true) : this.getCatIdx(d);

      currentDataValue = !!currentMunic ? currentMunic[idxValue] * 100 : f;
    } else if (!!f && !!d) {
      const currentDepartment = this.mapDataASF?.find((x: any) => x.code.toString() === f.properties.DPTO_CCDGO) || null;

      currentDataValue = !!currentDepartment ? currentDepartment[d] * 100 : f;
    }

    if (typeof f === 'object' && d === '') return '#C7E9C0';

    return currentDataValue === 100 ? '#800026' :
      currentDataValue > 90 ? '#BD0026' :
        currentDataValue > 80 ? '#E31A1C' :
          currentDataValue > 60 ? '#FC4E2A' :
            currentDataValue > 40 ? '#FD8D3C' :
              currentDataValue > 20 ? '#FEB24C' :
                currentDataValue > 0 ? '#FED976' :
                  '#FFEDA0';
  }

  public style(feature: any) {
    return {
      fillColor: this.getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  private highlightFeature(e: any, layerType?: string) {
    const layer = e.target;
    switch (layerType) {
      case 'viewType':
        layer.setStyle({
          weight: 1,
          dashArray: '',
          fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.edge) {
          layer.bringToFront();
        }

        break;
      default:
        layer.setStyle({
          weight: 5,
          dashArray: '',
          fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.edge) {
          layer.bringToFront();
        }

        this.info.update(layer.feature.properties);
        break;
    }
  }

  private resetFeature(e: any, layerType?: string) {
    const layer = e.target;

    switch (layerType) {
      case 'viewType':
        layer.setStyle({
          weight: 0.4,
          dashArray: '',
          fillOpacity: 0.7
        });

        break;
      default:
        layer.setStyle({
          weight: 2,
          dashArray: '3',
          fillOpacity: 0.7
        });
        break;
    }
  }

  private zoomToFeature(e: any, layerType?: string) {
    this.map.fitBounds(e.target.getBounds());
    this.controlService.setControlData({
      control: 'dptoFromMap',
      value: e.target.feature.properties.DPTO_CCDGO
    });
  }

  public zoomToFeatureMap(muniCode: string) {
    const currentlayer = this.mapLayers.find(x => x.name.substring(0, 4) === 'dpto')?.layer;

    if (currentlayer) {
      const arrrayLayers = Object.entries(currentlayer._layers).map(x => { return x[1] });
      const currentMuniLayer: any = arrrayLayers.find((x: any) => x.feature.properties.mpios === muniCode);

      this.map.fitBounds(currentMuniLayer.getBounds(), { maxZoom: 11 })
    }
  }

  public zoomOut() {
    const latLng: LatLngExpression = {
      lat: DEFAULT_LAT,
      lng: DEFAULT_LON
    };

    this.flyTo(latLng, 5.5)
  }

  public setlegend() {
    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = (map) => {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 20, 40, 60, 80, 90, 100],
        labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length - 1; i++) {
        div.innerHTML +=
          '<i style="background:' + this.getLegendColor(grades[i] + 1) + '"></i> '
          + grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '');
      }

      return div;
    };

    legend.addTo(this.map);
  }

  public setInfo() {
    if (this.info) this.info.remove();
    this.info = new L.Control();
    this.info.onAdd = function () {
      this._div = L.DomUtil.create("div", "info");
      this.update();
      return this._div;
    };

    this.info.update = function (props: any) {
      this._div.innerHTML =
        "<h4>Nombre del Municipio</h4>" +
        (props ? "<b>" + props.nombre_mpi + "</b><br />" : "");
    };

    this.info.addTo(this.map);
  }

  // public async setGeoJson(res: any, dptoCode?: any, disease = '', clearLayer = true) {
  //   console.log(res);
  //   if (clearLayer) this.removeLayers();
  //   if (dptoCode) {
  //     this.mapDataASF = null;
  //     await this.getDptoDiseaseData(dptoCode);
  //   } else {
  //     if (!this.mapDataASF) await this.getDiseaseData();
  //   }

  //   console.log(this.mapDataASF);

  //   if (this.isMapready) {
  //     const stateLayer = L.geoJSON(res, {
  //       style: (feature) => ({
  //         fillColor: this.getColor(feature, disease, dptoCode),
  //         weight: 2,
  //         opacity: 1,
  //         color: 'white',
  //         dashArray: '3',
  //         fillOpacity: 0.7
  //       }),
  //       onEachFeature: (_, layer) => (
  //         layer.on({
  //           mouseover: (e) => (this.highlightFeature(e)),
  //           mouseout: (e) => (this.resetFeature(e)),
  //           click: (e) => (this.zoomToFeature(e))
  //         })
  //       )
  //     });

  //     this.mapLayers.push(stateLayer);
  //     this.map.addLayer(stateLayer);
  //     stateLayer.bringToBack();

  //     this.mapLayers.push(this.info);
  //     console.log(this.mapLayers);
  //   }
  // }

  public async setGeoJson(res: any, layerName: string, dptoCode?: any, disease = '', clearLayer = '') {
    if (clearLayer !== '') this.removeLayers(clearLayer);
    if (dptoCode) {
      this.mapDataASF = null;
      this.mapDataASF = this.jsonService.currentDiseaseData;
      this.setInfo();
    } else {
      if (!this.mapDataASF) this.mapDataASF = this.jsonService.currentDiseaseData;
    }

    if (this.isMapready) {
      let stateLayer;

      switch (layerName.substring(0, 4)) {
        case 'view':
          stateLayer = L.geoJSON(res, {
            style: (feature) => ({
              fillColor: this.getColor(null, null, undefined, '#C7E9C0'),
              weight: 0.4,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.7
            })
          });

          this.mapLayers.push({
            name: layerName,
            layer: stateLayer
          });

          this.map.addLayer(stateLayer);
          stateLayer.bringToBack();

          break;
        case 'dpto':
          stateLayer = L.geoJSON(res, {
            style: (feature) => ({
              fillColor: this.getColor(feature, disease, dptoCode),
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            }),
            onEachFeature: (_, layer) => (
              layer.on({
                mouseover: (e) => (this.highlightFeature(e)),
                mouseout: (e) => (this.resetFeature(e)),
                click: (e) => (this.zoomToFeature(e))
              })
            )
          });

          this.mapLayers.push({
            name: layerName,
            layer: stateLayer
          });

          this.map.addLayer(stateLayer);
          stateLayer.bringToFront();
          break;
      }
    }
  }

  public clearGeoJson() {
    this.isMapready && L.geoJSON().clearLayers()
  }

  public removeLayers(layerName: string) {

    switch (layerName) {
      case 'all':
        this.mapLayers.forEach((mapLayer) => {
          this.map.removeLayer(mapLayer.layer);
          if (this.info) this.map.removeLayer(this.info);
        });
        this.mapLayers = [];
        break;
      case 'viewType':
        this.mapLayers.forEach((mapLayer) => {
          if (mapLayer.name === ('viewType')) {
            this.map.removeLayer(mapLayer.layer);
            if (this.info) this.map.removeLayer(this.info);
          }
        });
        this.mapLayers = this.mapLayers.filter(x => x.name.name !== ('viewType'));
        break;
      case 'dpto':
        this.mapLayers.forEach((mapLayer) => {
          if (mapLayer.name.substring(0, 4) === ('dpto')) {
            this.map.removeLayer(mapLayer.layer);
            if (this.info) this.map.removeLayer(this.info);
          }
        });
        this.mapLayers = this.mapLayers.filter(x => x.name.substring(0, 4) !== ('dpto'));
        break;
      default:
        break;
    }

  }

  public getDiseaseData() {
    let promise = new Promise((resolve, reject) => {
      if (!!this.mapDataASF) resolve(this.mapDataASF);
      this.jsonService.getDiseaseDptoJson()
        .toPromise()
        .then(
          (res: any) => {
            this.mapDataASF = res;
            resolve(this.mapDataASF);
          }
        ).catch(
          (err: any) => reject(err)
        );
    });

    return promise;
  }

  public getDptoDiseaseData(dptoCode: string) {
    let promise = new Promise((resolve, reject) => {
      if (!!this.mapDataASF) resolve(this.mapDataASF);
      this.jsonService.getDptoDataGeoJson(dptoCode)
        .toPromise()
        .then(
          (res: any) => {
            this.mapDataASF = res;
            resolve(this.mapDataASF);
          }
        ).catch(
          (err: any) => reject(err)
        );
    });

    return promise;
  }

  // public getColombiaMap(disease: any = '') {
  //   this.mapDataASF = null;
  //   this.jsonService.getColombiaGeoJson().subscribe(res => {
  //     this.setGeoJson(res, 'colombia', null, disease);
  //   });
  // }

  public setViewTypeMap(json: any, typeName: string = '') {
    this.mapDataASF = null;
    this.setGeoJson(json, 'viewType', null, '', 'viewType');
  }

  public setDepartmentMap(json: any, dptoCode: string) {
    let currentRisk = '';
    this.riskFact = false;
    if (sessionStorage.getItem('riskfact') !== null && sessionStorage.getItem('riskfact') !== '') {
      currentRisk = sessionStorage.getItem('riskfact') || '';
      this.riskFact = true;
    } else if (sessionStorage.getItem('riskcat') !== null && sessionStorage.getItem('riskcat') !== '') {
      currentRisk = sessionStorage.getItem('riskcat') || '';
    } else if (sessionStorage.getItem('risk') !== null && sessionStorage.getItem('risk') !== '') {
      currentRisk = sessionStorage.getItem('risk') || '';
    }

    this.setGeoJson(json, `dpto_${dptoCode}`, dptoCode, currentRisk, 'dpto');
  }

  getCatIdx(riskName: string, riskfact = false) {
    let idxValue = ''

    switch (riskName) {
      // CATEGORIAS
      case 'RES':
        idxValue = 'Prob_Riesgo_especifico';
        break;
      case 'COA':
        idxValue = 'Prob_Cat_AMENAZA';
        break;
      case 'COV':
        idxValue = 'Prob_Cat_VULNERABILIDAD';
        break;

      // COMPONENTES
      case 'BIO':
        idxValue = 'Prob_Cat_Bioseguridad';
        break;
      case 'SAN':
        idxValue = 'Prob_Cat_Manejo_Sanitario';
        break;
      case 'MOV':
        idxValue = 'Prob_Cat_Movilización';
        break;
      case 'EBA':
        idxValue = 'Prob_Cat_Entorno_Biofísico_Ambiental';
        break;
      case 'ESO':
        idxValue = 'Prob_Cat_Entorno_Socioeconómico';
        break;
      case 'EBI':
        idxValue = 'Prob_Cat_Espacio_Biofisico';
        break;
      case 'PRO':
        idxValue = 'Prob_Cat_Proceso_Productivo';
        break;
    }

    if (riskfact) {
      idxValue = 'Prob_' + riskName;
    }

    return idxValue;
  }
}
