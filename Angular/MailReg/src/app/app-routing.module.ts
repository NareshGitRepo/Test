import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NextpageComponent } from './nextpage/nextpage.component';
import { SuccessComponent } from './success/success.component';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'reg', component: AppComponent },
  { path: 'first', component: FirstpageComponent },
  { path: 'next', component: NextpageComponent },
  { path: 'success', component: SuccessComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
