import { Injectable } from '@angular/core';
import L, { LatLngExpression, Map, GeoJSON } from 'leaflet';
import { JsonListService } from '../services/Json-list.service'
import { ControlFormService } from '../services/control-form.service';

interface MapLayers {
  name: string;
  layer: GeoJSON | any | null;
}
@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  private map!: Map;
  public info!: any;
  public mapLayers: MapLayers[] | any[] = [];
  public mapDataPPA: any;
  private _toggleMenu!: boolean;

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
    console.log(f, d, dptoCode);
    console.log(this.mapDataPPA);
    if (color) return color;
    let currentDataDisease;

    if (!!dptoCode && dptoCode !== '') {
      const currentMunic = this.mapDataPPA?.find((x: any) => x.DPTOMPIO.toString() === f.properties.mpios) || null;

      console.log(currentMunic);
      currentDataDisease = !!currentMunic ? currentMunic['Prob_Riesgo_especifico'] * 100 : f;
      console.log(currentDataDisease);
    } else if (!!f && !!d) {
      const currentDepartment = this.mapDataPPA?.find((x: any) => x.code.toString() === f.properties.DPTO_CCDGO) || null;

      currentDataDisease = !!currentDepartment ? currentDepartment[d] * 100 : f;
    }

    if (typeof f === 'object' && d === '') return '#C7E9C0';

    return currentDataDisease === 100 ? '#800026' :
      currentDataDisease >  90 ? '#BD0026' :
        currentDataDisease > 80 ? '#E31A1C' :
          currentDataDisease > 60 ? '#FC4E2A' :
            currentDataDisease > 40 ? '#FD8D3C' :
              currentDataDisease > 20 ? '#FEB24C' :
                currentDataDisease > 0 ? '#FED976' :
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

  public setlegend() {
    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = (map) => {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 20, 40, 60, 80, 90, 100],
        labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length - 1; i++) {
        console.log(i);
        div.innerHTML +=
          '<i style="background:' + this.getLegendColor(grades[i] + 1) + '"></i> '
          + grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '');
      }

      return div;
    };

    legend.addTo(this.map);
  }

  public setInfo() {
    this.info = new L.Control();
    this.info.onAdd = function () {
      this._div = L.DomUtil.create("div", "info");
      this.update();
      return this._div;
    };

    this.info.update = function (props: any) {
      this._div.innerHTML =
        "<h4>Nombre del Departamento</h4>" +
        (props ? "<b>" + props.DPTO_CNMBR + "</b><br />" : "");
    };

    this.info.addTo(this.map);
  }

  // public async setGeoJson(res: any, dptoCode?: any, disease = '', clearLayer = true) {
  //   console.log(res);
  //   if (clearLayer) this.removeLayers();
  //   if (dptoCode) {
  //     this.mapDataPPA = null;
  //     await this.getDptoDiseaseData(dptoCode);
  //   } else {
  //     if (!this.mapDataPPA) await this.getDiseaseData();
  //   }

  //   console.log(this.mapDataPPA);

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

  public async setGeoJson(res: any, layerName: string, dptoCode?: any, disease = '', clearLayer = true) {
    // if (clearLayer) this.removeLayers();
    if (dptoCode) {
      this.mapDataPPA = null;     
      this.mapDataPPA = this.jsonService.currentDiseaseData;
    } else {
      if (!this.mapDataPPA) this.mapDataPPA = this.jsonService.currentDiseaseData;
    }

    if (this.isMapready) {
      let stateLayer = L.geoJSON(res, {
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

      switch (layerName) {
        case 'viewType':
          stateLayer = L.geoJSON(res, {
            style: (feature) => ({
              fillColor: this.getColor(null, null, undefined, '#C7E9C0'),
              weight: 0.4,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.7
            })
          });
          break;

        default:

          break;
      }


      this.mapLayers.push({
        name: layerName,
        layer: stateLayer
      });

      this.map.addLayer(stateLayer);
      stateLayer.bringToFront();

      console.log(this.mapLayers);
    }
  }

  public clearGeoJson() {
    this.isMapready && L.geoJSON().clearLayers()
  }

  public removeLayers() {
    this.mapLayers.forEach((mapLayer) => {
      this.map.removeLayer(mapLayer.layer);
      this.map.removeLayer(this.info);
    });
    this.mapLayers = [];
  }

  public getDiseaseData() {
    let promise = new Promise((resolve, reject) => {
      if (!!this.mapDataPPA) resolve(this.mapDataPPA);
      this.jsonService.getDiseaseDptoJson()
        .toPromise()
        .then(
          (res: any) => {
            this.mapDataPPA = res;
            resolve(this.mapDataPPA);
          }
        ).catch(
          (err: any) => reject(err)
        );
    });

    return promise;
  }

  public getDptoDiseaseData(dptoCode: string) {
    let promise = new Promise((resolve, reject) => {
      if (!!this.mapDataPPA) resolve(this.mapDataPPA);
      this.jsonService.getDptoDataGeoJson(dptoCode)
        .toPromise()
        .then(
          (res: any) => {
            this.mapDataPPA = res;
            resolve(this.mapDataPPA);
          }
        ).catch(
          (err: any) => reject(err)
        );
    });

    return promise;
  }

  // public getColombiaMap(disease: any = '') {
  //   this.mapDataPPA = null;
  //   this.jsonService.getColombiaGeoJson().subscribe(res => {
  //     this.setGeoJson(res, 'colombia', null, disease);
  //   });
  // }

  public setViewTypeMap(json: any, typeName: string = '') {
    this.mapDataPPA = null;
    this.setGeoJson(json, 'viewType', null);
  }

  public setDepartmentMap(json: any, dptoCode: string) {
    const currentRisk = sessionStorage.getItem('risk') || '';

    this.setGeoJson(json, `dpto_${dptoCode}`, dptoCode, currentRisk);
  }

  public seMuniMap(json: any, dptoCode: string) {
    const currentRisk = sessionStorage.getItem('risk') || '';

    this.setGeoJson(json, `,muni_${dptoCode}`, dptoCode, currentRisk);
  }
}
