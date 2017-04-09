// firebase
import { DB } from './index';
import { AngularFire , FirebaseObjectObservable, FirebaseListObservable, AngularFireAuth, FirebaseRef } from 'angularfire2';
import * as firebase from 'firebase';
import { Observable, Subscriber } from 'rxjs';

/* ####################################################################################################################
 * 簡単なクラスに変換するマッパ
 * 外部キーがあってもJoinはしない
 * ################################################################################################################# */
export abstract class SimpleMapper<T> implements DB.Mapper<T> {
    private mapper: DB.ObjectMapper = null;
    constructor( af: AngularFire, path: DB.Path ) {
        this.mapper = new DB.ObjectMapper( af, path );
    }

    // --------------------------------------------------------------------------------------------
    // キーとDBから取得した値を用いて値を復元する
    // --------------------------------------------------------------------------------------------
    protected abstract db2obj( keys: any, values: any ): T;

    // --------------------------------------------------------------------------------------------
    // 補助関数
    // --------------------------------------------------------------------------------------------
    getUrl( param?: any ): string {
        return this.mapper.getUrl( param ); 
    }
    
    // --------------------------------------------------------------------------------------------
    // [C]RUD
    // オブジェクトを渡して、新しい値を作る(既存の場合は上書き)
    // --------------------------------------------------------------------------------------------
    protected setDb( obj: any ): Promise<void> {
        return this.mapper.set( obj );
    }
    
    // --------------------------------------------------------------------------------------------
    // [C]RUD
    // --------------------------------------------------------------------------------------------
    protected pushDb( obj: any ): Promise<string> {
        return this.mapper.push( obj ).then( reference => {
            return Promise.resolve( reference.key );
        } );
    }

    // --------------------------------------------------------------------------------------------
    // C[R]UD
    // キーとDBから取得した値を用いて読み出す
    // --------------------------------------------------------------------------------------------
    getDb( keys?: any ): Observable<T> {
        // materialize を防ぐため、map は使わず、必要な処理を一つのObservableで実行する。
        // console.log( keys );
        return Observable.create( ( subscriber: Subscriber<T> ) => {
            let subscription = this.mapper.get( keys ).subscribe( ( dbData ) => {
                // null を返さない。 exists()で判断する。
                let result: T;
                result = this.db2obj( dbData.keys, dbData.values );
                subscriber.next( result );
            },
            (err)=>{},
            ()=>{} );
            return subscription;
        } );
    }

    // --------------------------------------------------------------------------------------------
    // C[R]UD
    // --------------------------------------------------------------------------------------------
    getAllDb( keys?: any ): Observable<T[]>  {
        // materialize を防ぐため、map は使わず、必要な処理を一つのObservableで実行する。
        return Observable.create( ( subscriber: Subscriber<T[]> ) => {
            let subscription = this.mapper.getAll( keys ).subscribe( ( dbData ) => {
                let result = Array<T>( dbData.values.length );
                dbData.values.forEach( ( value, index ) => {
                    // exists の処置は
                    result[ index ] = this.db2obj( dbData.keys, value );
                } );
                subscriber.next( result );
            },
            (err)=>{},
            ()=>{} );
            return subscription;
        } );
    }

    // --------------------------------------------------------------------------------------------
    // オブジェクトを渡して、DBの値を一部上書きする(タイムスタンプを上書きから除外したい場合を想定)
    // --------------------------------------------------------------------------------------------
    protected updateDb( obj?: any ): Promise<void> {
        return this.mapper.update( obj );
    }

    // --------------------------------------------------------------------------------------------
    // キーを指定して、該当するオブジェクトを削除
    // --------------------------------------------------------------------------------------------
    protected removeDb( keys?: any ): Promise<void> {
        return this.mapper.remove( keys );
    }
    
    // --------------------------------------------------------------------------------------------
    // キーを指定して、該当するオブジェクト群を削除
    // --------------------------------------------------------------------------------------------
    protected removeDbAll( keys?: any ): Promise<void> {
        return this.mapper.removeAll( keys );
    }
}

