import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Leaflet, Map } from '../../ui';
import { Observable } from 'rxjs';
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

class MyMapControl extends Map.Control {
    private tile: Leaflet.TileLayer;
    // private markerLayer = new Map.MarkerSet.Layer();
    
    protected postMapCreated(): void {
        this.tile = Leaflet.tileLayer( ContinentInfoList[0].url, TileOption );
        this.map.addLayer( this.tile );
   /*
        this.map.addLayer( this.markerLayer.getLayerGroup() );
        
        let operations = [ new Map.MarkerSet.MoveOperation( '1', 0, 0, MarkerOptions),
                           new Map.MarkerSet.MoveOperation( '2', 0, 100, MarkerOptions ),
                           new Map.MarkerSet.MoveOperation( '3', -100, 0, MarkerOptions ),];
        
        Observable.of( operations ).subscribe( this.markerLayer );
        this.markerLayer.event.click$.subscribe( info => { console.log('click ' + info.key ) } );
        this.markerLayer.event.doubleClick$.subscribe( info => { console.log( 'double click ' + info.key ) } );
        this.markerLayer.event.mouseOver$.subscribe( info => { console.log( 'mouse over ' + info.key ) } );
        this.markerLayer.event.mouseDown$.subscribe( info => { console.log( 'mouse down ' + info.key ) } );
        this.markerLayer.event.mouseOut$.subscribe( info => { console.log( 'mouse out ' + info.key ) } );
        this.markerLayer.event.dragStart$.subscribe( info => { console.log( 'drag start ' + info.key ) } );
        this.markerLayer.event.drag$.subscribe( info => { console.log( 'drag ' + info.key ) } );
        this.markerLayer.event.dragEnd$.subscribe( info => { console.log( 'drag end ' + info.key ) } );*/
    }
    
    protected mapOptions(): Leaflet.MapOptions {
        return MapOption;
    }

    constructor() {
        super();
    }
}


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
    mapControl: MyMapControl;
    db: Map.MarkerInfoDB;
    constructor( private af: AngularFire, private location: Location, private router: Router ) {
        this.mapControl = new MyMapControl();
        this.db = new Map.MarkerInfoDB( af, DB.Path.fromUrl( '/map/marker' ) );
        
        this.db.push( 10, 10, 1 ).then( key => { console.log( key ) } );
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
