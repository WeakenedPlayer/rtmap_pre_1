import { Component, OnInit, Input } from '@angular/core';
import { CharacterProfile } from './sub/profile/character-profile';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ID } from 'service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    profile: CharacterProfile;
    constructor( private location: Location, private router: Router, private ids: ID.Service ) {
        this.profile = new CharacterProfile( 'hello', 'world', 'faction', '123');
        console.log( this.profile );
    }

    ngOnInit() {
        console.log( this.profile );
    }

    goBack() {
        this.location.back();
    }

    gotoLanding() {
        this.router.navigate( [ '/' ] );
    }
    gotoMap() {
        this.router.navigate( [ '/map' ] );
    }
}
