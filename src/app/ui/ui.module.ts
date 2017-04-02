import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [  ],
  imports: [ BrowserModule,
             CommonModule,
             ReactiveFormsModule,],
  exports: [  ],
  providers: []
})
export class UiModule { }
