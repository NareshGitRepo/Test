import { Routes } from '@angular/router';
import { OfflinealertsComponent } from './manage/offlinealerts.component';

export const OfflineAlertsRoutes: Routes = [
   { 
          path: '',
          children: 
          [
              {
                path: '',
                component: OfflinealertsComponent
             }
          ]
    } 
];
