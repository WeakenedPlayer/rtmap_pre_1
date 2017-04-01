import { Census, ID, Comm, DB } from '../../../service';
import { AngularFire, AngularFireAuth, FirebaseAuthState } from 'angularfire2';
import * as firebase from 'firebase';
import { Observable, Subscription } from 'rxjs';

/* ####################################################################################################################
 * 画面を作るのに必要な情報を提供する
 * [1] ログイン情報が取得できているか
 * [2] ログインしているか
 * [3] ban が確認できているか
 * [4] ban されているか
 * 
 * 状態
 * ログイン情報確認中: please wait...
 * ログイン情報確認済 & ログインしていない: ログイン
 * ログイン情報確認済 & 入場許可確認中: please wait...
 * ログイン情報確認済 & 入場許可確認済 & 入場許可あり: 
      <alert *ngIf="vm.errorMsg" class="danger">Error: {{vm.errorMsg}}</alert>
 * ################################################################################################################# */


export class ViewModel {
    //　外部に公開する状態(書き込みはしないこと)
    // 第1段階: ログイン情報の取得
    isLoginCheckCompleted: boolean = false;
    isLoggedIn: boolean = false;
    userName: string = null;

    isAdmittanceCheckCompleted: boolean = false;
    userHasAdmittance: boolean = false;

    errorMessage: string = '';
    statusMessage: string = '';
    userInfoRepo: ID.UserInfoRepo = null;
    // 購読
    subscription: Subscription = null;

    constructor( private af: AngularFire,
                 private ids: ID.Service ){
        this.userInfoRepo = new ID.UserInfoRepo( af, DB.Path.fromUrl('/ids') );
        
        let loginCheck = this.ids.authStateObservable.do( authState => {
            // 初回のみ
            if( !this.isLoginCheckCompleted ) {
                this.isLoginCheckCompleted = true;
            }
            if( authState ) {
                this.isLoggedIn = true;
                this.userName = authState.auth.displayName;
            } else {
                this.isLoggedIn = false;
                this.userName = null;
            }
        } );
        
        let admittanceCheck = this.ids.currentUserObservable.do( user => {
            // 初回のみ
            if( !this.isAdmittanceCheckCompleted ) {
                this.isAdmittanceCheckCompleted = true;
            }
            this.userHasAdmittance = user.hasAdmittance;
        } );
        
        // 認証状態を確認
        this.subscription = new Subscription();
        this.subscription.add( loginCheck.subscribe() );
        this.subscription.add( admittanceCheck.subscribe() );
    }
    
    private setErrorMsg( msg?: string ) {
        if( msg ) {
            this.errorMessage = msg;
        } else {
            this.errorMessage = '';
        }
    }
    
    login(): Promise<void> {
        this.setErrorMsg();
        return this.ids.login().catch( err => {
            this.errorMessage = err;
        } );
    }

    logout(): Promise<void> {
        this.setErrorMsg();
        return this.ids.logout().catch( err => {
            this.errorMessage = err;
        } );
    }
    
    signout(): Promise<void> {
        this.setErrorMsg();
        return this.ids.signout().catch( err => {
            this.errorMessage = err;
        } );
    }
    destruct(){
        this.subscription.unsubscribe();
    }
}