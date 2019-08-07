import { Routes } from '@angular/router';
import { DashboardComponent } from './manage/dashboard.component';

export const DashboardRoutes: Routes = [
   { 
          path: '',
          children: 
          [
              {
                path: '',
                component: DashboardComponent
             }
          ]
    } 
];
