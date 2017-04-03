import { Component, OnInit, Input } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
    // map related options
    mapOption: Leaflet.MapOptions;
    @Input() selectedContinent;
    tileOption: Leaflet.TileLayerOptions;
    markerOption: Leaflet.MarkerOptions = { draggable: true };
    tmpLatLng: Leaflet.LatLng = Leaflet.latLng( [ 0, 0 ]);
    continent: any;

    constructor( private location: Location, private router: Router ) {
      this.mapOption = MapOption;
      this.tileOption = TileOption;
    }

    ngOnInit() {
      this.continent = ContinentInfoList[0];
    }

    onMapClick( event: Leaflet.MouseEvent ): void {
      this.addMarker( event.latlng );
    }

    onMarkerClick( key: string ): void {
      this.deleteMarker( key );
    }

   addMarker( p: Leaflet.LatLng ) {
//     this.observer.push( p );
    }

    deleteMarker( key: string ) {
      //this.markerObserver.remove( key );
    }

    deleteAllMarker() {
   //   this.markerObserver.remove();
    }

    // ドラッグアンドドロップで更新したい場合、サービスの導入が必要
    updateMarker( key, marker: Leaflet.LatLng ) {
   //   this.markerObserver.update( key, marker );
    }
    goBack() {
        this.location.back();
    }

    gotoLanding() {
        this.router.navigate( [ '/' ] );
    }
    gotoMap() {
        this.router.navigate( [ '/map' ] );
    }
}
