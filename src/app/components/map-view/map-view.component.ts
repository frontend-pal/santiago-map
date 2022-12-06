import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import L, { LatLngLiteral, Map } from 'leaflet';
import { JsonListService } from 'src/app/services/Json-list.service';
import { MapControllerService } from 'src/app/services/map-controller.service';

export const DEFAULT_LAT = 4.561896;
export const DEFAULT_LON = -74.5472906;
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit {
  private map!: L.Map;
  private geojson?: L.GeoJSON;

  private latLng: LatLngLiteral = {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LON
  };

  constructor(
    private mapService: MapControllerService,
    private jsonService: JsonListService
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

    const blackTile = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });

    // const CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //   subdomains: 'abcd',
    //   maxZoom: 20
    // });

    blackTile.addTo(this.map);

    // L.geoJSON(this.geoJsonData).addTo(this.map);

    this.mapService.setMap(this.map);
    this.mapService.setlegend();
    this.mapService.setInfo();
    this.mapService.getColombiaMap();
  }
}
