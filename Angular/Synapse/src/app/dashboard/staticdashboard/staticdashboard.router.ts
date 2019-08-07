import { Routes } from '@angular/router';
import { StaticdashboardComponent } from './staticdashboard.component';
export const StaticDashboardRoutes: Routes = [
   { 
          path: '',
          children: 
          [
              {
                path: '',
                component: StaticdashboardComponent
             }
          ]
    } 
];
