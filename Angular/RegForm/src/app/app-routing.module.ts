import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegformComponent } from './regform/regform.component';
import { LoginComponent } from './login/login.component';
import { ResponsemsgComponent } from './responsemsg/responsemsg.component';
import { ValidpageComponent } from './validpage/validpage.component';
import { InvalidpageComponent } from './invalidpage/invalidpage.component';

const routes: Routes = [
  {path:'regform', component:RegformComponent},
  {path:'login', component:LoginComponent},
  {path:'resmsg', component:ResponsemsgComponent},
  {path:'valid', component:ValidpageComponent},
  {path:'invalid', component:InvalidpageComponent}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
