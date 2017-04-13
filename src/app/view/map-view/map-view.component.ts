import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Leaflet, Map } from '../../ui';
import { Observable, Subject } from 'rxjs';
import { AngularFire } from 'angularfire2';;
import { DB } from 'service';

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

class DbMarker extends Map.ReactiveMarker {
    constructor( public readonly key: string, latLng: Leaflet.LatLngExpression ) {
        super( latLng );
    }
}

class MyMapControl extends Map.Control {
    db: Map.MarkerInfoDB;
    private tile: Leaflet.TileLayer;
    private layer: Leaflet.LayerGroup;
    private markers: { [key: string]: Leaflet.Marker } = {};
    private click$: Subject<DbMarker> = new Subject();
    private dragstart$: Subject<DbMarker> = new Subject();
    
    protected postMapCreated(): void {
        this.tile = Leaflet.tileLayer( ContinentInfoList[0].url, TileOption );
        this.map.addLayer( this.tile );
        this.map.addLayer( this.layer );
    }
    
    protected mapOptions(): Leaflet.MapOptions {
        return MapOption;
    }

    constructor( private af: AngularFire ) {
        super();
        this.layer = Leaflet.layerGroup([]);
        this.db = new Map.MarkerInfoDB( af, DB.Path.fromUrl( '/map/marker' ) );
        let obs = this.db.getAll().publishReplay(1).refCount();
        
        let modified = DB.ChangeObservable.modified<Map.MarkerInfo>( obs, ( obj )=> obj.key, ( obj )=> obj.ts ).do( markers => {
             for( let marker of markers ) {
                 this.markers[ marker.key ].setLatLng( [ marker.lat, marker.lng ] );
             }
        } ).subscribe();
        
        let added = DB.ChangeObservable.added<Map.MarkerInfo>( obs, ( obj )=> obj.key ).do( markers => {
            for( let marker of markers ) {
                let m = new DbMarker( marker.key, [ marker.lat, marker.lng ] );
                m.addEventListener( 'click', evt => this.click$.next( evt.target ) );
                m.addEventListener( 'dragstart', evt => this.dragstart$.next( evt.target ) );
                this.markers[ marker.key ] = m;
                this.layer.addLayer( m );
            }
        } ).subscribe();
        
        let removed = DB.ChangeObservable.removed<Map.MarkerInfo>( obs, ( obj )=> obj.key ).do( keys => {
            for( let key of keys ) {
                this.markers[ key ].remove();
            }
        } ).subscribe();
        this.db.push( - Math.random() * 100 - 100, Math.random() * 100 + 100, 9 );

        this.click$.do( marker => {
            if( marker.options.draggable ) {
                marker.dragging.disable();
                marker.options.draggable = false;
            } else {
                marker.dragging.enable();
                marker.options.draggable = true;
            }
        } ).subscribe();
        

        this.dragstart$.flatMap( marker => {
            return marker.dragEnd$.take(1);
        } ).do( event => {
            let marker = event.target;
            console.log( 'drag end' );
            console.log( event );
            this.db.update( marker.key, marker._latlng.lat, marker._latlng.lng, 1); 
        } ).subscribe();
    }
}



@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
    mapControl: MyMapControl;
    constructor( private af: AngularFire, private location: Location, private router: Router ) {
        this.mapControl = new MyMapControl( af );
    }

    ngOnInit() {
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
