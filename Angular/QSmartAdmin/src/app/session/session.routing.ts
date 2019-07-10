import { Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { UnErrorComponent } from './error/unerror.component';

export const SessionRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '404',
      component: NotFoundComponent
    }, {
      path: 'error',
      component: ErrorComponent
    }, {
      path: 'forgot',
      component: ForgotComponent
    },    {
      path:'401',
      component:UnErrorComponent
    }]
  }
];
