import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { AlertModule } from 'ng2-bootstrap';


import { LandingComponent } from './landing/landing.component';
import { NotFoundComponent } from './not-found/not-found.component';
// このモジュールは、Routerで各ビューをつなぐ役割をになう
// より複雑になってきたら、forRootを外部に持ち、ここではforChildだけつくることにする。
// Refactor routes to a routing module: https://angular.io/docs/ts/latest/tutorial/toh-pt5.html

// 画面再読み込みで404エラーが起こるのを防ぐ
// http://stackoverflow.com/questions/35284988/angular-2-404-error-occur-when-i-refresh-through-browser
/*
{ path: 'ids/request/detail/:uid',  component: RequestDetail },
{ path: 'ids/session/reception/:rid/',  component: RequestDetail },
{ path: 'ids/session/client/:cid/',  component: RequestDetail },
{ path: 'ids/session/:rid/:cid',  component: RequestDetail },
*/
const routes: Routes = [
                        // { path: 'handhsake',  component: TestHandshakeComponent },
                        { path: 'landing',  component: LandingComponent },
                        { path: '',   redirectTo: '/landing', pathMatch: 'full' },
                        { path: '**', component: NotFoundComponent }
                      ];
@NgModule({
  declarations: [ LandingComponent, 
                  NotFoundComponent, ],
  imports: [ BrowserModule,
             CommonModule,
             ReactiveFormsModule,
             RouterModule.forRoot(routes),
             AlertModule.forRoot()],
  exports: [ RouterModule, 
             LandingComponent, 
             NotFoundComponent ],
  providers: [ {provide: LocationStrategy, useClass: HashLocationStrategy} ]
})
export class ViewModule { }
