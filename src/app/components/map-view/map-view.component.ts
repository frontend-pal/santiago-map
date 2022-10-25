import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import L, { LatLngLiteral, Map } from 'leaflet';
import { MapControllerService } from 'src/app/services/map-controller.service';

export const DEFAULT_LAT = 4.561896;
export const DEFAULT_LON = -74.5472906;
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit {
  private map!: Map;
  private latLng: LatLngLiteral = {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LON
  };

  constructor(
    private mapService: MapControllerService
  ) { }


  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.latLng,
      attributionControl: false,
      zoom: 5.5
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://1938.com.es">Web Inteligencia Artificial</a>'
    });

    tiles.addTo(this.map);
    this.mapService.setMap(this.map);
  }
}
