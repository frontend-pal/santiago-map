import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mapa!: mapboxgl.Map;

  ngOnInit(): void {
    this.initMap();
  }
  initMap() {
    // this.mapa = new mapboxgl.Map({
    //   container: 'map-box', // container ID
    //   style: 'mapbox://styles/mapbox/streets-v11', // style URL
    //   center: [-74.5472906, 4.561896], // starting position [lng, lat]
    //   zoom: 5, // starting zoom
    //   projection: { name: 'mercator' } // display the map as a 3D globe
    // });
  }

  
}
