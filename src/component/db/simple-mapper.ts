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
    // values には、firebaseの結果が入っている
    // $value が空なら、そのデータは存在しないことになる。
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
        return this.mapper.get( keys ).map( dbData => {
            // 存在しなければ null
            if( !dbData.values.$exists() ) {
                return null;
            }
            return this.db2obj( dbData.keys, dbData.values );
        } );
    }

    // --------------------------------------------------------------------------------------------
    // C[R]UD: 更新した箇所だけ取り出すようにしたい(タイムスタンプ)
    // --------------------------------------------------------------------------------------------
    getAllDb( keys?: any ): Observable<T[]>  {
        return this.mapper.getAll( keys ).map( dbData => {
            let result = Array<T>( dbData.values.length );
            dbData.values.forEach( ( value, index ) => {
                result[ index ] = this.db2obj( dbData.keys, value );
            } );
            // 存在しなければ空配列
            return result;
        } );
    }
    
    // --------------------------------------------------------------------------------------------
    // C[R]UD: 更新した箇所だけ取り出すようにしたい(タイムスタンプ)
    // --------------------------------------------------------------------------------------------
    getAllMapDb( keys?: any ): Observable<{[key:string]:T}>  {
        return this.mapper.getAllMap( keys ).map( dbData => {
            let result: { [key:string]: T } = {};
            for( let key in dbData.values ) {
                result[ key ] = this.db2obj( dbData.keys, dbData.values[ key ] );
            }
            return result;
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

