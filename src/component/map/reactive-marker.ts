import * as Leaflet from 'leaflet';
import * as This from './modules';
import { Observable } from 'rxjs';

export class ReactiveMarker extends Leaflet.Marker {
    private clickObservable: Observable<Leaflet.MouseEvent> = This.MarkerObservable.fromClickEvent( this ).publish().refCount();
    private doubleClickObservable: Observable<Leaflet.MouseEvent> = This.MarkerObservable.fromDoubleClickEvent( this ).publish().refCount();
    private mouseDownObservable: Observable<Leaflet.MouseEvent> = This.MarkerObservable.fromMouseDownEvent( this ).publish().refCount();
    private mouseOverObservable: Observable<Leaflet.MouseEvent> = This.MarkerObservable.fromMouseOverEvent( this ).publish().refCount();
    private mouseOutObservable: Observable<Leaflet.MouseEvent> = This.MarkerObservable.fromMouseOutEvent( this ).publish().refCount();
    private contextMenuObservable: Observable<Leaflet.MouseEvent> = This.MarkerObservable.fromContextMenuEvent( this ).publish().refCount();
    private dragStartObservable: Observable<Leaflet.Event> = This.MarkerObservable.fromDragStartEvent( this ).publish().refCount();
    private dragObservable: Observable<Leaflet.Event> = This.MarkerObservable.fromDragEvent( this ).publish().refCount();
    private dragEndObservable: Observable<Leaflet.Event> = This.MarkerObservable.fromDragEndEvent( this ).publish().refCount();

    get click$() { return this.clickObservable; }
    get doubleClick$() { return this.doubleClickObservable; }
    get mouseDown$() { return this.mouseDownObservable; }
    get mouseOver$() { return this.mouseOverObservable; }
    get mouseOut$() { return this.mouseOutObservable; }
    get contextMenu$() { return this.contextMenuObservable; }
    get dragStart$() { return this.dragStartObservable; }
    get drag$() { return this.dragObservable; }
    get dragEnd$() { return this.dragEndObservable; }

    constructor( latLng: Leaflet.LatLngExpression, options?: Leaflet.MarkerOptions ) {
        super( latLng, options );
    }
}
