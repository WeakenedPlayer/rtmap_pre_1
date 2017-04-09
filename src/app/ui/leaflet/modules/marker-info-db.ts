import { DB } from 'service';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs';
import * as Leaflet from 'leaflet';
import * as This from './modules';

// $key    : key
// $exists : existsプロパティより 
// lng : 
// lat : 
// i   : icon
// t   : time stamp

export class MarkerInfoDB extends DB.SimpleMapper<This.MarkerInfo>{
    private latestInfo: { [key:string]: This.MarkerInfo } = {};

    constructor( af: AngularFire, path: DB.Path ){
        super( af, path.move( DB.Path.fromUrl('$key') ) );
    }
    
    db2obj( keys: any, values: any ): This.MarkerInfo {
        // 存在が消えたことは判断できない(配列の場合、配列全体に対してExistsが適用される)
        return new This.MarkerInfo( values.$key, values.t, values.lat, values.lng, values.i );
    }

    get( key: string ): Observable<This.MarkerInfo> {
        return this.getDb( { key: key } );
    } 
    
    // 更新されたものだけ抽出する
    getChanges( keys?: any ): Observable<This.Change[]> {
        return this.getAllDb( keys ).map( markers => {
            //console.log( markers );
            let changes: This.Change[] = [];
            for( let marker of markers ) {
                let key = marker.key;
                let oldMarker: This.MarkerInfo = this.latestInfo[ key ];
                

                if( !oldMarker || oldMarker.ts != marker.ts ) {
                    changes.push( new This.Change( marker, oldMarker ) );
                    this.latestInfo[ key ] = marker;
                }
            }
            return changes;
        } );
    }

    add( key: string, lat: number, lng: number, icon: number ): Promise<void> {
        return this.setDb( { key: key, lat: lat, lng: lng, i: icon, t: DB.TimeStamp } );
    }

    push( lat: number, lng: number, icon: number ): Promise<string> {
        return this.pushDb( { lat: lat, lng: lng, i: icon, t: DB.TimeStamp } );
    }
    
    remove( key: string ): Promise<void> {
        return this.removeDb( { key: key } );
    }

    update( key: string, lat: number, lng: number, icon: number ): Promise<void> {
        return this.updateDb( { key: key, lat: lat, lng: lng, i: icon, t: DB.TimeStamp } );
    }
}
