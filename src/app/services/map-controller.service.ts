import { Injectable } from '@angular/core';
import { LatLngExpression, Map } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  private map?: Map;


  get isMapready() {
    return !!this.map;
  } 

  setMap(map: Map): void {
    this.map = map;
  }

  flyTo(coords: LatLngExpression, zoom = 6): void {
    if ( !this.isMapready ) throw new Error('El mapa no esta inicializado correctamente.');

    this.map?.flyTo(
      coords,
      zoom
    )
  }

}
