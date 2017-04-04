import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Leaflet, Map } from '../../ui';

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

class MyMapControl extends Map.Control {
    private tile: Leaflet.TileLayer;
    
    protected postMapCreated(): void {
        this.tile = Leaflet.tileLayer( ContinentInfoList[0].url, TileOption );
        this.map.addLayer( this.tile );
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
