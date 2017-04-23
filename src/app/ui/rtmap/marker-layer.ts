import { Observer, Observable, Subject } from 'rxjs';
import { ChangeObservable, Map } from 'component';
import * as Leaflet from 'leaflet';
import * as This from './modules';

class DbMarker extends Map.ReactiveMarker {
    constructor( public key: string, latLng: Leaflet.LatLngExpression ){
        super( latLng );
    } 
}

/* ####################################################################################################################
 * DBと同期したマーカを表示する。
 * 今のところ座標とアイコンだけ設定できる。
 * アクセス権は今後見直したい。
 * ################################################################################################################# */
export class MarkerLayer extends Leaflet.LayerGroup {
    private markers: { [key: string]: DbMarker } = {};
    /* ----------------------------------------------------------------------------------------------------------------
     * マーカ更新タスク
     * ------------------------------------------------------------------------------------------------------------- */
    private synchronizerTask: Observable<void>;
    public get sync$(){ return this.synchronizerTask; }
    
    /* ----------------------------------------------------------------------------------------------------------------
     * マーカ共通のイベント
     * 対象とするマーカのイベントが発火した時点で共通で作動する。
     * Eventのターゲットが DbMarker なので、そこから対象を特定することができるようになっている。
     * ------------------------------------------------------------------------------------------------------------- */
    private clickSubject: Subject<Leaflet.Event> = new Subject();
    private dragStartSubject: Subject<Leaflet.Event> = new Subject();

    public get click$() { return this.clickSubject.asObservable(); }
    public get dragStart$() { return this.dragStartSubject.asObservable(); }

    /* ----------------------------------------------------------------------------------------------------------------
     * コンストラクタ
     * ------------------------------------------------------------------------------------------------------------- */
    constructor( observable: Observable<This.MarkerData[]>, layers?: Leaflet.Layer[] ) {
        super( layers );
        
        // マーカ変更: 暫定的に座標の変更のみに対応する
        let modified: Observable<void> = ChangeObservable.modified<This.MarkerData>( observable, 
                ( obj )=> obj.key,
                ( obj )=> obj.ts )
        .map( dbdata => {
             for( let datum of dbdata ) {
                 // アイコン変更は後で実装
                 this.markers[ datum.key ].setLatLng( [ datum.lat, datum.lng ] );
             }
        } );
        
        // マーカ追加: マーカにイベントを登録している(Subscribe不要にするために、あえてObservableの形で使用していない)
        let added: Observable<void> = ChangeObservable.added<This.MarkerData>( observable,
                ( obj )=> obj.key )
        .map( markers => {
            for( let marker of markers ) {
                let m = new DbMarker( marker.key, [ marker.lat, marker.lng ] )
                            .addEventListener( 'click', event => { this.clickSubject.next( event ); } )
                            .addEventListener( 'dragstart', event => { this.dragStartSubject.next( event ); } );
                this.markers[ marker.key ] = m;
                this.addLayer( m );
            }
        } );
        
        // マーカ削除
        let removed: Observable<void> = ChangeObservable.removed<This.MarkerData>( observable,
                ( obj )=> obj.key )
        .map( keys => {
            for( let key of keys ) {
                this.markers[ key ].remove();
            }
        } );
        
        this.synchronizerTask = Observable.concat( added, modified, removed ).publish().refCount();
    }
}
