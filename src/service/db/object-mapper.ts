// firebase
import { AngularFire　} from 'angularfire2';
import * as firebase from 'firebase';
import { Observable, Subscriber } from 'rxjs';
import { DB } from './index';

/* ####################################################################################################################
 * オブジェクトをDBに格納する・DBから復元する
 * 格納対象をキーと本体に分解
 * ################################################################################################################# */
export class ObjectMapper {
    constructor( private af: AngularFire, private path: DB.Path ) {}

    // --------------------------------------------------------------------------------------------
    // オブジェクトを元にDBに格納するオブジェクトを作成する
    // --------------------------------------------------------------------------------------------
    private toDbObject( object: any ): any {
        let newObject = Object.assign( Object.create( object ), object );
        
        this.path.forEachParam( ( key ) => {
            delete newObject[ key ];
        } );
        
        return newObject;
    }
    // --------------------------------------------------------------------------------------------
    // 補助関数
    // --------------------------------------------------------------------------------------------
    getUrl( param?: any ): string {
        return this.path.toUrl( param ); 
    }
    
    // --------------------------------------------------------------------------------------------
    // オブジェクトを取得する
    // complete を発行しないので、利用者が止めること。
    // --------------------------------------------------------------------------------------------
    get( keys?: any ): Observable<DB.DbData> {
        let url = this.path.toUrl( keys );
        let observable: Observable<any> = this.af.database.object( url ) as Observable<any>;
        return observable.map( data => {
            console.log( data );
            return new DB.DbData( keys, data );
        } );
    }

    // --------------------------------------------------------------------------------------------
    // オブジェクトを取得する(同階層すべて)
    // --------------------------------------------------------------------------------------------
    getAll( keys?: any ): Observable<DB.DbData> {
        let url = this.path.getParent().toUrl( keys );
        return this.af.database.list( url ).map( data => {
            return new DB.DbData( keys, data );
        } );
    }
    
    // --------------------------------------------------------------------------------------------
    // オブジェクトを格納する
    // --------------------------------------------------------------------------------------------
    set( object: any ): Promise<void> {
        let dbObject = this.toDbObject( object );

        let ref = this.af.database.object( this.path.toUrl( object ) );
        return ref.set( dbObject ) as Promise<void>;
    }

    // --------------------------------------------------------------------------------------------
    // オブジェクトを更新する
    // --------------------------------------------------------------------------------------------
    update( object: any ): Promise<void> {
        // console.log( object );
        // console.log( this.path.toUrl() );
        let dbObject = this.toDbObject( object );

        let ref = this.af.database.object( this.path.toUrl( object ) );
        return ref.update( dbObject ) as Promise<void>;
    }
    
    // --------------------------------------------------------------------------------------------
    // オブジェクトを追加(IDは自動付与)する
    // --------------------------------------------------------------------------------------------
    push( object: any ): Promise<any> {
        let dbObject = this.toDbObject( object );
        let ref = this.af.database.list( this.path.getParent().toUrl( object ) );
        
        return new Promise( ( resolve ) => {
            ref.push( dbObject ).then( ( result )=>{ resolve( result ); } );
        } );
    }

    // --------------------------------------------------------------------------------------------
    // オブジェクトを削除する
    // --------------------------------------------------------------------------------------------
    remove( keys?: any ): Promise<void> {
        return this.af.database.object( this.path.toUrl( keys) ).remove() as Promise<void>;
    }
    
    // --------------------------------------------------------------------------------------------
    // オブジェクトを削除する(URLの末端(通常はID)の階層を)
    // TODO: さらに上の階層で削除がいる場合は想定していなかったが、必要なら作ること。
    // --------------------------------------------------------------------------------------------
    removeAll( keys?: any ): Promise<void> {
        return this.af.database.object( this.path.getParent().toUrl( keys ) ).remove() as Promise<void>;
    }
}
