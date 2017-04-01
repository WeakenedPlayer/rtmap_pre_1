import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { AngularFire, AngularFireAuth, FirebaseAuthState } from 'angularfire2';
import * as firebase from 'firebase';

import { ID, DB } from '../../';

const rootUrl = '/ids';
@Injectable()
export class Service {
    // private化する
    private currentUserObservable: Observable<ID.UserInfo>;
    private authStateObservable: Observable<FirebaseAuthState>;

    // 読み込み状況...読み込み開始～完了までが false であること。
    private isAuthStateLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isCurrentUserLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

    get $authState(){ return this.authStateObservable; }
    get $currentUser(){ return this.currentUserObservable; }
    get $isAuthStateLoaded(){ return this.isAuthStateLoaded; }
    get $isCurrentUserLoaded(){ return this.isCurrentUserLoaded; }

    userRepos: ID.UserInfoRepo;
    //reqRepos: ID.RequestRepos;

    subscription: Subscription;

    constructor( private af: AngularFire ) {
        // 大きくないので実体を作ってしまう
        let root = DB.Path.fromUrl( rootUrl );
        this.subscription = new Subscription();
        this.userRepos = new ID.UserInfoRepo( this.af, root );
        // this.reqRepos = new ID.RequestRepos( this.af, root );

        this.authStateObservable = ( this.af.auth as Observable<FirebaseAuthState> ).do( authState => {
            this.isAuthStateLoaded.next( true );    // 一度読まれたことを保持する
            return authState;
        } ).publishReplay(1).refCount();
        
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
                this.isCurrentUserLoaded.next( true );
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
        // 読み込み状況を更新
        this.isAuthStateLoaded.next( false );
        this.isCurrentUserLoaded.next( false );
        return ( this.af.auth.login() as Promise<FirebaseAuthState> );
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
