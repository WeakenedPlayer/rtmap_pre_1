import { Component, OnInit,
    Renderer, ElementRef, } from '@angular/core';

import * as Leaflet from 'leaflet';
const MapOption: Leaflet.MapOptions = {
        crs: Leaflet.CRS.Simple,
        attributionControl: false,
        center: [ -128, 128 ],
        zoom: 1
    };

const TileOption: Leaflet.TileLayerOptions = {
    tileSize: 256,
    minZoom: 1,
    maxZoom: 7,
    maxNativeZoom: 5,
    noWrap: true
};

const ContinentInfoList = [
    { id: 1, name: 'Indar', url: 'https://raw.githubusercontent.com/WeakenedPlayer/resource/master/map/indar/{z}/{y}/{x}.jpg'},
    { id: 2, name: 'Esamir', url: 'https://raw.githubusercontent.com/WeakenedPlayer/resource/master/map/esamir/{z}/{y}/{x}.jpg'},
    { id: 3, name: 'Amerish', url: 'https://raw.githubusercontent.com/WeakenedPlayer/resource/master/map/amerish/{z}/{y}/{x}.jpg'},
    { id: 4, name: 'Hossin', url: 'https://raw.githubusercontent.com/WeakenedPlayer/resource/master/map/hossin/{z}/{y}/{x}.jpg'}
];
          
@Component({
  selector: 'app-sample-map',
  templateUrl: './sample-map.component.html',
  styleUrls: ['./sample-map.component.scss']
})
export class SampleMapComponent implements OnInit {
    private mapDiv: any;
    private tile: Leaflet.TileLayer;
    private map: Leaflet.Map;
  constructor( el: ElementRef, re: Renderer ) {
      // create div element inside "app-leaflet-test" for leaflet map
      this.mapDiv = re.createElement( el.nativeElement, 'div');

      // tentative: prevent map height becomes 0px
      re.setElementStyle( this.mapDiv, 'height', '100%' );
      re.setElementStyle( this.mapDiv, 'background-color', '#051111' );
      
      console.log('hi');
  }

  ngOnInit() {
      this.map = Leaflet.map( this.mapDiv, MapOption );
      this.tile = Leaflet.tileLayer( ContinentInfoList[0].url, TileOption );
      this.map.addLayer( this.tile );
  }

}
