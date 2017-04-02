import { Observable, Subscriber } from 'rxjs';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

class ServiceErrorResponse extends Error {
    // no data fournd, service unavailable etc...
    name: string = 'Census API Error'; 
    message: string = 'Service unavailable or invalid query';
}

// Census APIとのやり取りの共通部分を担う基底クラス
export abstract class QueryBase<ParameterT,ResponseT,ResultT> {
    protected abstract queryUrl( param: ParameterT ): string;
    protected abstract extract( response: ResponseT ): ResultT;
    
    constructor( private http: Http, private baseProvider: IBaseUrlProvider ) {
    }

    get( param: ParameterT ): Observable<any> {
        return this.http.get( this.baseProvider.get() + this.queryUrl( param ) )
        .map( response => {
            if( response.status === 200 ) {
                return this.extract( ( response.json() ) as ResponseT );
            } else {
                // error
                return Observable.throw( response.status );
            }
        } );
    }
    
    query( param: ParameterT ): Promise<ResultT> {
        return this.get( param ).toPromise();
    }
}

export interface IBaseUrlProvider {
    get(): string;
    count(): string;
}

export class JoinQuery {
    typeOfCollectionToJoin: string;
    on?: string = null;
    to?: string = null;
    list?: boolean = null;
    show?: string[] = null;
    hide?: string[] = null;
    inject_at?: string = null;
    terms?: string;
    outer?: boolean = true;
    
    constructor( typeOfCollectionToJoin: string ){
        this.typeOfCollectionToJoin = typeOfCollectionToJoin;
    }
    toString(){
        let query = 'c:join=' + this.typeOfCollectionToJoin 
                  +            ( this.on        ? '^on:'        + this.on              : '' )
                  +            ( this.to        ? '^to:'        + this.to              : '' )
                  + '^list:' + ( this.list      ? '1'                                  : '0')
                  +            ( this.show      ? '^show:'      + this.show.join('\'') : '' )
                  +            ( this.hide      ? '^hide:'      + this.hide.join('\'') : '' )
                  +            ( this.inject_at ? '^inject_at:' + this.inject_at       : '' )
                  +            ( this.terms     ? '^terms:'     + this.terms           : '' )
                  + '^outer:' + ( this.outer     ? '1'                                  : '0');
        return query;
    }
}