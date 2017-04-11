// firebase
import { DB } from './index';
import { AngularFire } from 'angularfire2';
import * as firebase from 'firebase';
import { Observable, Subscriber } from 'rxjs';

/* ####################################################################################################################
 * 更新されたこと
 * 新しいこと
 * 削除されたことを知るための処置
 * ################################################################################################################# */
export class ChangeObservable{
    static modified<T>( obs: Observable<T[]>,
                        keyOf: ( obj: T ) => string | number,
                        signatureOf: ( obj: T ) => string | number ): Observable<T[]>{
        let signatures: { [key:string]: string | number } = {};
        let newSignatures: { [key:string]: string | number } = {};
        return obs.map( array => {
            let modifiedObjects: T[] = [];
            
            for( let obj of array ) {
                let signature = signatureOf( obj );
                let key = keyOf( obj );
                let oldSignature = signatures[ key ];
                
                // 以前から存在していて、前回と変化したら
                if( oldSignature && oldSignature != signature ) {
                    newSignatures[ key ] = signature;
                    modifiedObjects.push( obj );
                }
            }
            // シグネチャを更新
            signatures = newSignatures;
            
            if( modifiedObjects ) {
                return modifiedObjects;
            }
        } );
//      } ).filter( result => result.length > 0 );
    }
        
    static added<T>( obs: Observable<T[]>,
                     keyOf: ( obj: T ) => string | number ): Observable<T[]>{
        let keys: { [key:string]: boolean } = {};
        let newKeys: { [key:string]: boolean } = {};
                         
        return obs.map( array => {
            let newObjects: T[] = [];

            for( let obj of array ) {
                let key = keyOf( obj );
                
                // 以前存在してないなら
                if( !keys[ key ] ) {
                    newKeys[ key ] = true;
                    newObjects.push( obj );
                }
            }
            console.log( keys );
            keys = newKeys;
            if( newObjects ) {
                return newObjects;
            }
        } );
//      } ).filter( result => result.length > 0 );
    }

    static removed<T>( obs: Observable<T[]>,
                       keyOf: ( obj: T ) => string | number ): Observable<string[]>{
    let keys: { [key:string]: boolean } = {};
    let newKeys: { [key:string]: boolean } = {};
                     
    return obs.map( array => {
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
        if( removedKeys ) {
            return removedKeys;
        }
    } );
//    } ).filter( result => result.length > 0 );
}
}

