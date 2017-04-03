import { Component, OnInit, OnDestroy,
         Input, Output, EventEmitter, Host,
         ChangeDetectionStrategy } from '@angular/core';
import { LeafletMapComponent } from '../map/map.component'
import * as Leaflet from 'leaflet';

const dummyMarker: Leaflet.Marker = Leaflet.marker([ 0, 0 ], {} );

@Component({
  selector: 'leaflet-marker',
  template: '',
})

export class LeafletMarkerComponent implements OnInit, OnDestroy {
  private static dummyMarker: Leaflet.Marker = Leaflet.marker([ 0, 0 ], {} );
  private map: LeafletMapComponent;
  private marker: Leaflet.Marker = LeafletMarkerComponent.dummyMarker;

  // inputs
  // setter/getter: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#parent-to-child-setter
  @Input()
  set latlng( latlng: Leaflet.LatLng )
  {
    this.marker.setLatLng( latlng );
  }
  get latlng(): Leaflet.LatLng {
    return this.marker.getLatLng();
  }
  // option: http://leafletjs.com/reference-1.0.2.html#marker
  @Input() option: Leaflet.MarkerOptions = { draggable: true };

  // outputs
  @Output() latlngChange = new EventEmitter<Leaflet.LatLng>();
  @Output() leafletClick = new EventEmitter<Leaflet.MouseEvent>();
  @Output() leafletDragStart = new EventEmitter<Leaflet.Event>();
  @Output() leafletDrag = new EventEmitter<Leaflet.Event>();
  @Output() leafletDragEnd = new EventEmitter<Leaflet.DragEndEvent>();

  constructor( @Host() map: LeafletMapComponent ) {
    this.marker = LeafletMarkerComponent.dummyMarker;
    this.map = map;
  }

  ngOnInit() {
    // create marker using given @Input()s 
    this.marker = Leaflet.marker( this.latlng, this.option );

    // register marker to parent map
    this.map.add( this.marker );

    // register event handler
    this.marker.on('move', ( event: Leaflet.Event ) => { this.latlngChange.emit( this.latlng ); } );
    this.marker.on('click', ( event: Leaflet.MouseEvent ) => { this.leafletClick.emit( event ); } );
    this.marker.on('dragstart', ( event: Leaflet.Event ) => { this.leafletDragStart.emit( event ); } );
    this.marker.on('drag', ( event: Leaflet.Event ) => { this.leafletDrag.emit( event ); } );
    this.marker.on('dragend', ( event: Leaflet.DragEndEvent ) => { this.leafletDragEnd.emit( event ); } );
  }

  ngOnDestroy() {
    this.map.remove( this.marker );
  }
}
