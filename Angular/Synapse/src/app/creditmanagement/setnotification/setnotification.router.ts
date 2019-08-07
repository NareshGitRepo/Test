import { Routes } from '@angular/router';
import { SetnotificationComponent } from './manage/setnotification.component';

export const NotificationRoutes: Routes = [
   { 
          path: '',
          children: 
          [
              {
                path: '',
                component: SetnotificationComponent
              }
          ]
    } 
];
