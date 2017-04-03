import { LeafletMapComponent } from '../map/map.component'
import { Component, OnInit, OnDestroy,
         Input, Output, EventEmitter, Host,
         ChangeDetectionStrategy } from '@angular/core';
import * as Leaflet from 'leaflet';

// 初期化時にundefinedになるので、ダミーを用意
const dummyTile: Leaflet.TileLayer = Leaflet.tileLayer( '', {} );

@Component({
  selector: 'leaflet-tile',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LeafletTileComponent implements OnInit, OnDestroy {
  private map: LeafletMapComponent;     // このタイルレイヤを保持するマップ
  private tile: Leaflet.TileLayer;
  private _tileUrl: string = '';

  // Inputs
  @Input()
  set tileUrl( newValue: string ) {
    this._tileUrl = newValue;
    this.tile.setUrl( this._tileUrl );
  }
  @Input() option: Leaflet.TileLayerOptions = {};

  constructor( @Host() map: LeafletMapComponent ) {
    this.tile = dummyTile;
    this.map = map;
  }

  // Life cycle events
  ngOnInit() {
    this.tile = Leaflet.tileLayer( this._tileUrl, this.option );
    this.map.add( this.tile );
  }

  ngOnDestroy() {
    this.map.remove( this.tile );
  }
}
