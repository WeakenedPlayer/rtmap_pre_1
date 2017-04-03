import { Component, OnInit, OnDestroy,
         Renderer, ElementRef,
         Input, Output, EventEmitter,
         ChangeDetectionStrategy } from '@angular/core';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'leaflet-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LeafletMapComponent implements OnInit, OnDestroy {
  // used only in "OnInit"
  @Input() option: Leaflet.MapOptions = {}; // default value

  // Interaction events
  @Output() leafletClick: EventEmitter<Leaflet.MouseEvent> = new EventEmitter<Leaflet.MouseEvent>();
  @Output() leafletDblClick: EventEmitter<Leaflet.MouseEvent> = new EventEmitter<Leaflet.MouseEvent>();

  private mapDiv: any;
  private map: Leaflet.Map;
  private tile: Leaflet.TileLayer;

  constructor( el: ElementRef, re: Renderer ) {
    // create div element inside "app-leaflet-test" for leaflet map
    this.mapDiv = re.createElement( el.nativeElement, 'div');

    // tentative: prevent map height becomes 0px
    re.setElementStyle( this.mapDiv, 'height', '!100%' );
    re.setElementStyle( this.mapDiv, 'background-color', '#051111' );
  }

  // life-cycle hook
  ngOnInit() {
    this.map = Leaflet.map( this.mapDiv, this.option );

    // register event handlers
    this.map.on( 'click', ( event: Leaflet.MouseEvent ): void => { this.leafletClick.emit( event ); } );
    this.map.on( 'dblclick ', ( event: Leaflet.MouseEvent ): void => { this.leafletDblClick.emit( event ); } );
  }

  ngOnDestroy() {
    this.map.remove();
  }

  // called by child component (layer add/remove)
  add( layer: Leaflet.Layer ) { this.map.addLayer( layer ); }
  remove( layer: Leaflet.Layer ) { this.map.removeLayer( layer ); }
}
