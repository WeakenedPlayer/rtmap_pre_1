import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';

@NgModule({
  declarations: [ MapComponent ],
  imports: [ BrowserModule,
             CommonModule,
             ReactiveFormsModule ],
  exports: [ MapComponent ],
  providers: []
})
export class UiModule { }