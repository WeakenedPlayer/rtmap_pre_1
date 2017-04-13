/* ####################################################################################################################
 * 補助的なObservable
 * ################################################################################################################# */
import { Observable, Subscriber } from 'rxjs';

/* ####################################################################################################################
 * 以下の3つの補助的なObservable を生成するクラスメソッドを提供する
 * 変更したものだけ取り出す modified
 * 追加されたものだけ取り出す added
 * 削除されたもののキーだけ取り出す removed
 * ################################################################################################################# */
export class ChangeObservable{
    static modified<T>( obs: Observable<T[]>,
                        keyOf: ( obj: T ) => string | number,
                        signatureOf: ( obj: T ) => string | number ): Observable<T[]>{
        // signatures: オブジェクトが変化したことを知るための手段。プリミティブ型であればよいが、booleanは表現できる幅が狭いので number or stringを採用
        let signatures: { [key:string]: string | number } = {};
        return obs.map( array => {    
            let modifiedObjects: T[] = [];
            let newSignatures: { [key:string]: string | number } = {};
            
            for( let obj of array ) {
                let signature = signatureOf( obj );
                let key = keyOf( obj );
                let oldSignature = signatures[ key ];
                newSignatures[ key ] = signature;
                
                // 以前から存在していて、前回と変化したら後段に伝える
                if( oldSignature && oldSignature != signature ) {
                    modifiedObjects.push( obj );
                }
            }
            // シグネチャを更新
            signatures = newSignatures;
            
            // 空でも後段に伝える
            return modifiedObjects;
        } );
    }
        
    static added<T>( obs: Observable<T[]>,
                     keyOf: ( obj: T ) => string | number ): Observable<T[]>{
        let keys: { [key:string]: boolean } = {};
        return obs.map( array => {
            //console.log( 'add' );
            //console.log( keys );      
            let newObjects: T[] = [];
            let newKeys: { [key:string]: boolean } = {};

            for( let obj of array ) {
                let key = keyOf( obj );
                newKeys[ key ] = true;

                // 以前存在してないなら
                if( !keys[ key ] ) {
                    //console.log( key );      
                    newObjects.push( obj );
                }
            }
            keys = newKeys;

            // 空でも後段に伝える
            return newObjects;
        } );
    }

    static removed<T>( obs: Observable<T[]>,
                       keyOf: ( obj: T ) => string | number ): Observable<string[]>{
        let keys: { [key:string]: boolean } = {};
        return obs.map( array => {
            let newKeys: { [key:string]: boolean } = {};
            let removedKeys: string[] = [];
    
            for( let obj of array ) {
                let key = keyOf( obj );
                newKeys[ key ] = true;
                delete keys[ key ];
            }
            // keyof が使えないので
            for( let key in keys ) {
                removedKeys.push( key );
            }
            keys = newKeys;
            // console.log( removedKeys );
            // 空でも後段に伝える
            return removedKeys;
        } );
    }
}

