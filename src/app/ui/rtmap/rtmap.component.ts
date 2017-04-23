import { Component, OnInit, Input, Renderer, ElementRef } from '@angular/core';
import { Map } from 'component';

@Component({
  selector: 'map',
  template: ''
})
export class MapComponent implements OnInit {
    @Input() control: Map.Control;
    private mapDiv: any;    // map を設置する
    constructor( private el: ElementRef, private re: Renderer ) {
        // create div element inside "app-leaflet-test" for leaflet map
        this.mapDiv = this.re.createElement( el.nativeElement, 'div');
    
        // tentative: prevent map height becomes 0px
        this.re.setElementStyle( this.mapDiv, 'height', '100%' );
        this.re.setElementStyle( this.mapDiv, 'background-color', '#051111' );
    }

  ngOnInit() {
      if( this.control ) {
          this.control.registerTarget( this.mapDiv );
      } else {
          throw new Error( 'map controller is not defined' );
      }
  }
}
