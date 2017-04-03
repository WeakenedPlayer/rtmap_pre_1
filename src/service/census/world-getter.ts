import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Headers, Http } from '@angular/http';
import * as Common from './common';

class WorldList {
    world_list: World[];
}

/* CensusAPI が返してくる応答の一部 */
export class World {
    world_id: string;
    state: string;
    name: {
        en: string;
    };
}

export class WorldGetter extends Common.QueryBase<string[],WorldList,World[]>{
    constructor( http: Http, baseProvider: Common.IBaseUrlProvider ) {
        super( http, baseProvider );
    }
    
    queryUrl( worldIds: string[] ): string {
        if( worldIds ) {
            return 'world?world_id='+ worldIds.join(',');
        } else {
            return 'world?c:limit=100'; // 全サーバ取得(100はよっぽど大丈夫だろうという数字)
        }
    }
    
    extract( response: WorldList ): World[] {
        return response.world_list;
    }
}
