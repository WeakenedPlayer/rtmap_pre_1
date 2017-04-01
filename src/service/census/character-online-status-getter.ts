import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Headers, Http } from '@angular/http';
import * as Common from './common';

class CharacterProfileList {
    characters_online_status_list: CharacterOnlineStatus[];
}

export class CharacterOnlineStatus {
    character_id: string;
    online_status: boolean;
}

export class CharacterOnlineStatusGetter extends Common.QueryBase<string[],CharacterProfileList,CharacterOnlineStatus[]>{
    constructor( http: Http, baseProvider: Common.IBaseUrlProvider ) {
        super( http, baseProvider );
    }
    
    queryUrl( characterIds: string[] ): string {
        return 'characters_online_status?character_id='+ characterIds.join(',');
    }
    extract( response: CharacterProfileList ): CharacterOnlineStatus[] {
        return response.characters_online_status_list;
    }
}
