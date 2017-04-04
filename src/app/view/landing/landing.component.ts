import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire , FirebaseObjectObservable, FirebaseListObservable, AngularFireAuth, FirebaseRef } from 'angularfire2';
import * as firebase from 'firebase';       // required for timestamp
import { Subscription, Observable } from 'rxjs';
import { ID } from '../../../service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
    errorMessage: string = '';

    get $isAuthStateLoaded(){ return this.ids.$isAuthStateLoaded; }
    get $userName(){ return this.ids.$authState.map( authState => authState ? authState.auth.displayName : '' ) }
    get $isCurrentUserLoaded(){ return this.ids.$isCurrentUserLoaded; }
    get $currentUser(){ return this.ids.$currentUser; }
    get $isLoggedIn(){ return this.ids.$authState.map( authState => !!authState ); }
    get $currentUserHasAdmittance(){ return this.ids.$currentUser.map( user => user.hasAdmittance); }

    constructor( private af: AngularFire, private ids: ID.Service ) {
    }
    ngOnInit(){}
    ngOnDestroy() {}
    
    login(): Promise<void> {
        this.setErrorMessage();
        return this.ids.login().catch( err => {
            this.setErrorMessage( err );
        } );
    }

    logout(): Promise<void> {
        this.setErrorMessage();
        return this.ids.logout().catch( err => {
            this.setErrorMessage( err );
        } );
    }
    
    signout(): Promise<void> {
        this.setErrorMessage();
        return this.ids.signout().catch( err => {
            this.setErrorMessage( err );
        } );
    }
    
    private setErrorMessage( msg?: string ) {
        if( msg ) {
            this.errorMessage = msg;
        } else {
            this.errorMessage = '';
        }
    }
}