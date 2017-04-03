import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs';

import * as ServiceId from './service-id';
import * as Census from './modules';

@Injectable()
export class Service {
    urlProvider: Census.UrlProvider;
    characterNameGetter: Census.CharacterNameGetter;
    characterProfileGetter: Census.CharacterProfileGetter;
    characterOnlineStatusGetter: Census.CharacterOnlineStatusGetter;
    worldGetter: Census.WorldGetter;
    
    private worldMap: { [key:string]: Census.World } = {};
    getWorldById( id: string ): Census.World {
        return this.worldMap[ id ];
    }
    
    // TODO: パラメータを入れる方法を調べること
    constructor( private http: Http ) {
        this.urlProvider = new Census.UrlProvider( ServiceId.CENSUS_SERVICE_ID );
        this.characterNameGetter = new Census.CharacterNameGetter( http, this.urlProvider );
        this.characterProfileGetter = new Census.CharacterProfileGetter( http, this.urlProvider );
        this.characterOnlineStatusGetter = new Census.CharacterOnlineStatusGetter( http, this.urlProvider );
        this.worldGetter = new Census.WorldGetter( http, this.urlProvider );
        
        // 暫定: リトライなし
        this.worldGetter.get().toPromise().then( worlds => {
            if( worlds ) {
                for( let world of worlds ) {
                    this.worldMap[ world.world_id ] = world;
                }
            }
            console.log(  this.worldMap );
        } );
        
    } 
    
    getCharacterNames( partialName: string ): Observable<Census.CharacterName[]>{
        return this.characterNameGetter.get( partialName );
    }
    
    getCharacterProfiles( cids: string[] ): Observable<Census.CharacterProfile[]> {
        return this.characterProfileGetter.get( cids );
    }
    
    getCharacterOnlineStatuses( cids: string[] ): Observable<Census.CharacterOnlineStatus[]> {
        return this.characterOnlineStatusGetter.get( cids );
    }
    
    getWorlds( worldIds: string[] ): Observable<Census.World[]> {
        return this.worldGetter.get( worldIds );
    }
}
