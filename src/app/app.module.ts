import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { AppComponent } from './app.component';
import { Census, ID } from '../service';
import { ViewModule } from './view/view.module';

const firebaseConfig = {
        apiKey: 'AIzaSyDGS2xVjmK_q5HtLfOg5TztHz_Ftu00bQ8',
        authDomain: 'ps2-rtmap-pts.firebaseapp.com',
        databaseURL: 'https://ps2-rtmap-pts.firebaseio.com',
        storageBucket: 'ps2-rtmap-pts.appspot.com',
        messagingSenderId: '1048696211507'
};


const firebaseAuthConfig = {
        provider: AuthProviders.Google,
        method: AuthMethods.Popup
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ViewModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp( firebaseConfig, firebaseAuthConfig )
    ],
    providers: [ Census.Service, ID.Service ],
  bootstrap: [AppComponent]
})
export class AppModule { }
