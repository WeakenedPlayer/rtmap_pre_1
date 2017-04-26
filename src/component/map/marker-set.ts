import { Observable, Subject } from 'rxjs';
import { ChangeObservable } from 'component';
import * as Leaflet from 'leaflet';
import * as This from './modules';

/* ####################################################################################################################
 * マーカの集合
 * 追加、削除、取得ができる。
 * 編集は取得後に自由に行ってよい。
 * ################################################################################################################# */
export class MarkerSet<MARKER extends This.Marker> extends Leaflet.LayerGroup {
    private markers: { [key: string]: MARKER } = {};
    /* ----------------------------------------------------------------------------------------------------------------
     * マーカ共通のイベント
     * 対象とするマーカのイベントが発火した時点で共通で作動する。
     * Eventのターゲットが DbMarker なので、そこから対象を特定することができるようになっている。
     * ------------------------------------------------------------------------------------------------------------- */
    private clickSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private doubleClickSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private mouseDownSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private mouseOverSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private mouseOutSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private contextMenuSubject: Subject<Leaflet.MouseEvent> = new Subject();
    private dragStartSubject: Subject<Leaflet.Event> = new Subject();
    private dragSubject: Subject<Leaflet.Event> = new Subject();
    private dragEndSubject: Subject<Leaflet.Event> = new Subject();

    /* ----------------------------------------------------------------------------------------------------------------
     * 外部からアクセスできるサブジェクト
     * ------------------------------------------------------------------------------------------------------------- */
    public get click$() { return this.clickSubject.asObservable(); }
    public get doubleClick$() { return this.doubleClickSubject.asObservable(); }
    public get mouseDown$() { return this.mouseDownSubject.asObservable(); }
    public get mouseOver$() { return this.mouseOverSubject.asObservable(); }
    public get mouseOut$() { return this.mouseOutSubject.asObservable(); }
    public get contextMenu$() { return this.contextMenuSubject.asObservable(); }
    public get dragStart$() { return this.dragStartSubject.asObservable(); }
    public get drag$() { return this.dragSubject.asObservable(); }
    public get dragEnd$() { return this.dragEndSubject.asObservable(); }

    /* ----------------------------------------------------------------------------------------------------------------
     * 全マーカで共有するイベントリスナ
     * ------------------------------------------------------------------------------------------------------------- */
    private clickEventListener( event: Leaflet.MouseEvent ) { this.clickSubject.next( event ) }
    private doubleClickEventListener( event: Leaflet.MouseEvent ) { this.doubleClickSubject.next( event ) }
    private mouseDownEventListener( event: Leaflet.MouseEvent ) { this.mouseDownSubject.next( event ) }
    private mouseOverEventListener( event: Leaflet.MouseEvent ) { this.mouseOverSubject.next( event ) }
    private mouseOutEventListener( event: Leaflet.MouseEvent ) { this.mouseOutSubject.next( event ) }
    private contextMenuEventListener( event: Leaflet.MouseEvent ) { this.contextMenuSubject.next( event ) }
    private dragStartEventListener( event: Leaflet.Event ) { this.dragStartSubject.next( event ) }
    private dragEventListener( event: Leaflet.Event ) { this.dragSubject.next( event ) }
    private dragEndEventListener( event: Leaflet.Event ) { this.dragEndSubject.next( event ) }

    /* ----------------------------------------------------------------------------------------------------------------
     * マーカの追加、取得、削除
     * ------------------------------------------------------------------------------------------------------------- */
    addMarker( marker: MARKER ): void {
        marker
        .addEventListener( 'click', this.clickEventListener, this )
        .addEventListener( 'doubleclick', this.doubleClickEventListener, this )
        .addEventListener( 'mousedown', this.mouseDownEventListener, this )
        .addEventListener( 'mouseover', this.mouseOverEventListener, this )
        .addEventListener( 'mouseout', this.mouseOutEventListener, this )
        .addEventListener( 'contextmenu', this.contextMenuEventListener, this )
        .addEventListener( 'dragstart', this.dragStartEventListener, this )
        .addEventListener( 'drag', this.dragEventListener, this )
        .addEventListener( 'dragend', this.dragEndEventListener, this ); // 第3引数でthisが何を指すかを指定しておく。

        this.markers[ marker.key ] = marker;
        this.addLayer( marker );
    }
    
    getMarker( key: string ): MARKER {
        return this.markers[ key ];
    }
    
    removeMarker( key: string ): void {
        this.markers[ key ].remove();
        this.markers[ key ] = null;
    }
    /* ----------------------------------------------------------------------------------------------------------------
     * コンストラクタ
     * ------------------------------------------------------------------------------------------------------------- */
    constructor( layers?: Leaflet.Layer[] ) {
        super( layers );
    }
}
