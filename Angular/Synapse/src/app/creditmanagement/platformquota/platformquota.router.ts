import { Routes } from '@angular/router';
import { PlatformquotamanageComponent } from './manage/platformquotamanage.component';

export const PlatformQuotaRoutes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: PlatformquotamanageComponent
        }
      ]
  }
];
