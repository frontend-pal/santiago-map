import { Injectable } from '@angular/core';
import L, { LatLngExpression, Map } from 'leaflet';
@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  private map!: Map;
  public mapLayers = [];

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

  public highlightFeature(e: any) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    layer.bringToFront();
  }

  public setGeoJson(res: any, clearLayer = true) {
    if (clearLayer) this.clearGeoJson();
    this.isMapready && L.geoJSON(res).addTo(this.map);
  }

  public clearGeoJson() {
    console.log("clear layers");
    this.isMapready && L.geoJSON().clearLayers()
  }
}
