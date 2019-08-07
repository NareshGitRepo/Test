import { Routes } from '@angular/router';
import { CreateSmsTemplateComponent } from './create/createsmstemplate.component';
import { SmsTemplateComponent } from './manage/smstemplate.component';

export const SmsTemplateRoutes: Routes = [
  {

    path: '',
    children:
      [
        {
          path: '',
          component: SmsTemplateComponent
        },
        {
          path: 'createsmstemplate',
          component: CreateSmsTemplateComponent
        }
      ]


  }
];
