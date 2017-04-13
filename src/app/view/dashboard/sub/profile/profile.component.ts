import { Component, OnInit, Input  } from '@angular/core';
import { Census } from 'component';
import { CharacterProfile } from './character-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    @Input() profile: CharacterProfile;
    constructor( private census: Census.Service ) {
    }

    ngOnInit() {
        console.log( this.profile);
    }
}
