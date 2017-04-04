import { Component, OnInit, Input } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

      
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
    }

    ngOnInit() {
    }

    onMapClick( event: Leaflet.MouseEvent ): void {
    }

    onMarkerClick( key: string ): void {
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
