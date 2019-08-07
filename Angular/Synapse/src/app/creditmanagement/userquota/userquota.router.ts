import { Routes } from '@angular/router';
import { UserquotamanageComponent } from './manage/userquotamanage.component';

export const UserQuotaRoutes: Routes = [
   { 
          path: '',
          children: 
          [
              {
                path: '',
                component: UserquotamanageComponent
             }
            //   {
            //     path: 'createdepart',
            //     component: CreatedepartmentComponent
            //   }
          ]
    } 
];
