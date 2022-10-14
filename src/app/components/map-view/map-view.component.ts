import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Map } from 'mapbox-gl';
import { MapControllerService } from 'src/app/services/map-controller.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  constructor(
    private mapService: MapControllerService
  ) { }


  ngAfterViewInit() {
    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-74.5472906, 4.561896],
      zoom: 4
    });

    this.mapService.setMap(map);
  }

}
