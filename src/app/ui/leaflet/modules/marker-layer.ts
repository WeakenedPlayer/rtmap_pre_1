import { Observer, Subject } from 'rxjs';
import { Map, Leaflet } from '../';

/*
// marker observable
// 既にあるものは移動し、消えたものは消すし、ないものは作る
// それをどうするか
// マーカー群をどう識別するかがポイント
// 同一性は参照では定義できないのでキーになる
 * クリックしてマーカを選んだらイベント開始、あとはトラッキング…という風にしたい。
 * なので、すべてのマウスに対して同じObservableを作らせないといけない
 * 全てのマーカにイベントをつける必要がある
 * イベントObsは増やしたくない
 * 追加は簡単にしたい
 * 集約後は自由にしたい
 * */

export abstract class MarkerOperation {
    constructor( private targetKey: string ){}
    get target(): string { return this.targetKey; }
    abstract execute( marker?: Leaflet.Marker ): Leaflet.Marker;
}

export class MarkerRemoveOperation extends MarkerOperation {
    constructor( targetKey: string ){ super( targetKey ); }
    execute( marker?: Leaflet.Marker ): Leaflet.Marker { return null; }
}

export class MarkerMoveOperation extends MarkerOperation {
    constructor( targetKey: string, private lat: number, private lng: number, private option?: Leaflet.MapOptions ){
        super( targetKey );
    }
    execute( marker?: Leaflet.Marker ): Leaflet.Marker {
        if( marker ) {
            return marker.setLatLng( [ this.lat, this.lng ] ); // 戻り値は this なので、新しいオブジェクトは作られない (Leaflet API)
        } else {
            return Leaflet.marker( [ this.lat, this.lng ], this.option );
        }
    }
}

// 効率を考えて、あえて配列を受け取るものとした
export class MarkerLayer implements Observer<MarkerOperation[]> {
    private layer: Leaflet.LayerGroup;
    private markerMap: { [key:string]: Leaflet.Marker } = {};
    
    getLayerGroup(): Leaflet.LayerGroup {
        return this.layer;
    }
    
    constructor( private obs: Map.MarkerEvenetObservable ){
        this.layer = Leaflet.layerGroup([]);
    }
    next( operations: MarkerOperation[] ): void {
        let target: Leaflet.Marker;
        let result: Leaflet.Marker;
        let key: string;
        for( let operation of operations ) {
            // 既にある場合は、その結果を格納する。nullの場合は削除される。
            // executeの中で変更されていても良い。
            key = operation.target;
            target = this.markerMap[ key ];
            result = operation.execute( target );

            if( target ) {
                // 既に存在する場合…
                // resultが別のオブジェクトになったら古いものを消して新しいものを登録する
                if( target !== result ) {
                    this.layer.removeLayer( target );
                    
                    // nullの場合は消える
                    if( result !== null ) {
                        this.layer.addLayer( result );
                    }
                }
            } else {
                // 新しく追加する場合
                this.layer.addLayer( result );
                this.markerMap[ key ] = result;
                this.obs.add( key, result );
            }
        }
    }
    error( reason: string ): void {}
    complete(): void {}
}
