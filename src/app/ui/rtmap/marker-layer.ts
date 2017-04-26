import { Observer, Observable, Subject } from 'rxjs';
import { ChangeObservable, Map } from 'component';
import * as Leaflet from 'leaflet';
import * as This from './modules';

/* ####################################################################################################################
 * DBと同期したマーカを表示する。
 * 今のところ座標とアイコンだけ設定できる。
 * アクセス権は今後見直したい。
 * ################################################################################################################# */
export class MarkerLayer extends Map.MarkerSet<Map.Marker> {
    /* ----------------------------------------------------------------------------------------------------------------
     * マーカ更新タスク
     * ------------------------------------------------------------------------------------------------------------- */
    private synchronizerTask: Observable<void>;
    public get sync$(){ return this.synchronizerTask; }
    
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
                 this.getMarker( datum.key ).setLatLng( [ datum.lat, datum.lng ] );
             }
        } );
        
        // マーカ追加: マーカにイベントを登録している(Subscribe不要にするために、あえてObservableの形で使用していない)
        let added: Observable<void> = ChangeObservable.added<This.MarkerData>( observable,
                ( obj )=> obj.key )
        .map( markers => {
            for( let marker of markers ) {
                let m = new Map.Marker( marker.key, [ marker.lat, marker.lng ] );
                this.addMarker( m );
            }
        } );
        
        // マーカ削除
        let removed: Observable<void> = ChangeObservable.removed<This.MarkerData>( observable,
                ( obj )=> obj.key )
        .map( keys => {
            for( let key of keys ) {
                this.removeMarker( key );
            }
        } );
        
        this.synchronizerTask = Observable.concat( added, modified, removed ).publish().refCount();
    }
}
