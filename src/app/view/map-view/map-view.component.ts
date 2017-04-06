import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Leaflet, Map } from '../../ui';
import { Observable } from 'rxjs';

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
    private obs: Map.MarkerEvenetObservable = new Map.MarkerEvenetObservable();
    private markers: Map.MarkerLayer = new Map.MarkerLayer( this.obs );
    
    protected postMapCreated(): void {
        this.tile = Leaflet.tileLayer( ContinentInfoList[0].url, TileOption );
        this.map.addLayer( this.tile );
        this.map.addLayer( this.markers.getLayerGroup() );
        
        let operations = [ new Map.MarkerMoveOperation( '1', 0, 0, MarkerOptions),
                           new Map.MarkerMoveOperation( '2', 0, 100, MarkerOptions ),
                           new Map.MarkerMoveOperation( '3', -100, 0, MarkerOptions ),];
        
        Observable.of( operations ).subscribe( this.markers );
        this.obs.click$.subscribe( evt => { console.log( 'click ' + evt.key ) } );
        this.obs.doubleClick$.subscribe( evt => { console.log( 'double click ' + evt.key ) } );
        this.obs.mouseOver$.subscribe( evt => { console.log( 'mouse over ' + evt.key ) } );
        this.obs.mouseDown$.subscribe( evt => { console.log( 'mouse down ' + evt.key ) } );
        this.obs.mouseOut$.subscribe( evt => { console.log( 'mouse out ' + evt.key ) } );
        this.obs.dragStart$.subscribe( evt => { console.log( 'drag start ' + evt.key ) } );
        this.obs.drag$.subscribe( evt => { console.log( 'drag ' + evt.key ) } );
        this.obs.dragEnd$.subscribe( evt => { console.log( 'drag end ' + evt.key ) } );
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
    constructor( private location: Location, private router: Router ) {
        this.mapControl = new MyMapControl();
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
