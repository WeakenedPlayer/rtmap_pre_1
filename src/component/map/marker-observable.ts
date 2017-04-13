import * as Leaflet from 'leaflet';
import { Observable, Subject } from 'rxjs';

export class MarkerObservable {
    private static fromEvent<EVENT extends Leaflet.Event>( marker: Leaflet.Marker, type: string ): Observable<EVENT> {
        let subject: Subject<EVENT> = new Subject();
        marker.addEventListener( type, event => subject.next( event as EVENT ) );
        return subject.asObservable();
    }
    
    fromClickEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'click' );
    }
    
    fromDoubleClickEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'dblclick' );
    }
    
    fromMouseDownEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'mousedown' );
    }
    
    fromMouseOverEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'mouseover' );
    }
    
    fromMouseOutEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'mouseout' );
    }

    fromContextMenuEvent( marker: Leaflet.Marker ): Observable<Leaflet.MouseEvent> {
        return MarkerObservable.fromEvent<Leaflet.MouseEvent>( marker, 'contextmenu' );
    }
    fromDragStartEvent( marker: Leaflet.Marker ): Observable<Leaflet.Event> {
        return MarkerObservable.fromEvent<Leaflet.Event>( marker, 'dragstart' );
    }
    fromDragEvent( marker: Leaflet.Marker ): Observable<Leaflet.Event> {
        return MarkerObservable.fromEvent<Leaflet.Event>( marker, 'drag' );
    }
    fromDragEndEvent( marker: Leaflet.Marker ): Observable<Leaflet.Event> {
        return MarkerObservable.fromEvent<Leaflet.Event>( marker, 'dragend' );
    }
}
