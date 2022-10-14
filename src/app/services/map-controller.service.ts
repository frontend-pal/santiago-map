import { Injectable } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';

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

  flyTo(coords: LngLatLike): void {
    if ( !this.isMapready ) throw new Error('El mapa no esta inicializado correctamente.');

    this.map?.flyTo({
      zoom: 6,
      center: coords
    })
  }

}
