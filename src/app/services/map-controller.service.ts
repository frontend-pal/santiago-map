import { Injectable } from '@angular/core';
import L, { LatLngExpression, Map, GeoJSON } from 'leaflet';
@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  private map!: Map;
  public info!: any;
  public mapLayers: GeoJSON<any>[] | any[] = [];
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

  public getColor(d: any) {
    return d > 1000 ? '#800026' :
      d > 500 ? '#BD0026' :
        d > 200 ? '#E31A1C' :
          d > 100 ? '#FC4E2A' :
            d > 50 ? '#FD8D3C' :
              d > 20 ? '#FEB24C' :
                d > 10 ? '#FED976' :
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

  public setGeoJson(res: any, clearLayer = true) {
    this.removeLayers();
    if (clearLayer) this.clearGeoJson();  
    if (this.isMapready) {
      const stateLayer = L.geoJSON(res, {
        style: (feature) => ({
          weight: 3,
          opacity: 0.5,
          color: '#008f68',
          fillOpacity: 0.8,
          fillColor: '#6DB65B'
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

      /* init info */
      this.info = new L.Control();
      this.info.onAdd = function () {
        this._div = L.DomUtil.create("div", "info");
        this.update();
        return this._div;
      };
      this.info.update = function (props: any) {
        console.log(props);
        this._div.innerHTML =
          "<h4>Nombre del Departamento</h4>" +
          (props ? "<b>" + props.DPTO_CNMBR + "</b><br />" : "");
      };

      this.info.addTo(this.map);
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
}
