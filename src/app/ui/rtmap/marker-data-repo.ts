import { DB, Map } from 'component';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs';

export class MarkerData {
    constructor(
            public readonly key: string,
            public readonly ts: number,
            public lat: number,
            public lng: number,
            public icon: string
            ) {}
}

// $key    : key
// $exists : existsプロパティより 
// lng : 
// lat : 
// i   : icon
// t   : time stamp
// 効率が悪い。配列の変化は一度に1つだけ。
export class MarkerDataRepo extends DB.SimpleMapper<MarkerData>{
    private latestInfo: { [key:string]: MarkerData } = {};

    constructor( af: AngularFire, path: DB.Path ){
        super( af, path.move( DB.Path.fromUrl('$key') ) );
    }

    protected db2obj( keys: any, values: any ): MarkerData {
        // 存在が消えたことは判断できない(配列の場合、配列全体に対してExistsが適用される)
        return new MarkerData( values.$key, values.t, values.lat, values.lng, values.i );
    }

    get( key: string ): Observable<MarkerData> {
        return this.getDb( { key: key } );
    } 

    getAll( keys?: any ): Observable<MarkerData[]> {
        return this.getAllDb();
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
