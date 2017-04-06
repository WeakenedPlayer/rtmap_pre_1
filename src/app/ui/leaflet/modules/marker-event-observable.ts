import { Observable, Subject } from 'rxjs';
import { Leaflet, Map } from '../';

class MouseEvent {
    constructor( public readonly key, public readonly: Leaflet.MouseEvent ){}
}

export class MarkerEvenetObservable {
    private clickSubject: Subject<MouseEvent> = new Subject();
    private doubleClickSubject: Subject<MouseEvent> = new Subject();
    private mouseDownSubject: Subject<MouseEvent> = new Subject();
    private mouseOverSubject: Subject<MouseEvent> = new Subject();
    private mouseOutSubject: Subject<MouseEvent> = new Subject();
    private contextMenuSubject: Subject<MouseEvent> = new Subject();

    get click$() { return this.clickSubject.asObservable(); }
    get doubleClick$() { return this.doubleClickSubject.asObservable(); }
    get mouseDown$() { return this.mouseDownSubject.asObservable(); }
    get mouseOver$() { return this.mouseOverSubject.asObservable(); }
    get mouseOut$() { return this.mouseOutSubject.asObservable(); }
    get contextMenu$() { return this.contextMenuSubject.asObservable(); }

    constructor(){
    }
    
    add( key: string, marker: Leaflet.Marker ): void {
        marker.addEventListener( 'click', ( event ) => { this.clickSubject.next( new MouseEvent( key, event as Leaflet.MouseEvent ) ) } );
        marker.addEventListener( 'dblclick', ( event ) => { this.doubleClickSubject.next( new MouseEvent( key, event as Leaflet.MouseEvent ) ) } );
        marker.addEventListener( 'mousedown', ( event ) => { this.mouseDownSubject.next( new MouseEvent( key, event as Leaflet.MouseEvent ) ) } );
        marker.addEventListener( 'mouseover', ( event ) => { this.mouseOverSubject.next( new MouseEvent( key, event as Leaflet.MouseEvent ) ) } );
        marker.addEventListener( 'mouseout', ( event ) => { this.mouseOutSubject.next( new MouseEvent( key, event as Leaflet.MouseEvent ) ) } );
        marker.addEventListener( 'contextmenu', ( event ) => { this.contextMenuSubject.next( new MouseEvent( key, event as Leaflet.MouseEvent ) ) } );
    }
}