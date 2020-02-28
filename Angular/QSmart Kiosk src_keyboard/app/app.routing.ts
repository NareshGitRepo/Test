import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './core';
import { AppComponent } from './app.component';
import { AppGuard } from './app.guard';
import { KeyboardClassKey, IKeyboardLayouts, keyboardLayouts } from '@ngx-material-keyboard/core';
// import { AuthLayoutComponent } from './core/auth-layout/auth-layout.component';

export const AppRoutes: Routes = [{
  path: '',
  component: AdminLayoutComponent,
  children: [
    {
      path: '',
      loadChildren: './language/language.module#LanguageModule'
    },
    {
      path: 'dashboard',
      loadChildren: './dashboard/dashboard.module#DashboardModule'
    },
    {
      path: 'registration',
      loadChildren: './registration/registration.module#RegistrationModule'
    },
    {
      path: 'pharmacy',
      loadChildren: './pharmacy/pharmacy.module#PharmacyModule'
    }, {
      path: 'laboratory',
      loadChildren: './laboratory/laboratory.module#LaboratoryModule'
    }, {
      path: 'feedback',
      loadChildren: './feedback/feedback.module#FeedbackModule'
    }, {
      path: 'checkin',
      loadChildren: './checkin/checkin.module#CheckinModule'
    },
    {
      path: '',
      component: AppComponent,
      canActivate: [AppGuard]
    }
  ]
},
  // {
  //   path: '',
  //   component: AuthLayoutComponent,
  //   children: [{
  //     path: 'session',
  //     loadChildren: './session/session.module#SessionModule'
  //   }]
  // }, {
  //   path: '**',
  //   redirectTo: 'session/404'
  // }
];