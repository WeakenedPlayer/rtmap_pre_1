import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable, Subscription } from 'rxjs';
import { AngularFire, AngularFireAuth, FirebaseAuthState } from 'angularfire2';
import * as firebase from 'firebase';

import { ID, DB } from '../../';

const rootUrl = '/ids';
@Injectable()
export class Service {
    currentUserObservable: Observable<ID.UserInfo>;
    authStateObservable: Observable<FirebaseAuthState>;

    userRepos: ID.UserInfoRepo;
    //reqRepos: ID.RequestRepos;

    subscription: Subscription;

    constructor( private af: AngularFire ) {
        // 大きくないので実体を作ってしまう
        let root = DB.Path.fromUrl( rootUrl );
        this.subscription = new Subscription();
        this.userRepos = new ID.UserInfoRepo( this.af, root );
        // this.reqRepos = new ID.RequestRepos( this.af, root );

        this.authStateObservable = ( this.af.auth as Observable<FirebaseAuthState> ).publishReplay(1).refCount();
        this.currentUserObservable = this.authStateObservable
                                         .flatMap( authState => this.postAuthentication( authState ) )
                                         .publishReplay(1).refCount();
                                        
        // 解放はしない(動いている間ずっと必要)
        this.subscription.add( this.authStateObservable.subscribe() );
        this.subscription.add( this.currentUserObservable.subscribe() );
    }

    // --------------------------------------------------------------------------------------------
    // ログイン後に1回だけ行う、最終ログイン日更新(UIDの登録がなければ登録)
    // --------------------------------------------------------------------------------------------
    private postAuthentication( authState: FirebaseAuthState ): Observable<ID.UserInfo>{
        if( authState ) {
            return this.userRepos.getById( authState.auth.uid ).take(1)
            .do( user => {
                // 登録状況に応じて新規登録 or 更新する
                let next: Observable<ID.UserInfo>;
                if( user ) {
                    if( user.hasAdmittance ) {
                        next = Observable.fromPromise( this.userRepos.update( user.id ) ).map( () => user );
                    } else {
                        next = Observable.of( user );
                    }
                } else {
                    next = Observable.fromPromise( this.userRepos.register( authState.auth.uid ) )
                    .flatMap( () => this.userRepos.getById( authState.auth.uid ) );
                }
                return next;
            } ).flatMap( registeredUser => {
                return this.userRepos.getById( registeredUser.id );
            } );
        } else {
            return Observable.never();
        }
    }
    // --------------------------------------------------------------------------------------------
    // ログイン後に1回だけ行う、最終ログイン日更新(UIDの登録がなければ登録)
    // --------------------------------------------------------------------------------------------
    login(): Promise<FirebaseAuthState> {
        if( this.af.auth ){
            return ( this.af.auth.login() as Promise<FirebaseAuthState> );
        }
    }

    logout(): Promise<void> {
        if( this.af.auth ) {
            return ( this.af.auth.logout() as Promise<void> );
        }
    }
    
    signout(): Promise<void> {
        if( this.af.auth ){
            return ( firebase.auth().signOut() as Promise<void> );
        }
    }
}
