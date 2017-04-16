import * as Leaflet from 'leaflet';
import { Observable } from 'rxjs';
import { Map } from 'component';

export class ReactiveMarker extends Leaflet.Marker {
    private clickObservable: Observable<Leaflet.MouseEvent> = Map.MarkerObservable.fromClickEvent( this ).publish();
    private doubleClickObservable: Observable<Leaflet.MouseEvent> = Map.MarkerObservable.fromDoubleClickEvent( this ).publish();
    private mouseDownObservable: Observable<Leaflet.MouseEvent> = Map.MarkerObservable.fromMouseDownEvent( this ).publish();
    private mouseOverObservable: Observable<Leaflet.MouseEvent> = Map.MarkerObservable.fromMouseOverEvent( this ).publish();
    private mouseOutObservable: Observable<Leaflet.MouseEvent> = Map.MarkerObservable.fromMouseOutEvent( this ).publish();
    private contextMenuObservable: Observable<Leaflet.MouseEvent> = Map.MarkerObservable.fromContextMenuEvent( this ).publish();
    private dragStartObservable: Observable<Leaflet.Event> = Map.MarkerObservable.fromDragStartEvent( this ).publish();
    private dragObservable: Observable<Leaflet.Event> = Map.MarkerObservable.fromDragEvent( this ).publish();
    private dragEndObservable: Observable<Leaflet.Event> = Map.MarkerObservable.fromDragEndEvent( this ).publish();

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
