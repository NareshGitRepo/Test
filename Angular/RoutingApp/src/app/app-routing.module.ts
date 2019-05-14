import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { ServiceComponent } from './service/service.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound';
import { UserdetailsComponent } from './userdetails/userdetails.component';

const routes: Routes = [
  {
    path:'Users',
    component:UserComponent
  },
  {
    path:'',
    redirectTo:'Users',
    pathMatch:'full'
  },
  {
    path:'Users/:id',
    component:UserdetailsComponent
  },
  {
    path:'Service',
    component:ServiceComponent
  },
  {
    path:'About',
    component:AboutComponent
  },
  {
    path:'**',
    component:PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents=[UserComponent,PageNotFoundComponent,
                       ServiceComponent,AboutComponent,UserdetailsComponent]
