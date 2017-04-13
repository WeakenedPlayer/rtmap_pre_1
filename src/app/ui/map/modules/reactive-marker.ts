import * as Leaflet from 'leaflet';
import { Subject } from 'rxjs';

export class ReactiveMarker extends Leaflet.Marker {
    private clickSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private doubleClickSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private mouseDownSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private mouseOverSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private mouseOutSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private contextMenuSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private dragStartSubject: Subject<Leaflet.Event> = new Subject();
    private dragSubject: Subject<Leaflet.Event> = new Subject();
    private dragEndSubject: Subject<Leaflet.Event> = new Subject();

    get click$() { return this.clickSubject.asObservable(); }
    get doubleClick$() { return this.doubleClickSubject.asObservable(); }
    get mouseDown$() { return this.mouseDownSubject.asObservable(); }
    get mouseOver$() { return this.mouseOverSubject.asObservable(); }
    get mouseOut$() { return this.mouseOutSubject.asObservable(); }
    get contextMenu$() { return this.contextMenuSubject.asObservable(); }
    get dragStart$() { return this.dragStartSubject.asObservable(); }
    get drag$() { return this.dragSubject.asObservable(); }
    get dragEnd$() { return this.dragEndSubject.asObservable(); }

    constructor( latLng: Leaflet.LatLng, options: Leaflet.MarkerOptions ) {
        super( latLng, options );
        
        // イベントハンドラをSubjectに置き換え(冗長だけど便利になるはず)
        this.addEventListener( 'click',       ( event ) => { this.clickSubject.next( event as Leaflet.MouseEvent ) } );
        this.addEventListener( 'dblclick',    ( event ) => { this.doubleClickSubject.next( event as Leaflet.MouseEvent ) } );
        this.addEventListener( 'mousedown',   ( event ) => { this.mouseDownSubject.next( event as Leaflet.MouseEvent ) } );
        this.addEventListener( 'mouseover',   ( event ) => { this.mouseOverSubject.next( event as Leaflet.MouseEvent ) } );
        this.addEventListener( 'mouseout',    ( event ) => { this.mouseOutSubject.next( event as Leaflet.MouseEvent ) } );
        this.addEventListener( 'contextmenu', ( event ) => { this.contextMenuSubject.next( event as Leaflet.MouseEvent ) } );
        this.addEventListener( 'dragstart',   ( event ) => { this.dragStartSubject.next( event ) } );
        this.addEventListener( 'drag',        ( event ) => { this.dragSubject.next( event ) } );
        this.addEventListener( 'dragend',     ( event ) => { this.dragEndSubject.next( event ) } );
    }
}