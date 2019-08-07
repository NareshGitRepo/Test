import { Routes } from '@angular/router';
import { CreatefilterkeyComponent } from './create/createfilterkey.component';
import { FilterkeyComponent } from './manage/filterkey.component';


export const FilterkeyRoutes: Routes = [
   { 
          path: '',
          children: 
          [
              {
                path: '',
                component: FilterkeyComponent
              },
              {
                path: 'createfilterkey',
                component: CreatefilterkeyComponent
              }
          ]
    } 
];
