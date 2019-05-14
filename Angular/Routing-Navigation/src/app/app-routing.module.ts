import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServiceComponent } from './service/service.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomedetailsComponent } from './homedetails/homedetails.component';
import { ImagesComponent } from './images/images.component';

const route: Routes = [
  {
    path:'Home',
    component:ImagesComponent
  },
  {
    path:'Users',
    component:HomeComponent
  },
  {
    path:'Users/:id',
    component:HomedetailsComponent
  },
  {
    path:'Service',
    component:ServiceComponent
  },
  {
    path:'About',
    component:AboutComponent
  },
  { path: '',
    redirectTo: 'Home',
    pathMatch: 'full'
},
  {
    path:"**",
    component:PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(route,{ 
                                        enableTracing: true 
                                      } //debugging purpose only
                                )
            ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents = [ ImagesComponent,HomeComponent,ServiceComponent,
                                  AboutComponent,PageNotFoundComponent,HomedetailsComponent]
