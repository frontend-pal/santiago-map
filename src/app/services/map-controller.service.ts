import { Injectable } from '@angular/core';
import L, { LatLngExpression, Map, GeoJSON } from 'leaflet';
import { JsonListService } from '../services/Json-list.service'
import { ControlFormService } from '../services/control-form.service';
@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  private map!: Map;
  public info!: any;
  public mapLayers: GeoJSON<any>[] | any[] = [];
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

  public getColor(f: any, d?: any, dptoCode?: string) {
    let currentDataDisease;

    if (!!dptoCode && dptoCode !== '') {
      const currentMunic = this.mapDataPPA?.find((x: any) => x.divipola.toString() === f.properties.mpios) || null;

      currentDataDisease = !!currentMunic ? currentMunic[d] * 1000 : f;
    } else {
      const currentDepartment = this.mapDataPPA?.find((x: any) => x.code.toString() === f.properties.DPTO_CCDGO) || null;

      currentDataDisease = !!currentDepartment ? currentDepartment[d] * 1000 : f;
    }

    console.log(currentDataDisease);
    if (typeof f === 'object' && d === '') return '#3388ff';

    return currentDataDisease > 1000 ? '#800026' :
      currentDataDisease > 500 ? '#BD0026' :
        currentDataDisease > 200 ? '#E31A1C' :
          currentDataDisease > 100 ? '#FC4E2A' :
            currentDataDisease > 50 ? '#FD8D3C' :
              currentDataDisease > 20 ? '#FEB24C' :
                currentDataDisease > 10 ? '#FED976' :
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

  private highlightFeature(e: any) {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.edge) {
      layer.bringToFront();
    }

    this.info.update(layer.feature.properties);
  }

  private resetFeature(e: any) {
    const layer = e.target;

    layer.setStyle({
      weight: 2,
      dashArray: '3',
      fillOpacity: 0.7
    });
  }

  private zoomToFeature(e: any) {
    console.log(e);
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
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + this.getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '+');
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

  public async setGeoJson(res: any, dptoCode?: any, disease = '', clearLayer = true) {
    console.log(res);
    if (clearLayer) this.removeLayers();
    if (dptoCode) {
      this.mapDataPPA = null;
      await this.getDptoDiseaseData(dptoCode);
    } else {
      if (!this.mapDataPPA) await this.getDiseaseData();
    }

    console.log(this.mapDataPPA);

    if (this.isMapready) {
      const stateLayer = L.geoJSON(res, {
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

      this.mapLayers.push(stateLayer);
      this.map.addLayer(stateLayer);
      stateLayer.bringToBack();

      this.mapLayers.push(this.info);
      console.log(this.mapLayers);
    }
  }

  public clearGeoJson() {
    this.isMapready && L.geoJSON().clearLayers()
  }

  public removeLayers() {
    this.mapLayers.forEach((layer) => {
      this.map.removeLayer(layer);
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

  public getColombiaMap(disease: any = '') {
    console.log(disease);
    this.mapDataPPA = null;
    this.jsonService.getColombiaGeoJson().subscribe(res => {
      this.setGeoJson(res, null, disease);
    });
  }

  public setDepartmentMap(json: any, dptoCode: string) {
    console.log(json, dptoCode);
    const currentRisk = sessionStorage.getItem('risk') || '';
    console.log(currentRisk);
    this.setGeoJson(json, dptoCode, currentRisk);
  }

  public seMuniMap(json: any, dptoCode: string) {
    console.log(json, dptoCode);
    const currentRisk = sessionStorage.getItem('risk') || '';
    console.log(currentRisk);
    this.setGeoJson(json, dptoCode, currentRisk);
  }
}
