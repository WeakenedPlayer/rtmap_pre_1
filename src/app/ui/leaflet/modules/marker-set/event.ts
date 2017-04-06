import * as Leaflet from 'leaflet';
import { Observable, Subject } from 'rxjs';

class Event {
    constructor( public readonly key, public readonly: Leaflet.Event ){}
}

export class EventObservableSet {
    private clickSubject: Subject<Event> = new Subject();
    private doubleClickSubject: Subject<Event> = new Subject();
    private mouseDownSubject: Subject<Event> = new Subject();
    private mouseOverSubject: Subject<Event> = new Subject();
    private mouseOutSubject: Subject<Event> = new Subject();
    private contextMenuSubject: Subject<Event> = new Subject();
    private dragStartSubject: Subject<Event> = new Subject();
    private dragSubject: Subject<Event> = new Subject();
    private dragEndSubject: Subject<Event> = new Subject();

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
        marker.addEventListener( 'click', ( event ) => { this.clickSubject.next( new Event( key, event ) ) } );
        marker.addEventListener( 'dblclick', ( event ) => { this.doubleClickSubject.next( new Event( key, event ) ) } );
        marker.addEventListener( 'mousedown', ( event ) => { this.mouseDownSubject.next( new Event( key, event ) ) } );
        marker.addEventListener( 'mouseover', ( event ) => { this.mouseOverSubject.next( new Event( key, event ) ) } );
        marker.addEventListener( 'mouseout', ( event ) => { this.mouseOutSubject.next( new Event( key, event ) ) } );
        marker.addEventListener( 'contextmenu', ( event ) => { this.contextMenuSubject.next( new Event( key, event ) ) } );
        marker.addEventListener( 'dragstart', ( event ) => { this.dragStartSubject.next( new Event( key, event ) ) } );
        marker.addEventListener( 'drag', ( event ) => { this.dragSubject.next( new Event( key, event ) ) } );
        marker.addEventListener( 'dragend', ( event ) => { this.dragEndSubject.next( new Event( key, event ) ) } );
    }
}