import { Routes } from '@angular/router';
import { MailserverComponent } from './manage/mailserver.component';

export const MailServerRoutes: Routes = [
   { 
          path: '',
          children: 
          [
              {
                path: '',
                component: MailserverComponent
              }
          ]
    } 
];
