import { Observable, Subject } from 'rxjs';
import { Leaflet, Map } from '../';

class MarkerEvent {
    constructor( public readonly key, public readonly: Leaflet.Event ){}
}

export class MarkerEvenetObservable {
    private clickSubject: Subject<MarkerEvent> = new Subject();
    private doubleClickSubject: Subject<MarkerEvent> = new Subject();
    private mouseDownSubject: Subject<MarkerEvent> = new Subject();
    private mouseOverSubject: Subject<MarkerEvent> = new Subject();
    private mouseOutSubject: Subject<MarkerEvent> = new Subject();
    private contextMenuSubject: Subject<MarkerEvent> = new Subject();
    private dragStartSubject: Subject<MarkerEvent> = new Subject();
    private dragSubject: Subject<MarkerEvent> = new Subject();
    private dragEndSubject: Subject<MarkerEvent> = new Subject();

    get click$() { return this.clickSubject.asObservable(); }
    get doubleClick$() { return this.doubleClickSubject.asObservable(); }
    get mouseDown$() { return this.mouseDownSubject.asObservable(); }
    get mouseOver$() { return this.mouseOverSubject.asObservable(); }
    get mouseOut$() { return this.mouseOutSubject.asObservable(); }
    get contextMenu$() { return this.contextMenuSubject.asObservable(); }
    get dragStart$() { return this.dragStartSubject.asObservable(); }
    get drag$() { return this.dragSubject.asObservable(); }
    get dragEnd$() { return this.dragEndSubject.asObservable(); }

    constructor(){
    }
    
    add( key: string, marker: Leaflet.Marker ): void {
        marker.addEventListener( 'click', ( event ) => { this.clickSubject.next( new MarkerEvent( key, event ) ) } );
        marker.addEventListener( 'dblclick', ( event ) => { this.doubleClickSubject.next( new MarkerEvent( key, event ) ) } );
        marker.addEventListener( 'mousedown', ( event ) => { this.mouseDownSubject.next( new MarkerEvent( key, event ) ) } );
        marker.addEventListener( 'mouseover', ( event ) => { this.mouseOverSubject.next( new MarkerEvent( key, event ) ) } );
        marker.addEventListener( 'mouseout', ( event ) => { this.mouseOutSubject.next( new MarkerEvent( key, event ) ) } );
        marker.addEventListener( 'contextmenu', ( event ) => { this.contextMenuSubject.next( new MarkerEvent( key, event ) ) } );
        marker.addEventListener( 'dragstart', ( event ) => { this.dragStartSubject.next( new MarkerEvent( key, event ) ) } );
        marker.addEventListener( 'drag', ( event ) => { this.dragSubject.next( new MarkerEvent( key, event ) ) } );
        marker.addEventListener( 'dragend', ( event ) => { this.dragEndSubject.next( new MarkerEvent( key, event ) ) } );
    }
}