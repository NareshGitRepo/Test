import { Routes } from '@angular/router';
import { OnlinealertsComponent } from './manage/onlinealerts.component';

export const OnlineAlertsRoutes: Routes = [
   { 
          path: '',
          children: 
          [
              {
                path: '',
                component: OnlinealertsComponent
             }
          ]
    } 
];
