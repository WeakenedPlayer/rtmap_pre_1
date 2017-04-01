import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire , FirebaseObjectObservable, FirebaseListObservable, AngularFireAuth, FirebaseRef } from 'angularfire2';
import * as firebase from 'firebase';       // required for timestamp
import { Subscription, Observable } from 'rxjs';
import { ID } from '../../../service';
import 'rxjs/add/operator/toPromise';

import * as VM from './view-model';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
    vm: VM.ViewModel;
    msg: string = 'n/a';
    isLoggedIn: boolean = false;
    constructor( private af: AngularFire, private idservice: ID.Service ) {
        this.vm = new VM.ViewModel(af, idservice );
    }
    ngOnInit(){}
    ngOnDestroy() {}
    
    login() {
        this.vm.login();
    }

    logout() {
        this.vm.logout();
    }

    signout() {
        this.vm.signout();
    }
}