import { Routes } from '@angular/router';
import { DepartmentquotamanageComponent } from './manage/departmentquotamanage.component';

export const DepartmentQuotaRoutes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: DepartmentquotamanageComponent
        }

      ]
  }
];
