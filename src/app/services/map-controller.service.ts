import { Injectable } from '@angular/core';
import L, { LatLngExpression, Map, GeoJSON } from 'leaflet';
import { JsonListService } from '../services/Json-list.service'
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

  constructor(private jsonService: JsonListService) { }

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

  public getColor(f: any, d?: any) {
    // console.log(f, d);
    const currentDepartment = this.mapDataPPA?.find((x: any) => x.code.toString() === f.properties.DPTO_CCDGO) || null;
    const currentDataDisease = !!currentDepartment ? currentDepartment[d] * 1000 : f;
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
      color: "#666",
      dashArray: "",
      fillOpacity: 0.2
    });

    if (!L.Browser.ie && !L.Browser.edge) {
      layer.bringToFront();
    }

    this.info.update(layer.feature.properties);
  }

  private resetFeature(e: any) {
    const layer = e.target;

    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B'
    });
  }

  private zoomToFeature(e: any) {
    this.map.fitBounds(e.target.getBounds());
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
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
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

  public async setGeoJson(res: any, clearLayer = true, disease = '') {
    if (clearLayer) this.clearGeoJson();
    if (!this.mapDataPPA) await this.getDiseaseData();
    this.removeLayers();

    if (this.isMapready) {
      const stateLayer = L.geoJSON(res, {
        style: (feature) => ({
          fillColor: this.getColor(feature, disease),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        }),
        // onEachFeature: (_, layer) => (
        //   layer.on({
        //     mouseover: (e) => (this.highlightFeature(e)),
        //     mouseout: (e) => (this.resetFeature(e)),
        //     click: (e) => (this.zoomToFeature(e))
        //   })
        // )
      });

      this.mapLayers.push(stateLayer);
      this.map.addLayer(stateLayer);
      stateLayer.bringToBack();

      this.mapLayers.push(this.info);
      console.log(this.mapLayers);
    }
  }

  public clearGeoJson() {
    console.log("clear layers");
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

  public getColombiaMap(disease: any = '') {
    this.jsonService.getColombiaGeoJson().subscribe(res => {
      this.setGeoJson(res, true, disease);
    })
  }
}
