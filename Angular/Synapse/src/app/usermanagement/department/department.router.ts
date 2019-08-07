import { Routes } from '@angular/router';
import { CreatedepartmentComponent } from './create/createdepartment.component';
import { DepartmentComponent } from './manage/department.component';

export const DepartmentRoutes: Routes = [
   { 
          path: '',
          children: 
          [
              {
                path: '',
                component: DepartmentComponent
              },
              {
                path: 'createdepart',
                component: CreatedepartmentComponent
              }
          ]
    } 
];
