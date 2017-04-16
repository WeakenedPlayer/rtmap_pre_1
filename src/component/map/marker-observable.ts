import * as Leaflet from 'leaflet';
import { Observable, Subject } from 'rxjs';

export class MarkerObservable {
    private static fromEvent<EVENT extends Leaflet.Event>( marker: Leaflet.Marker, type: string ): Observable<EVENT> {
        let subject: Subject<EVENT> = new Subject();
        marker.addEventListener( type, event => subject.next( event as EVENT ) );
        return subject.asObservable();
    }
    
    static fromClickEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'click' );
    }
    
    static fromDoubleClickEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'dblclick' );
    }
    
    static fromMouseDownEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'mousedown' );
    }
    
    static fromMouseOverEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'mouseover' );
    }
    
    static fromMouseOutEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'mouseout' );
    }

    static fromContextMenuEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'contextmenu' );
    }
    
    static fromDragStartEvent( marker: Leaflet.Marker ): Observable<Leaflet.Event> {
        return MarkerObservable.fromEvent<Leaflet.Event>( marker, 'dragstart' );
    }
    
    static fromDragEvent( marker: Leaflet.Marker ): Observable<Leaflet.Event> {
        return MarkerObservable.fromEvent<Leaflet.Event>( marker, 'drag' );
    }
    
    static fromDragEndEvent( marker: Leaflet.Marker ): Observable<Leaflet.Event> {
        return MarkerObservable.fromEvent<Leaflet.Event>( marker, 'dragend' );
    }
}
