import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { AlertModule, ButtonsModule } from 'ng2-bootstrap';
import { UiModule } from '../ui/ui.module';

import { LandingComponent } from './landing/landing.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './dashboard/sub/profile/profile.component';
import { MapViewComponent } from './map-view/map-view.component';
// このモジュールは、Routerで各ビューをつなぐ役割をになう
// より複雑になってきたら、forRootを外部に持ち、ここではforChildだけつくることにする。
// Refactor routes to a routing module: https://angular.io/docs/ts/latest/tutorial/toh-pt5.html

// 画面再読み込みで404エラーが起こるのを防ぐ
// http://stackoverflow.com/questions/35284988/angular-2-404-error-occur-when-i-refresh-through-browser

const routes: Routes = [
                        // { path: 'handhsake',  component: TestHandshakeComponent },
                        { path: '',  component: LandingComponent },
                        { path: 'dashboard',  component: DashboardComponent },
                        { path: 'map',  component: MapViewComponent },
                        { path: '**', component: LandingComponent }
                      ];
@NgModule({
  declarations: [ LandingComponent, 
                  NotFoundComponent, DashboardComponent, ProfileComponent, MapViewComponent ],
  imports: [ BrowserModule,
             CommonModule,
             ReactiveFormsModule,
             RouterModule.forRoot(routes),
             UiModule,
             AlertModule.forRoot(),
             ButtonsModule.forRoot(),],
  exports: [ RouterModule, 
             LandingComponent, 
             NotFoundComponent ],
  providers: [ {provide: LocationStrategy, useClass: HashLocationStrategy} ]
})
export class ViewModule { }
