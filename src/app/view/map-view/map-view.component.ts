import { Component, OnInit, OnDestroy, Input, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { AngularFire } from 'angularfire2';
import { Leaflet, Map, DB, ChangeObservable } from 'component';
import { UI } from 'app/ui';


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

const MarkerOptions: Leaflet.MarkerOptions = {
        draggable: true
};

const ContinentInfoList = [
    { id: 1, name: 'Indar', url: 'https://raw.githubusercontent.com/WeakenedPlayer/resource/master/map/indar/{z}/{y}/{x}.jpg'},
    { id: 2, name: 'Esamir', url: 'https://raw.githubusercontent.com/WeakenedPlayer/resource/master/map/esamir/{z}/{y}/{x}.jpg'},
    { id: 3, name: 'Amerish', url: 'https://raw.githubusercontent.com/WeakenedPlayer/resource/master/map/amerish/{z}/{y}/{x}.jpg'},
    { id: 4, name: 'Hossin', url: 'https://raw.githubusercontent.com/WeakenedPlayer/resource/master/map/hossin/{z}/{y}/{x}.jpg'}
];

class MyMapControl extends Map.Control {
    private db: UI.Rtmap.MarkerDataRepo;
    private layer: UI.Rtmap.MarkerLayer;
    private tile: Leaflet.TileLayer;
    private subscription: Subscription;

    protected mapOptions(): Leaflet.MapOptions {
        return MapOption;
    }

    protected postRegistered(): void {
        this.map.addLayer( this.tile );
        this.map.addLayer( this.layer );
        this.subscription = this.layer.sync$.subscribe();
    }

    constructor( private af: AngularFire ) {
        super();
        this.tile = Leaflet.tileLayer( ContinentInfoList[0].url, TileOption );
        
        this.db = new UI.Rtmap.MarkerDataRepo( this.af, DB.Path.fromUrl( '/map/marker' ) );
        this.layer = new UI.Rtmap.MarkerLayer( this.db.getAll() );

        this.layer.click$.map( event => this.toggleMarkerDraggable( event ) ).subscribe();
        this.layer.dragStart$.flatMap( event => this.dragMarker( event )　).subscribe(); 
    }
    
    private toggleMarkerDraggable( event: Leaflet.Event ) {
        let marker = event.target as Map.Marker;
        if( marker.options.draggable ) {
            marker.dragging.disable();
            marker.options.draggable = false;
        } else {
            marker.dragging.enable();
            marker.options.draggable = true;
        }
    }
    
    private dragMarker( event: Leaflet.Event ) { 
        let marker = event.target as Map.Marker;
        return marker.dragEnd$.take(1).flatMap( event => {
            let marker = event.target as Map.Marker;
            let latlng = marker.getLatLng();
            return Observable.fromPromise( this.db.update( marker.key, latlng.lat, latlng.lng, 1) ); 
        } );
    }
    
    onDestroy(): void {
        this.subscription.unsubscribe();
    }
}



@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, OnDestroy {
    mapControl: MyMapControl;
    constructor( private af: AngularFire, private re: Renderer2, private location: Location, private router: Router ) {
        this.mapControl = new MyMapControl( af );
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.mapControl.onDestroy();
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
