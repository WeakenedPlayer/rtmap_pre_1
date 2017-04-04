import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LeafletMapComponent } from './leaflet/map.component';

@NgModule({
  declarations: [ LeafletMapComponent ],
  imports: [ BrowserModule,
             CommonModule,
             ReactiveFormsModule ],
  exports: [ LeafletMapComponent ],
  providers: []
})
export class UiModule { }