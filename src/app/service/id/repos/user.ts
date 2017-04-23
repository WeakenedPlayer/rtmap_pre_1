import { DB } from 'component';
import { AngularFire  } from 'angularfire2';
import { Observable } from 'rxjs';

export class UserInfo {
    constructor(
            public readonly id: string,
            public hasAdmittance?: boolean,
            public updatedAt?: number,
            public ceatedAt?: number ) {
    }
}

export class UserInfoRepo extends DB.SimpleMapper<UserInfo> {
    constructor( af:AngularFire, prefix: DB.Path ) {
        super( af, prefix.move( DB.Path.fromUrl( 'user/$id' ) ) );
    }

    protected db2obj( keys: any, values: any ): UserInfo {
        return new UserInfo( values.$key, values.a, values.u, values.c );
    }
    
    getById( uid: string ): Observable<UserInfo> {
        return this.getDb( { id: uid } );
    }
    
    register( uid: string ): Promise<void> {
        return this.setDb( { id: uid, u: DB.TimeStamp, c: DB.TimeStamp, a: true } );
    }
    
    update( uid: string ): Promise<void> {
        return this.updateDb( { id: uid, u: DB.TimeStamp } );
    }
    
    setAdmitance( uid: string, admittance: boolean ): Promise<void> {
        return this.updateDb( { id: uid, a: admittance, u: DB.TimeStamp } );
    }
}
