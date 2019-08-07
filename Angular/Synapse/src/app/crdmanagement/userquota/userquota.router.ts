import { Routes } from '@angular/router';
import { UserquotaComponent } from './manage/userquota.component';

export const UserQuotaRoutes: Routes = [
   { 
          path: '',
          children: 
          [
              {
                path: '',
                component: UserquotaComponent
             }
          ]
    } 
];
